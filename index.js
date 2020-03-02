const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const nocache = require('nocache');

function getHtml(body) {
  return `
<html>
  <head>
    <script>
      window.addEventListener("message", receiveMessage, false);
      function receiveMessage(event) {
        console.log('message received: ', event);
        if (event && event.data) {
          const token = event.data;
          fetch('./', { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: "token=" + token})
            .then((response) => { 
              if (response.ok) { 
                window.location.href="./?" + new Date().getTime(); 
              } 
            } 
          );
        }
      }
    </script>
  </head>
  <body>
    ${body}
  </body>
</html>
`};

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(bodyParser.urlencoded({ extended: true }))
  .use(cookieParser())
  .use(nocache())
  .set('etag', false)
  .get('/', (req, res) => {
    console.log('GET / cookie monster sees: ', req.cookies);
    const token = req.cookies.token;
    res.status(200)
      .set('Content-Type', 'text/html')
      .send(getHtml(`HEROKU frame waiting for postMessage,<br />cookie token is: ${token}`));
    res.end();
  })
  .post('/', (req, res) => {
    console.log('POST / body is: ', req.body);
    res.cookie('token', req.body.token, { maxAge: 900000, httpOnly: true, sameSite: 'None', secure: true })
      .set('Content-Type', 'text/html')
      .redirect('./');
    res.end();
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
