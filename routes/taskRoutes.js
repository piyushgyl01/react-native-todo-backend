const express = require('express');
const { 
  getTasks, 
  createTask, 
  getTask, 
  updateTask, 
  deleteTask 
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getTasks)
  .post(protect, createTask);

router.route('/:id')
  .get(protect, getTask)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

module.exports = router;