import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Todo ka text zaroori hai'],
    trim: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TodoModel = mongoose.model('Todo', TodoSchema);

export default TodoModel;