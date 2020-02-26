const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(bodyParser.urlencoded({ extended: true }))
  .use(cookieParser())
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .post('/', (req, res) => {
    console.log('Got body:', req.body);
    res.cookie('token', req.body.token, { maxAge: 900000, httpOnly: true });
    res.status(200).send('hello i got your token here and set in a cooke named "token": ' + req.body.token);
    res.end();
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
