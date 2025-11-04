// server/index.js (Yeh humara serverless function entry point hai)
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

// Routes import karein
import todoRoutes from './routes/todoRoutes.js';

// .env file ko load karein
dotenv.config();

const app = express();

// Database Connection
const connectDB = async () => {
  try {
    // MONGO_URI .env file se aayega
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB successfully connect ho gaya! 👍');
  } catch (err) {
    console.error('MongoDB connection failed: 😭', err.message);
  }
};
connectDB();

// Middleware
app.use(express.json()); // Request body ko parse karne ke liye
app.use(cors()); // CORS allow karein taake frontend se request aa sake

// Root route (Vercel ko health check ke liye zaroori)
app.get('/', (req, res) => {
  res.send('Todo API is running successfully!');
});

// Main API Route
app.use('/api/todos', todoRoutes);

// ******* VERCEL KE LIYE ZAROORI *******
// Agar hum production mode mein hain (Vercel), toh app ko export karein
// Taa ke Vercel isko serverless function ki tarah use kar sake.
export default app;

// Development ke liye local server start karna
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Development Server chalu hai http://localhost:${PORT}`));
}
