const express = require('express')
const next = require('next')
const bodyParser = require('body-parser')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

// // JSON parser middleware
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // CORS middleware
// app.use(function (req, res, next) {
//   // Allow Origins
//   res.header("Access-Control-Allow-Origin", "*");
//   // Allow Methods
//   res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
//   // Allow Headers
//   res.header("Access-Control-Allow-Headers", "Origin, Accept, Content-Type, Authorization");
//   // Handle preflight, it must return 200
//   if (req.method === "OPTIONS") {
//     // Stop the middleware chain
//     return res.status(200).end();
//   }
//   // Next middleware
//   next();
// });

app
  .prepare()
  .then(() => {
    const server = express()

    server.get('/playground/:page', (req, res) => {
      const page = req.params.page
      let file = ''
      switch (page) {
        case 'ruby':
          file = '/ruby'
          break
        case 'java':
          file = '/java'
          break
        case 'c':
          file = '/c'
          break
        default:
          file = '/index'
      }
      return app.render(req, res, file, { page })
    })

    server.get('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(3000, err => {
      if (err) throw err
      console.log('> Ready on http://localhost:3000')
    })
  })
  .catch(ex => {
    console.error(ex.stack)
    process.exit(1)
  })
