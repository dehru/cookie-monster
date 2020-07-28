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

function getRenderedPage(req, res) {
  res.status(200)
    .set('Content-Type', 'text/html')
    .send(getHtml('Hello World'));
  res.end();
}

function renderWorkspace(req, res) {
  console.log('RENDERING WORKSPACE');
  res.status(200)
    .set('Content-Type', 'text/html')
    .send('<html><body><h1>Here is your workspace!</h1></body></html');
}

function processPost(req, res) {
  console.log('POST / body is: ', req.body);
  const partnerInfo = JSON.parse(req.body.partnerInfo);
  console.log('partnerInfo: ', partnerInfo);
  const workspace = partnerInfo.codespaceId;
  console.log('workspace: ', workspace);
  res.cookie('token', req.body.cascadeToken, { maxAge: 900000, httpOnly: true, sameSite: 'None', secure: true })
    .set('Content-Type', 'text/html')
    .redirect(`./workspace/${workspace}`);
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
  .post('/', processPost)
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
