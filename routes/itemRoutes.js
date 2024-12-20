const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Movie = require('../models/movie');

// Получение всех фильмов
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
});

// Получение конкретного фильма по ID
router.get('/:id', getMovie, (req, res) => {
  res.json(res.movie);
});

// Добавление нового фильма с валидацией
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Название фильма обязательно'),
    body('year').optional().isString().withMessage('Год должен быть строкой'),
    body('imdbRating').optional().isString().withMessage('IMDb рейтинг должен быть строкой'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const movie = new Movie({
      title: req.body.title,
      year: req.body.year,
      rated: req.body.rated,
      released: req.body.released,
      runtime: req.body.runtime,
      genre: req.body.genre,
      director: req.body.director,
      writer: req.body.writer,
      actors: req.body.actors,
      plot: req.body.plot,
      language: req.body.language,
      country: req.body.country,
      awards: req.body.awards,
      poster: req.body.poster,
      ratings: req.body.ratings,
      metascore: req.body.metascore,
      imdbRating: req.body.imdbRating,
      imdbVotes: req.body.imdbVotes,
      imdbID: req.body.imdbID,
      type: req.body.type,
      dvd: req.body.dvd,
      boxOffice: req.body.boxOffice,
      production: req.body.production,
      website: req.body.website,
      response: req.body.response,
    });

    try {
      const newMovie = await movie.save();
      res.status(201).json(newMovie);
    } catch (err) {
      res.status(400).json({ message: 'Ошибка при создании фильма', error: err.message });
    }
  }
);

// Обновление фильма по ID
router.put(
  '/:id',
  [
    body('title').optional().notEmpty().withMessage('Название фильма обязательно'),
    body('year').optional().isString().withMessage('Год должен быть строкой'),
    body('imdbRating').optional().isString().withMessage('IMDb рейтинг должен быть строкой'),
  ],
  getMovie,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const fieldsToUpdate = [
      'title', 'year', 'rated', 'released', 'runtime', 'genre', 'director', 'writer',
      'actors', 'plot', 'language', 'country', 'awards', 'poster', 'ratings',
      'metascore', 'imdbRating', 'imdbVotes', 'imdbID', 'type', 'dvd', 'boxOffice',
      'production', 'website', 'response'
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        res.movie[field] = req.body[field];
      }
    });

    try {
      const updatedMovie = await res.movie.save();
      res.json(updatedMovie);
    } catch (err) {
      res.status(400).json({ message: 'Ошибка при обновлении фильма', error: err.message });
    }
  }
);

// Удаление фильма по ID
router.delete('/:id', getMovie, async (req, res) => {
  try {
    await res.movie.deleteOne();
    res.json({ message: 'Фильм успешно удален' });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при удалении фильма', error: err.message });
  }
});

// Middleware для получения фильма по ID
async function getMovie(req, res, next) {
  let movie;
  try {
    movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Фильм не найден' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
  res.movie = movie;
  next();
}

module.exports = router;
