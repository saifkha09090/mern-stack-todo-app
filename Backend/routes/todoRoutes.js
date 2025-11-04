import express from "express";
import { getTodos, addTodo, updateTodo, deleteTodo } from '../controllers/TodoControllers.js'


const router = express.Router();

router.route('/')
  .get(getTodos)
  .post(addTodo);

router.route('/:id')
  .put(updateTodo)
  .delete(deleteTodo);

export default router;