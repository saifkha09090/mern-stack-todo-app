import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, CheckCircle, Circle, Loader2, Plus, Edit, Save, X } from 'lucide-react';
const API_URL = import.meta.env.VITE_API_URL;

const Toast = ({ message, type, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const icon = type === 'success' ? <CheckCircle className="w-5 h-5" /> : <Loader2 className="w-5 h-5" />;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-5 right-5 p-4 rounded-lg text-white shadow-lg flex items-center space-x-2 ${bgColor}`}>
      {icon}
      <span>{message}</span>
    </div>
  );
};


const TodoItem = ({ todo, toggleComplete, deleteTodo, startEdit, isEditing, editText, setEditText, saveEdit, cancelEdit }) => {
    
  if (isEditing) {
    return (
      <div className="flex items-center justify-between p-3 bg-indigo-100 border-2 border-indigo-400 rounded-lg shadow-md mb-2">
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(todo._id) }}
          className="flex-grow p-2 mr-2 border border-indigo-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
          autoFocus
        />
        <div className="flex space-x-2">
          <button 
            onClick={() => saveEdit(todo._id)}
            className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-150 shadow-sm"
            aria-label="Save Edit"
          >
            <Save className="w-5 h-5" />
          </button>
          <button 
            onClick={cancelEdit}
            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-150 shadow-sm"
            aria-label="Cancel Edit"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg shadow-sm mb-2 transition duration-150">
      <div className="flex items-center space-x-3">
        <button 
          onClick={() => toggleComplete(todo._id, !todo.isCompleted)}
          className="text-indigo-500 hover:text-indigo-700 transition"
          aria-label={todo.isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
        >
          {todo.isCompleted ? <CheckCircle className="w-6 h-6 fill-indigo-500 text-white" /> : <Circle className="w-6 h-6 text-gray-400" />}
        </button>
        <span 
            className={`text-lg font-medium ${todo.isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}
            onDoubleClick={() => startEdit(todo._id, todo.text)}
        >
          {todo.text}
        </span>
      </div>
      
      <div className="flex space-x-2">
        <button 
            onClick={() => startEdit(todo._id, todo.text)}
            className="p-1 text-indigo-400 hover:text-indigo-600 rounded-full transition duration-150"
            aria-label="Edit Todo"
        >
            <Edit className="w-5 h-5" />
        </button>
        <button 
          onClick={() => deleteTodo(todo._id)}
          className="p-1 text-red-400 hover:text-red-600 rounded-full transition duration-150"
          aria-label="Delete Todo"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};


const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      if (Array.isArray(res.data)) {
          setTodos(res.data);
      } else {
          console.error("API response was not an array:", res.data);
          setToast({ message: 'API se ghalat data mila.', type: 'error' });
          setTodos([]); 
      }
    } catch (error) {
      setToast({ message: 'Todos fetch nahi hue! Server check karein.', type: 'error' });
      console.error('Fetch Error:', error);
      setTodos([]);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (newTodoText.trim() === '') {
      setToast({ message: 'Pehle kuch likhein to!', type: 'error' });
      return;
    }
    
    try {
      const res = await axios.post(API_URL, { text: newTodoText.trim() });
      setTodos([res.data, ...todos]); 
      setNewTodoText('');
      setToast({ message: 'Naya Todo add ho gaya!', type: 'success' });
    } catch (error) {
      setToast({ message: 'Todo add nahi hua.', type: 'error' });
      console.error('Add Error:', error);
    }
  };

  const toggleComplete = async (id, isCompleted) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, { isCompleted });
      
      setTodos(todos.map(todo => 
        todo._id === id ? res.data : todo
      ));
      
      setToast({ message: isCompleted ? 'Task complete! 🎉' : 'Task incomplete kia.', type: 'success' });
    } catch (error) {
      setToast({ message: 'Update nahi hua.', type: 'error' });
      console.error('Update Error:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`); 
      
      setTodos(todos.filter(todo => todo._id !== id));
      setToast({ message: 'Todo delete ho gaya.', type: 'success' });
    } catch (error) {
      setToast({ message: 'Delete nahi hua.', type: 'error' });
      console.error('Delete Error:', error);
    }
  };
  
  const startEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };
  
  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };
  
 const saveEdit = async (id) => {
      if (editText.trim() === '') {
          setToast({ message: 'Text khali nahi chhod sakte!', type: 'error' });
          return;
      }
      
      try {
          const res = await axios.put(`${API_URL}/${id}`, { text: editText.trim() });
          
          setTodos(todos.map(todo => 
              todo._id === id ? res.data : todo
          ));
          
          setEditingId(null);
          setEditText('');
          setToast({ message: 'Todo edit ho gaya!', type: 'success' });
      } catch (error) {
          setToast({ message: 'Edit save nahi hua. Server ne data reject kiya (400).', type: 'error' });
          console.error('Save Edit Error:', error);
          
          setEditingId(null); 
          setEditText('');
      }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="min-h-screen bg-indigo-50 p-4 flex items-start justify-center font-inter">
      <div className="w-full max-w-lg bg-white shadow-2xl rounded-xl p-8 mt-10 border border-indigo-200">
        
        <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-8 tracking-tight">
          Todo List
        </h1>
        <form onSubmit={addTodo} className="flex space-x-3 mb-8">
          <input
            type="text"
            placeholder="Enter new todo..."
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-inner"
          />
          <button
            type="submit"
            className="flex items-center justify-center bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md transform hover:scale-[1.01]"
            aria-label="Add new Todo"
          >
            <Plus className="w-6 h-6" />
          </button>
        </form>

        {loading && (
          <div className="flex justify-center items-center h-20 text-indigo-500">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Data is loading...</span>
          </div>
        )}

        {!loading && todos.length === 0 && (
          <div className="text-center p-10 text-gray-500 bg-gray-100 rounded-lg">
            <p className="font-semibold">No todos found. Add your first task!</p>
          </div>
        )}

        <div className="space-y-3">
          {todos.map(todo => (
            <TodoItem 
              key={todo._id} 
              todo={todo} 
              toggleComplete={toggleComplete} 
              deleteTodo={deleteTodo} 
              
              startEdit={startEdit}
              isEditing={editingId === todo._id}
              editText={editText}
              setEditText={setEditText}
              saveEdit={saveEdit}
              cancelEdit={cancelEdit}
            />
          ))}
        </div>
      </div>
      
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
};

export default App;
