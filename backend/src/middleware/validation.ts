// src/middleware/validation.ts
import { Request, Response, NextFunction } from 'express';

export const validateHotelUpdate = (req: Request, res: Response, next: NextFunction): void => {
  const { title } = req.body;

  if (!title || title.trim() === '') {
    // Send error response and return nothing else (no further processing)
     res.status(400).json({ message: 'Title is required' });
  }

  // Continue to the next middleware or the controller
  next();
};
