'use strict';

const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const uuid = require('uuid/v4');
const path = require('path');
const filmsModel = require(path.join(__dirname, '../model/films-model.js'));

const port = 5000;
const app = express();

const handleModelErrors = (err) => {
  const modelError = {
    statusCode: 404,
    errorMessage: err.message,
  }

  throw modelError;
}

const handleApiErrors = (res) => {
  return (err) => {
    res.status(err.statusCode).json(err);
  }
}


let movies = JSON.parse(fs.readFileSync('data.json', 'utf8'));

app.get('/movies', (req, res) => {
  filmsModel.getFilms()
      .catch(handleModelErrors)
      .then(data => res.json(data))
      .catch(handleApiErrors(res))
});

app.get('/movies/titles', (req, res) => {
  filmsModel.getTitles(req.query.year)
      .catch(handleModelErrors)
      .then(data => {
        if (!data) {
          const err = {
            statusCode: 404,
            errorMessage: 'Not found',
          }

          throw err;
        }

        res.send(data)
      })
      .catch(handleApiErrors(res))
});

app.get('/movies/:movieId', (req, res) => {
  filmsModel.getFilmById(req.params.movieId)
      .catch(handleModelErrors)
      .then(data => {
        if (!data) {
          const err = {
            statusCode: 404,
            errorMessage: 'Not found',
          }

          throw err;
        }

        res.json(data)
      })
      .catch(handleApiErrors(res));
});

app.post('/movies', bodyParser.json(), (req, res) => {
  filmsModel.postMovie(req.body)
      .catch(handleModelErrors)
      .then(data => res.json(data))
      .catch(handleApiErrors(res));
});

app.put('/movies/:movieId', bodyParser.json(), (req, res) => {
  filmsModel.putMovie(req.params.movieId, req.body)
      .catch(handleModelErrors)
      .then(data => {
        if (!data) {
          const error = {
            statusCode: 404,
            errorMessage: 'Not found(',
          };

          throw error;
        };

        res.json(data);
      })
      .catch(handleApiErrors(res));
});

app.patch('/movies/:movieId', bodyParser.json(), (req, res) => {
  filmsModel.deleteMovie(req.params.movieId)
      .catch(handleModelErrors)
      .then(data => {
        if (!data) {
          const error = {
            statusCode: 404,
            errorMessage: 'Not found(',
          };

          throw error;
        };

        res.json(data);
      })
      .catch(handleApiErrors(res));
});

app.delete('/movies/:movieId', (req, res) => {
  filmsModel.patchMovie(req.params.movieId, req.body)
      .catch(handleModelErrors)
      .then(data => {
        if (!data) {
          const error = {
            statusCode: 404,
            errorMessage: 'Not found(',
          };

          throw error;
        };

        res.sendStatus(204);
      })
      .catch(handleApiErrors(res));
});

app.listen(port, () => {
  console.log('Server is running on port 5000!😄')
});
