export default function getBannerTemplate(images) {
  let logos

  if (images.length > 1) {
    logos = images.map(image => {
      const width = image.split('@')[1];
      const height = image.split('@')[2];
      const color = image.split('@')[3];

      return `<img src=${image.split('@')[0]} width=${width} height=${height} style="filter: var(--${color})"><h1>+</h1>`
    })
  } else {
    logos = images.map(image => {
      const width = image.split('@')[1];
      const height = image.split('@')[2];
      const color = image.split('@')[3];

      return `<img src=${image.split('@')[0]} width=${width} height=${height} "filter: var(--${color})">`
    })
  }

  logos = logos.toString()
  logos = logos.replace(",", "")
  logos = logos.replace(",", "")
  logos = logos.replace(",", "")
  logos = logos.replace(",", "")
  logos = logos.replace(",", "")
  logos = logos.replace(",", "")

  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">

      <title>Thumbnail</title>

      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap" rel="stylesheet">

      <style>
      :root {
        --white: invert(100%) sepia(7%) saturate(927%) hue-rotate(217deg) brightness(117%) contrast(100%);
        --none: none;
        --gray-100: #F8F8F8;
        --gray-200: #D7D7D7;
        --gray-300: #BBBBBB;
        --pink: #FF57B2;
      }

      body {
          margin: 0;
          font-family: Roboto, sans-serif;
          color: #FFF;
          background: url(https://i.imgur.com/C3Q0HFu.png) #1A1D23;
          height: 100vh;
      }

      #wrapper {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
      }

      .logo-svg {
          filter: var(--white);
      }

      svg {
          height: 40px;
          margin-top: 80px;
      }

      #container {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
      }

      img {
          padding-left: 40px;
          padding-right: 40px;
      }

      h1 {
        font-size: 60px;
      }

      h1:last-child {
        display: none;
      }
      </style>
  </head>
  <body>
      <div id="wrapper">
        <div id="container">
          ${logos}
        </div>
      </div>
  </body>
  </html>`
}
