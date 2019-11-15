'use strict';

const express = require('express');
const path = require('path');

const { moviesRouter } = require('./router/movies-router');

const port = process.env.PORT || 5000;
const app = express();

app.use('/movies', moviesRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}!😄`)
});
