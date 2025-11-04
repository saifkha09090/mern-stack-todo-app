import TodoModel from "../models/Todo.js"

const getTodos = async (req, res) => {
  try {
    const todos = await TodoModel.find().sort({ createdAt: -1 });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addTodo = async (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ message: 'Todo ka text missing hai' });
  }

  try {
    const newTodo = await TodoModel.create({ text });
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const updateTodo = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (updates.text && updates.text.trim() === '') {
      return res.status(400).json({ message: 'Todo ka text khali nahi ho sakta' });
  }

  try {
    const todo = await TodoModel.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!todo) {
      return res.status(404).json({ message: 'Todo mila nahi' });
    }

    res.status(200).json(todo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const deleteTodo = async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await TodoModel.findByIdAndDelete(id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo mila nahi' });
    }

    res.status(204).send(); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export {
    getTodos,
    addTodo,
    updateTodo,
    deleteTodo
}