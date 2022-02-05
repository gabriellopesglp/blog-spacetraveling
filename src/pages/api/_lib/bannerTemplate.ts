export default function getBannerTemplate(images) {
  let logos

  if (images.length > 1) {
    logos = images.map(image => {
      return `<img src=${image}><h1>+</h1>`
    })
  } else {
    logos = images.map(image => {
      return `<img src=${image}>`
    })
  }

  logos = logos.toString().replace(',', '')

  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">

      <title>Thumbnail</title>

      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap" rel="stylesheet">

      <style>
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
          width: 160px;
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
