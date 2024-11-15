import { Router } from 'express';
import multer from 'multer';
import { createHotel, getHotelByIdOrSlug, updateHotelById, uploadImages, uploadRoomImages } from '../controllers/hotelController';
import path from 'path';
import fs from 'fs';
// validations
import { validateHotelUpdate } from '../middleware/validation';


const router = Router();

/*
POST /hotel: 
Insert a new hotel record. The request body should include hotel data in JSON format, 
following the provided schema. The data should be stored in a JSON file on the server 
named hotel-id.json, where hotel-id is the unique identifier for the hotel. 
*/
const HotelPoststorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define a unique folder for storing hotel images
    const destinationPath = path.join(__dirname, '../uploads');
    
    // Ensure the directory exists
    fs.mkdirSync(destinationPath, { recursive: true });
    
    cb(null, destinationPath);
    
  },
  filename: (req, file, cb) => {
    
    // Hotel Images
    const extension = path.extname(file.originalname);
    const originalName = path.basename(file.originalname, extension);
    const filename = `${originalName}${extension}`;
    
    cb(null, filename);
    
  }
  
});

const uploadHotel = multer({
  storage: HotelPoststorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit per file
});
/*
POST /images: 
Upload multiple images as multipart data. The images should be saved in a designated 
directory, and their URLs should be updated in the corresponding hotel record. 
*/ 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const hotelId = req.params.id || req.body.id;
    if (!hotelId) {
      return cb(new Error('Hotel ID is required'), '');
    }
    
    // Define the destination folder based on route
    const folder = req.params.roomSlug ? 'rooms' : ''; // Use 'rooms' folder if URL has /images/:id/:roomSlug
    const destinationPath = path.join(__dirname, `../uploads/${folder}`);

    // Ensure the directory exists
    fs.mkdirSync(destinationPath, { recursive: true });

    cb(null, destinationPath);
  },
  filename: (req, file, cb) => {
    const hotelId = req.params.id || req.body.id;
    const roomSlug = req.params.roomSlug;

    if (!hotelId) {
      return cb(new Error('Hotel ID is required'), '');
    }

    const extension = path.extname(file.originalname);
    const originalName = path.basename(file.originalname, extension);

    // Add roomSlug to the filename if it's a room image
    const filename = roomSlug
      ? `${hotelId}-${roomSlug}-${originalName}${extension}`
      : `${hotelId}-${originalName}${extension}`;

    cb(null, filename);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit per file
});

// Routes

// POST /hotel - Create hotel with images
router.post('/hotel', uploadHotel.array('images', 10), createHotel);

// Upload hotel images for POST/images
router.post('/images/:id', upload.array('images', 10), uploadImages); 
// Upload room images for POST/images/roomimages
router.post('/images/:id/:roomSlug', upload.array('images', 10), uploadRoomImages); 

// Retreive hotel informations
router.get('/hotel/:idOrSlug', getHotelByIdOrSlug);

// Update hotel informations
router.put('/hotel/:id', validateHotelUpdate, updateHotelById); 

export default router;