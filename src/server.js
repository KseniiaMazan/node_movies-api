'use strict';

const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const uuid = require('uuid/v4');

const port = 5000;
const app = express();

let movies = JSON.parse(fs.readFileSync('data.json', 'utf8'));

app.get('/movies', (request, response) => {
  const dataToSend = [...movies].sort((a,b) => a.year - b.year);

  response.json(dataToSend);
});

app.get('/movies/titles', (req, res) => {
  let titles = [...movies];

  if (req.query.year) {
    titles = titles.filter(({year}) => year === req.query.year);
    if (!titles.length) {
      res.status(404).send("Movie title is not found");
    }
  }

  titles = titles
      .sort((a, b) => a.title.localeCompare(b.title))
      .map(movie => movie.title)
      .join('\n');

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

app.post('/movies', bodyParser.json(), (req, res) => {
  const newFilm = {
    id: uuid(),
    title: req.body.title,
    year: req.body.year,
    imdbRating: req.body.imdbRating,
  };

  movies.push(newFilm);
  fs.writeFile('data.json', JSON.stringify(movies), (err) => {
    if (err) throw err;
  });

  res.json(newFilm);
});

app.put('/movies/:movieId',  bodyParser.json(), (req, res) => {
  let updatedFilm = movies.find(({ id }) => id === req.params.movieId);

  if(!updatedFilm) {
    res.status(404).send("Film is not found(");
  };

  updatedFilm = {
    ...updatedFilm,
    title: req.body.title,
    year: req.body.year,
    imdbRating: req.body.imdbRating,
  };

  movies = [...movies, updatedFilm];

  fs.writeFile('data.json', JSON.stringify(movies), (err) => {
    if (err) throw err;
  });

  res.json(updatedFilm);
});

app.patch('/movies/:movieId', bodyParser.json(), (req, res) => {
  let updatedFilm = movies.find(({ id }) => id === req.params.movieId);

  if(!updatedFilm) {
    res.status(404).send("Film is not found(");
  };

  updatedFilm = {
    ...updatedFilm,
    ...req.body,
  };

  movies = [...movies, updatedFilm];

  fs.writeFile('data.json', JSON.stringify(movies), (err) => {
    if (err) throw err;
  });

  res.json(updatedFilm);
});

app.delete('/movies/:movieId', (req, res) => {
  movies.filter(({ id }) => id !== req.params.movieId);
  fs.writeFile('data.json', JSON.stringify(movies), (err) => {
    if (err) throw err;
  });

  res.sendStatus(204);
});

app.listen(port, () => {
  console.log('Server is running on port 5000!😄')
});
