const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(bodyParser.urlencoded({ extended: true }))
  .use(cookieParser())
  .get('/', (req, res) => {
    res.status(200).send('This will be an hidden i-frame');
    res.end();
  })
  .post('/', (req, res) => {
    res.cookie('token', req.body.token, { maxAge: 900000, httpOnly: true });
    res.status(200).send(`Cookie monster ate your posted "token": ${req.body.token}`);
    res.end();
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
