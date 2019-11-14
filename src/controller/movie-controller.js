const { handleModelErrors, handleApiErrors } = require('../utils/utils');
const filmsModel = require('../model/movie-model');

const getMovies = (req, res) => {
  filmsModel.getFilms()
      .catch(handleModelErrors)
      .then(data => res.json(data))
      .catch(handleApiErrors(res));
};

const getTitle = (req, res) => {
  filmsModel.getTitles(req.query.year)
      .catch(handleModelErrors)
      .then(data => res.send(data))
      .catch(handleApiErrors(res));
};

const getMovieById = (req, res) => {
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
};

const putMovie = (req, res) => {
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
}

const postMovie = (req, res) => {
  filmsModel.postMovie(req.body)
      .catch(handleModelErrors)
      .then(data => res.json(data))
      .catch(handleApiErrors(res));
};

const patchMovie = (req, res) => {
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

        res.json(data);
      })
      .catch(handleApiErrors(res));
};

const deleteMovie = (req, res) => {
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

        res.sendStatus(204);
      })
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
