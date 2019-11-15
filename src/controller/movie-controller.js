const { handleModelErrors, handleApiErrors } = require('../utils/error-handling');
const moviesModel = require('../model/movie-model');

const assertData = require('../utils/assert-handling');

const getMovies = (req, res) => {
  moviesModel.getFilms()
      .catch(handleModelErrors)
      .then(data => res.json(data))
      .catch(handleApiErrors(res));
};

const getTitle = (req, res) => {
  moviesModel.getTitles(req.query.year)
      .catch(handleModelErrors)
      .then(data => res.send(data))
      .catch(handleApiErrors(res));
};

const getMovieById = (req, res) => {
  moviesModel.getFilmById(req.params.movieId)
      .catch(handleModelErrors)
      .then(data => {
        if(!data) {
          assertData();
        } else {
          res.json(data);
        }})
      .catch(handleApiErrors(res));
};

const putMovie = (req, res) => {
  moviesModel.putMovie(req.params.movieId, req.body)
      .catch(handleModelErrors)
      .then(data => {
        if(!data) {
          assertData();
        } else {
          res.json(data);
        }})
      .catch(handleApiErrors(res));
}

const postMovie = (req, res) => {
  moviesModel.postMovie(req.body)
      .catch(handleModelErrors)
      .then(data => {
        if(!data) {
          assertData();
        } else {
          res.json(data);
        }})
      .catch(handleApiErrors(res));
};

const patchMovie = (req, res) => {
  moviesModel.patchMovie(req.params.movieId, req.body)
      .catch(handleModelErrors)
      .then(data => {
        if(!data) {
          assertData();
        } else {
          res.json(data);
        }})
      .catch(handleApiErrors(res));
};

const deleteMovie = (req, res) => {
  moviesModel.deleteMovie(req.params.movieId)
      .catch(handleModelErrors)
      .then(data => {
        if (!data) {
          assertData();
        } else {
          res.sendStatus(204);
        }})
      .catch(handleApiErrors(res));
};

module.exports = {
  getMovies,
  getTitle,
  getMovieById,
  postMovie,
  putMovie,
  patchMovie,
  deleteMovie,
};
