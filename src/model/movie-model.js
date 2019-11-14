"use strict";

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const uuid = require('uuid/v4');

const MODEL_PATH = path.join(__dirname, '../../data.json');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

class MoviesModel {
  constructor(path) {
    this.modelPath = path;
  }

  async getFilms() {
    const filmsData = await readFile(this.modelPath);

    return JSON.parse(filmsData).sort((a, b) => Number(a.year) - Number(b.year));
  }

  async getFilmById(filmId) {
    const filmsData = await readFile(this.modelPath);

    return JSON.parse(filmsData).find(({ id }) => id === filmId);
  }

  preparedTitles(films, releaseYear) {
    const parsedFilms = JSON.parse(films);

    const preparedFilms = releaseYear
      ? parsedFilms.filter(({ year }) => year === releaseYear)
      : parsedFilms;

    return preparedFilms.map(({ title }) => title).join('\n');
  }

  async getTitles(releaseYear) {
    const filmsData = await readFile(this.modelPath);

    return this.preparedTitles(filmsData, releaseYear);
  }

  async postMovie(filmDetails) {
    const { title, imdbRating, year } = filmDetails;

    const filmsData = await readFile(this.modelPath);
    const newMovie = {
      id: uuid(),
      title,
      imdbRating,
      year,
    };

    writeFile(this.modelPath, JSON.stringify([...JSON.parse(filmsData), newMovie]))
        .catch(err => {
          if (err) {
            const error = {
              statusCode: 500,
              errorMessage: err.message,
            };

            throw error;
          }
        });

    return newMovie;
  }

  async putMovie(filmId, filmDetails) {
    const filmsData = await readFile(this.modelPath);
    let newMovie;

    const newMovieData = JSON.parse(filmsData).map(film => {
      if (film.id === filmId) {
        const {title, imdbRating, year} = filmDetails;

        newMovie = {
          id: filmId,
          title,
          imdbRating,
          year,
        };

        return newMovie;
      }
      ;

      return film;
    });

      writeFile(this.modelPath, JSON.stringify(newMovieData))
          .catch(err => {
            if (err) {
              const error = {
                statusCode: 500,
                errorMessage: err.message,
              };

              throw error;
            };
          });

      return newMovie;
  }

  async patchMovie(filmId, filmDetails) {
    const filmsData = await readFile(this.modelPath);
    let newMovie;

    const newMovieData = JSON.parse(filmsData).map(film => {
      const { id } = film;

      if (id === filmId) {
        newMovie = {
          ...film,
          ...filmDetails,
        };

        return newMovie;
      };

      return film;
    });

    writeFile(this.modelPath, JSON.stringify(newMovieData))
        .catch(err => {
          if (err) {
            const error = {
              statusCode: 500,
              errorMessage: err.message,
            };

            throw error;
        }});

    return newMovie;
  }

  async deleteMovie(movieId) {
    const filmsData = await readFile(this.modelPath);

    const preparedFilmsData = JSON.parse(filmsData);

    const updatedData = preparedFilmsData.filter(({ id }) => id !== movieId);

    writeFile(this.modelPath, JSON.stringify(updatedData))
        .catch(err => {
          if (err) {
            const error = {
              statusCode: 500,
              errorMessage: err.message,
            };

            throw error;
        }});

    return preparedFilmsData.length !== updatedData.length;
  }
}

const moviesModel = new MoviesModel(MODEL_PATH);
module.exports = moviesModel;
