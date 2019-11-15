"use strict";

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const uuid = require('uuid/v4');

const { handleReadFileErrors } = require('../utils/error-handling');

const MODEL_PATH = path.join(__dirname, '../../data.json');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

class MoviesModel {
  constructor(path) {
    this.modelPath = path;
  }

  async getFilms() {
    return readFile(this.modelPath)
        .catch(handleReadFileErrors)
        .then(movies => JSON.parse(movies).sort((a, b) => Number(a.year) - Number(b.year)));
  }

  async getFilmById(filmId) {
    return readFile(this.modelPath)
        .catch(handleReadFileErrors)
        .then(films => (
            JSON.parse(films).find(({ id }) => id === filmId)
        ));
  }

  preparedTitles(films, releaseYear) {
    const parsedFilms = JSON.parse(films);

    const preparedFilms = releaseYear
      ? parsedFilms.filter(({ year }) => year === releaseYear)
      : parsedFilms;

    return preparedFilms.map(({ title }) => title).join('\n');
  }

  async getTitles(releaseYear) {
    return readFile(this.modelPath)
        .catch(handleReadFileErrors)
        .then(films => (
            this.preparedTitles(films, releaseYear)
        ));
  }

  async postMovie(filmDetails) {
    const { title, imdbRating, year } = filmDetails;

    const newMovie = {
      id: uuid(),
      title,
      imdbRating,
      year,
    };

    return readFile(this.modelPath)
        .catch(handleReadFileErrors)
        .then(movies => JSON.parse(movies))
        .then(movies => (
          writeFile(this.modelPath, JSON.stringify([...movies, newMovie]))
              .catch(err => {
                if (err) {
                  const error = {
                    statusCode: 500,
                    errorMessage: err.message,
                  };

                  throw error;
                }
              })
              .then(() => newMovie)
        ));
  }

  async putMovie(filmId, filmDetails) {
    let newMovie;

    return readFile(this.modelPath)
        .catch(handleReadFileErrors)
        .then(movies => (
            JSON.parse(movies).map(film => {
              const { id } = film;

              if (id === filmId) {
                const {title, imdbRating, year} = filmDetails;

                newMovie = {
                  id,
                  title,
                  imdbRating,
                  year,
                };

                return newMovie;
              }
              ;

              return film;
            })
        ))
        .then(newMovies => (
            writeFile(this.modelPath, JSON.stringify(newMovies))
                .catch(err => {
                  if (err) {
                    const error = {
                      statusCode: 500,
                      errorMessage: err.message,
                    };

                    throw error;
                  };
                })
                .then(() => newMovie)
        ));
  }

  async patchMovie(filmId, filmDetails) {
    let newMovie;

    return readFile(this.modelPath)
        .catch(handleReadFileErrors)
        .then(movies =>  (
          JSON.parse(movies).map(film => {
            const { id } = film;

            if (id === filmId) {
              newMovie = {
                ...film,
                ...filmDetails,
              };

              return newMovie;
            };

            return film;
        })))
        .then(newMovies => (
            writeFile(this.modelPath, JSON.stringify(newMovies))
                .catch(err => {
                  if (err) {
                    const error = {
                      statusCode: 500,
                      errorMessage: err.message,
                    };

                    throw error
                  }})
                .then(() => newMovie)
        ));
  }

  async deleteMovie(movieId) {
    return readFile(this.modelPath)
        .catch(handleReadFileErrors)
        .then(films => ({
            preparedFilmsData: JSON.parse(films),
        }))
        .then(objWithFilms => {
          objWithFilms.updatedData = objWithFilms.preparedFilmsData.filter(({ id }) => id !== movieId);

          return objWithFilms;
        })
        .then(objWithFilms => (
          writeFile(this.modelPath, JSON.stringify(objWithFilms.updatedData))
              .catch(err => {
                if (err) {
                  const error = {
                    statusCode: 500,
                    errorMessage: err.message,
                  };

                  throw error;
                }})
              .then(() => objWithFilms.updatedData !== objWithFilms.preparedFilmsData)
        ));
  }
}

const moviesModel = new MoviesModel(MODEL_PATH);
module.exports = moviesModel;
