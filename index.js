async function animateSquareWithRequest(url) {
  // Step 1: Create and style the square
  // A black square with a side of 100px is drawn in the top-left corner of the window
  const square = document.createElement('div')
  square.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100px;
    height: 100px;
    background-color: black;
  `
  document.body.appendChild(square)

  // Step 2: Wait 1 second before starting animation and request
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Step 3: Animate the square
  // Square begins a smooth, uniform linear movement to the right at a constant speed of 100px per second.
  // One second after starting its movement, the square should stop, having traveled a total of 100px.
  const animation = square.animate([{ transform: 'translateX(0px)' }, { transform: 'translateX(100px)' }], {
    duration: 1000,
    easing: 'linear',
    fill: 'forwards',
  })

  // Step 4: Start the request simultaneously with the animation
  // A GET request is sent to the URL provided to the function.
  // If the server responded with "1", then the color is green; if "0" — blue.
  // If the request was unsuccessful (status is not 200) or did not complete at all (network error), then red.
  const fetchPromise = fetch(url)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error('Request failed')
      }

      const text = await response.text()
      return text === '1' ? 'green' : 'blue'
    })
    .catch(() => 'red')

  // Step 5: Wait for both animation and request to complete
  // Condition 1: If the result of the request is known by the time the square stops,
  // then the color of the square should change at the moment of stopping (but not before).
  // Condition 2: If the request is not yet complete by the time the square stops, the square should still stop,
  // and its color should change as soon as the result of the request is known.
  // Hence we are waiting for both promises to resolve
  const [color] = await Promise.all([fetchPromise, animation.finished])

  // Step 6: Apply the color based on the request result
  square.style.backgroundColor = color
}

// Example usage:
animateSquareWithRequest('https://slowpoke.keev.me/slowpoke.php')
