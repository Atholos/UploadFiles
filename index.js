const express = require('express');
require('dotenv').config();
const mediaTable = require('./utils/media_table');
const multer = require('multer');
const db = require('./utils/database');
const bodyParser = require('body-parser');
const pass = require('./utils/pass');
const session = require('express-session');
const passport = require('passport');
const resize = require('./utils/resize');

const app = express();

const upload = multer({dest: 'public/uploads/'});

app.use(session({
  secret: 'keyboard LOL cat',
  resave: true,
  saveUninitialized: true,
  cookie: {secure: false},
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());

app.use(express.static('public'));

app.use('/modules', express.static('node_modules'));

app.get('/all', (req, res) => {
  mediaTable.select(res);
  // res.send(200);
});
app.get('/my', pass.loggedIn, (req, res) => {
  const data = [req.user.UserID];
  mediaTable.selectMyImages(data, res);
});

app.post('/image', pass.loggedIn, upload.single('my-image'),
    (req, res, next) => {
  // req body comes now from multer
  next();

});

app.use('/image', (req, res, next) => {
  // tee pieni thumbnail
  resize.doResize(req.file.path, 300,
      './public/thumbs/thumb_' + req.file.filename).
      then(data => {
        next();
      });

});

app.use('/image', (req, res, next) => {
  // lisää kuvan tiedot tietokantaan
  const data = [
    req.body.Description,
    req.body.Title,
    'thumbs/thumb_' + req.file.filename,
    'uploads/' + req.file.filename,
    'uploads/' + req.file.filename,
    req.user.UserID,
    req.body.Category,
  ];
  mediaTable.insert(data, res);
});

/*app.use('/category', (req, res, next) => {
  const data = [
    req.params.Instrument,
  ];
  mediaTable.categorySelect(data, connection, res);
  console.log(res);
});*/

// update image
app.patch('/update', pass.loggedIn, (req, res) => {
  // req body comes now from body-parser
  req.body.push(req.user.UserID);
  // use req.body as data
  mediaTable.update(req.body, res);
});

// delete image
app.delete('/del/:FileID', pass.loggedIn, (req, res) => {
  const data = [
    req.params.FileID,
    req.user.UserID,
  ];
  mediaTable.del(data, res);
});


//logout


// authentication with custom callback (http://www.passportjs.org/docs/authenticate/)
app.post('/login', pass.login,);

// register new user, automatically login
app.post('/register', pass.register, pass.login);

app.listen(3000);