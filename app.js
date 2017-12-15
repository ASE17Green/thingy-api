const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

// connect to db
mongoose.connect(config.database);

// check connection
mongoose.connection.on('connected', () => {
  console.log('Connected to database' + config.database);
});
mongoose.connection.on('error', (err) => {
  console.log('Database error' + err);
});

const app = express();

const thingys = require('./routes/thingys');
const users = require('./routes/users');
const userThingys = require('./routes/userthingys');

// port number
const port = 3300;

// cors middleware
app.use(cors());

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// body parser middleware
app.use(bodyParser.json());

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/user/thingy', thingys);
app.use('/user', users);
app.use('/user', userThingys);

// index route
app.get('/', (req, res) => {
  res.send('Invalide Endpoint :)');
});

// start server
app.listen(port, () => {
  console.log('Server started on port '+port);
})
