import express from 'express';
import hotelRoutes from './routes/hotelRoutes';
import path from 'path';
import cors from 'cors';

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));  // Allow requests from the frontend
app.use(express.json()); // Middleware to parse JSON bodies

// Use hotel routes
app.use('/api', hotelRoutes);


// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV !== 'test') {
  const port = 5000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
export default app;