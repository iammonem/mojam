const express = require('express');
const router = express.Router();
const {
  getMainMeanings,
  getMainMeaningById,
  createMainMeaning,
  updateMainMeaning,
  deleteMainMeaning
} = require('../controllers/mainMeaningController');

router.route('/')
  .get(getMainMeanings)
  .post(createMainMeaning);

router.route('/:id')
  .get(getMainMeaningById)
  .put(updateMainMeaning)
  .delete(deleteMainMeaning);

module.exports = router;
