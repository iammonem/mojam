const express = require('express');
const router = express.Router();
const {
  getSubMeanings,
  getSubMeaningById,
  createSubMeaning,
  updateSubMeaning,
  deleteSubMeaning
} = require('../controllers/subMeaningController');

router.route('/')
  .get(getSubMeanings)
  .post(createSubMeaning);

router.route('/:id')
  .get(getSubMeaningById)
  .put(updateSubMeaning)
  .delete(deleteSubMeaning);

module.exports = router;
