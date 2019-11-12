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
  const { title, year, imdbRating } = req.body;
  const newFilm = {
    id: uuid(),
    title: title,
    year: year,
    imdbRating: imdbRating,
  };

  movies = [...movies, newFilm];

  fs.writeFile('data.json', JSON.stringify(movies), (err) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.json(newFilm);
    };
  });
});

app.put('/movies/:movieId', bodyParser.json(), (req, res) => {
  let newFilm;

  movies = movies.map(film => {
    const { id } = film;

    if (id === req.params.movieId) {
      const { title, year, imdbRating } = req.body;

      newFilm = {
        id,
        title: title,
        year: year,
        imdbRating: imdbRating,
      };

      return newFilm;
    }

    return film;
  });

  fs.writeFile('data.json', JSON.stringify(movies), (err) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.json(newFilm);
    };
  });

});

app.patch('/movies/:movieId', bodyParser.json(), (req, res) => {
  let newFilm;

  movies = movies.map(film => {
    const { id } = film;

    if (id === req.params.movieId) {
      newFilm = {
        ...film,
        ...req.body,
      };

      return newFilm;
    }

    return film;
  });

  fs.writeFile('data.json', JSON.stringify(movies), (err) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.json(newFilm);
    }
  });
});

app.delete('/movies/:movieId', (req, res) => {
  movies = movies.filter(({ id }) => id !== req.params.movieId);

  fs.writeFile('data.json', JSON.stringify(movies), (err) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.sendStatus(204);
    }
  });
});

app.listen(port, () => {
  console.log('Server is running on port 5000!😄')
});
