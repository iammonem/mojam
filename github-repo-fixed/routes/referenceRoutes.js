const express = require('express');
const router = express.Router();
const {
  getReferences,
  getReferenceById,
  createReference,
  updateReference,
  deleteReference,
  addComment,
  addReply,
  likeReference,
  searchReferences
} = require('../controllers/referenceController');

// Search route
router.route('/search').get(searchReferences);

// Main routes
router.route('/')
  .get(getReferences)
  .post(createReference);

router.route('/:id')
  .get(getReferenceById)
  .put(updateReference)
  .delete(deleteReference);

// Like/dislike route
router.route('/:id/like').put(likeReference);

// Comments routes
router.route('/:id/comments').post(addComment);
router.route('/:id/comments/:commentId/replies').post(addReply);

module.exports = router;
