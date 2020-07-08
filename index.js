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
    </script>
  </head>
  <body>
    ${body}
  </body>
</html>
`};

function renderWorkspace(req, res) {
  console.log('RENDERING WORKSPACE');
  res.status(200)
    .set('Content-Type', 'text/html')
    .send('<html><body><h1>Here is your workspace!</h1></body></html');
}

function processPost(req, res) {
  console.log('POST / body is: ', req.body);
  res.cookie('token', req.body.cascadeToken, { maxAge: 900000, httpOnly: true, sameSite: 'None', secure: true })
    .set('Content-Type', 'text/html')
    .redirect('./');
  res.end();
}

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(bodyParser.urlencoded({ extended: true }))
  .use(cookieParser())
  .use(nocache())
  .set('etag', false)
  .get('/', getRenderedPage)
  .post('/platform-authentication', processPost)
  .get('/workspace/*', renderWorkspace)
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
