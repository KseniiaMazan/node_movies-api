const express= require('express');

const {
  deleteMovie,
  getMovieById,
  getMovies,
  getTitle,
  patchMovie,
  postMovie,
  putMovie
} = require('../controller/movie-controller');


const moviesRouter = express.Router();

moviesRouter.get('/', getMovies);
moviesRouter.get('/titles', getTitle);
moviesRouter.get('/:movieId', getMovieById);

moviesRouter.post('/', express.json(), postMovie);
moviesRouter.put('/:movieId', express.json(), putMovie);
moviesRouter.patch('/:movieId', express.json(), patchMovie);
moviesRouter.delete('/:movieId', deleteMovie);

module.exports = {
  moviesRouter,
};
