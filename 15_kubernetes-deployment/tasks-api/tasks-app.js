const express = require('express');
const mongoose = require('mongoose');

const taskRoutes = require('./routes/task-routes');
const verifyUser = require('./middleware/user-auth');

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
});

app.use(verifyUser, taskRoutes);

app.use((err, req, res, next) => {
  let code = 500;
  let message = 'Something went wrong.';
  if (err.code) {
    code = err.code;
  }

  if (err.message) {
    message = err.message;
  }
  res.status(code).json({ message: message });
});

mongoose.connect(
  process.env.MONGODB_CONNECTION_URI,
  { useNewUrlParser: true },
  (err) => {
    if (err) {
      console.log('COULD NOT CONNECT TO MONGODB!');
    } else {
      app.listen(3000);
    }
  }
);
