'use strict';

const express = require('express');
const fs = require('fs');

const port = 5000;
const app = express();

const movies = JSON.parse(fs.readFileSync('data.json', 'utf8'));

app.get('/movies', (request, response) => {
  const dataToSend = movies.sort((a,b) => a.year - b.year);

  response.json(dataToSend);
});

app.get('/movies/titles', (req, res) => {
  let titles = movies;

  if (req.query.year) {
    titles = titles.filter(({year}) => year === req.query.year);
    if (!titles.length) {
      res.status(404).send("Movie title is not found");
    }
  }

  titles = titles
      .sort((a, b) => a.title.localeCompare(b.title))
      .reduce((acc, item) => (
          acc = `${acc}\n${item.title}`
      ), '');

  res.send(titles);
});

app.get('/movies/:movieId', (request, response) => {
  const movie = movies.find(({ id }) => id === request.params.movieId);

  if (movie) {
    response.json(movie);
  } else {
    response.status(404).send("Oops, something went wrong");
  }
});

app.listen(port, () => {
  console.log('Server is running on port 5000!😄')
});
