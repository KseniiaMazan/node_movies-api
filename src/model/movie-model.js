"use strict";

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const uuid = require('uuid/v4');

const MODEL_PATH = path.join(__dirname, '../../data.json');
const readFile = promisify(fs.readFile);

console.log(__dirname);

class filmsModelCreator {
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

  getFilmsTitles(films) {
    return JSON.parse(films).map(({ title }) => title).join('\n');
  }

  getTitlesByYear(releaseYear, films) {
    return JSON.parse(films)
        .filter(({ year }) => year === releaseYear)
        .map(({ title }) => title).join('\n');
  }

  async getTitles(releaseYear) {
    const filmsData = await readFile(this.modelPath);

    if(releaseYear) {
      return this.getTitlesByYear(releaseYear, filmsData);
    }

    return this.getFilmsTitles(filmsData);
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

    fs.writeFile(this.modelPath, JSON.stringify([...JSON.parse(filmsData), newMovie]), (err) => {
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

      fs.writeFile(this.modelPath, JSON.stringify(newMovieData), (err) => {
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

    fs.writeFile(this.modelPath, JSON.stringify(newMovieData), (err) => {
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

  async deleteMovie(movieId) {
    const filmsData = await readFile(this.modelPath);

    const updatedData = JSON.parse(filmsData).filter(({ id }) => id !== movieId);

    fs.writeFile(this.modelPath, JSON.stringify(updatedData), (err) => {
      if (err) {
        const error = {
          statusCode: 500,
          errorMessage: err.message,
        };

        throw error;
      }
    });

    return JSON.parse(filmsData).length !== updatedData.length;
  }
}

const movieModel = new filmsModelCreator(MODEL_PATH);
module.exports = movieModel;
