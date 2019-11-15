'use strict';

const express = require('express');
const fs = require('fs');
const uuid = require('uuid/v4');

const port = process.env.PORT || 5000;
const app = express();

let movies = JSON.parse(fs.readFileSync('data.json', 'utf8'));

app.get('/movies', (request, response) => {
  const moviesToSend = [...movies].sort((a,b) => a.year - b.year);

  response.json(moviesToSend);
});

app.get('/movies/titles', (req, res) => {
  let titles = [...movies];

  if (req.query.year) {
    titles = titles.filter(({ year }) => year === req.query.year);
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
    response.status(404).send("Movie title is not found");
  }
});

app.post('/movies', express.json(), (req, res) => {
  const { title, year, imdbRating } = req.body;
  const newFilmId = uuid();
  const newFilm = {
    id: newFilmId,
    title: title,
    year: year,
    imdbRating: imdbRating,
  };

  movies = [...movies, newFilm];

  fs.writeFile('data.json', JSON.stringify(movies), (err) => {
    if (err) {
      movies = movies.filter(({ id }) => id !== newFilmId);

      res.sendStatus(500);
    } else {
      res.json(newFilm);
    };
  });
});

app.put('/movies/:movieId', express.json(), (req, res) => {
  let newFilm;
  let oldFilm;
  const paramsMovieId = req.params.movieId;

  movies = movies.map(film => {
    const { id } = film;

    if (id === paramsMovieId) {
      oldFilm = film;

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
      movies = movies.map(film => {
        if (id === paramsMovieId) {
          return oldFilm;
        }

        return film;
      });

      res.sendStatus(500);
    } else {
      res.json(newFilm);
    };
  });

});

app.patch('/movies/:movieId', express.json(), (req, res) => {
  let newFilm;
  let oldFilm;

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
      movies = movies.map(film => {
        if (id === paramsMovieId) {
          return oldFilm;
        }

        return film;
      });

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
  console.log(`Server is running on port ${port}!😄`)
});
