const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

function getHtml(body) {
  return `
<html>
<head>
<script>
window.addEventListener("message", receiveMessage, false);
function receiveMessage(event) {
  console.log('message received: ', event);
  if (event && event.data) {
    const token = event.data.token;
    fetch('./', { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: "token=" + token});
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
  .get('/', (req, res) => {
    res.status(200)
      .set('Content-Type', 'text/html')
      .send(getHtml('HEROKU frame waiting for postMessage'));
    res.end();
  })
  .post('/', (req, res) => {
    res.cookie('token', req.body.token, { maxAge: 900000, httpOnly: true })
      .set('Content-Type', 'text/html')
      .status(200)
      .send(`HEROKU Cookie monster ate your posted "token": ${req.body.token}`);
    res.end();
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
