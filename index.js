const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
const bodyParser = require('body-parser');
const moment = require('moment');

const app = express();

nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

app.set('view engine', 'njk');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/mijor', (req, res) => {
  res.render('minor', { name: req.query.name });
});

app.get('/major', (req, res) => {
  res.render('major', { name: req.query.name });
});

const ageMiddleware = ((req, res, next) => {
  if (req.body.data !== '' && req.body.name !== '') {
    next();
  } else {
    res.render('index');
  }
});

app.post('/check', ageMiddleware, (req, res) => {
  const DATA_NASCIMENTO = req.body.data;
  const idade = moment().diff(moment(DATA_NASCIMENTO,  "DD/MM/YYYY"), 'years');

  console.log(req.body);

  if (idade < 18) {
    res.redirect(`/minor?name=${req.body.username}`);
  } else {
    res.redirect(`/major?name=${req.body.username}`);
  }
});

app.listen(3000);
