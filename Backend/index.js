import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import todoRoutes from './routes/todoRoutes.js';


dotenv.config();

const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173'; 

const corsOptions = {
    origin: allowedOrigin,
    optionsSuccessStatus: 200
};

const dbConnectionPlaceholder = () => { console.log("MongoDB connection function yahan hogi."); };
const connectDatabase = typeof connectDB !== 'undefined' ? connectDB : dbConnectionPlaceholder;

connectDatabase();

const app = express();

app.use(express.json());

app.use(cors(corsOptions)); 

app.use('/api/todos', todoRoutes);

app.get('/', (req, res) => {
  res.send('Todo API Vercel par chal raha hai! Check /api/todos');
});

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server chalu hai http://localhost:${PORT}`));
}

export default app;
