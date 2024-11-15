import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import slugify from 'slugify';


/* 
POST /images:
Upload multiple images as multipart data. The images should be saved in a designated
directory, and their URLs should be updated in the corresponding hotel record. 
*/
// Hotel Images
export const uploadImages = (req: Request, res: Response): any => {
  const { id } = req.body;
  console.log("Received ID:", req.body.id); // Log the ID to ensure it's received
  console.log("Received files:", req.files); // Log the files to ensure they are being processed

  if (!id) {
    return res.status(400).json({ message: 'Hotel ID is required' });
  }

  // Check if the hotel record exists
  const hotelPath = path.join(__dirname, `../data/${id}.json`);
  console.log(hotelPath);

  if (!fs.existsSync(hotelPath)) {
    return res.status(404).json({ message: 'Hotel not found' });
  }

  const hotelData = JSON.parse(fs.readFileSync(hotelPath, 'utf-8'));
  
  // Generate fully qualified URLs
  const imagePaths = (req.files as Express.Multer.File[]).map((file) => {
    return `http://${req.get('host')}/uploads/${file.filename}`;
  });
  
  //console.log("Image Paths:", imagePaths); // Log the file paths to verify the images are being processed correctly

  // Append new image URLs to hotel data
  hotelData.images = hotelData.images ? [...hotelData.images, ...imagePaths] : imagePaths;

  // Save the updated hotel data back to the JSON file
  try {
    fs.writeFileSync(hotelPath, JSON.stringify(hotelData, null, 2));
    
    // Respond with success message
    return res.status(200).json({ message: 'Images uploaded successfully', images: imagePaths });
  } catch (err) {
    console.error("Error saving updated hotel data:", err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Room images //

export const uploadRoomImages = (req: Request, res: Response): any => {
  const hotelId = req.params.id;
  const roomSlug = req.params.roomSlug;
  
  console.log("Received Hotel ID:", hotelId);
  console.log("Received Room Slug:", roomSlug);
  console.log("Received files:", req.files);

  if (!hotelId || !roomSlug) {
    return res.status(400).json({ message: 'Hotel ID and Room Slug are required' });
  }

  // Check if the hotel record exists
  const hotelPath = path.join(__dirname, `../data/${hotelId}.json`);
  if (!fs.existsSync(hotelPath)) {
    return res.status(404).json({ message: 'Hotel not found' });
  }

  const hotelData = JSON.parse(fs.readFileSync(hotelPath, 'utf-8'));

  // Generate fully qualified URLs for the uploaded files
  const imagePaths = (req.files as Express.Multer.File[]).map((file) => {
    return `http://${req.get('host')}/uploads/rooms/${file.filename}`;
  });

  // Find the specific room by `roomSlug` and add images to that room's `roomImage` property
  const room = hotelData.rooms.find((r: any) => r.roomSlug === roomSlug);
  if (room) {
    room.roomImage = room.roomImage ? [...room.roomImage, ...imagePaths] : imagePaths;
  } else {
    return res.status(404).json({ message: 'Room not found' });
  }

  // Save the updated hotel data back to the JSON file
  try {
    fs.writeFileSync(hotelPath, JSON.stringify(hotelData, null, 2));
    console.log("Updated hotel data saved");

    // Respond with success message
    return res.status(200).json({ message: 'Room images uploaded successfully', images: imagePaths });
  } catch (err) {
    console.error("Error saving updated hotel data:", err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

///////////////////////////////////////////////////////////////////////////////////
/*
POST /hotel:
Insert a new hotel record. The request body should include hotel data in JSON format,
following the provided schema. The data should be stored in a JSON file on the server
named hotel-id.json, where hotel-id is the unique identifier for the hotel. 
*/

const dataPath = path.resolve(__dirname, '../data');  // Using path.resolve

interface Hotel {
  id: string;
  slug: string;
  title: string;
  description: string;
  images?: string[];
  guestCount: number;
  bedroomCount: number;
  bathroomCount: number;
  amenities: string[];
  host: string;
  address: string;
  latitude: number;
  longitude: number;
  rooms: Array<{
    hotelSlug: string;
    roomSlug: string;
    roomImage: string;
    roomTitle: string;
    bedroomCount: number;
  }>;
}

export const createHotel = (req: Request, res: Response): any => {
  //console.log("POST /hotel endpoint hit");
  //console.log('Request headers:', req.headers);
  //console.log('Request body:', req.body);

  const { title, description, guestCount, bedroomCount, bathroomCount, amenities, host, address, latitude, longitude, rooms } = req.body;

  if (!title) {
    res.status(400).json({ message: 'Title is required' });
    return;
  }

  const id = new Date().getTime().toString();
  const slug = slugify(title, { lower: true });

  const newHotel: Hotel = {
    id,
    slug,
    images: [],
    title,
    description,
    guestCount,
    bedroomCount,
    bathroomCount,
    amenities,
    host,
    address,
    latitude,
    longitude,
    rooms: rooms || []
    
  };
  // If files are included in the request, process them
  const baseUrl = `http://localhost:3002`;
  if (req.files) {
    // Map uploaded image files to URLs
    const imageUrls = (req.files as Express.Multer.File[]).map((file) => {
      return `${baseUrl}/uploads/${file.filename}`;
    });

    // Add image URLs to the hotel data
    newHotel.images = imageUrls;
  }

  // Ensure the data directory exists
  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath, { recursive: true });
  }

  // Debugging to ensure file write path
  //console.log("Data path:", dataPath);

  try {
    // Write the hotel data to a new file in the data folder
    fs.writeFileSync(`${dataPath}/${id}.json`, JSON.stringify(newHotel, null, 2));
    //console.log(`Hotel data saved at ${dataPath}/${id}.json`);
  } catch (error) {
    console.error('Error writing to file:', error);
    res.status(500).json({ message: error });
  }

  res.status(201).json({ message: 'Hotel created successfully', hotel: newHotel });
};

/////////////////////////////////////////////////////////////////////////////////////
/*
GET /hotel/{hotel-id}:
Retrieve detailed information of a specific hotel using its unique ID or slug. The response
should include all relevant hotel data, including fully functional image URLs.
 */
const getHotelFilePath = (id: string): string => {
  return path.join(dataPath, `${id}.json`);
};

// function to get a hotel by slug
const getHotelBySlug = (slug: string): Hotel | null => {
  const files = fs.readdirSync(dataPath); // Read all files in the data folder
  for (const file of files) {
    const hotelData = fs.readFileSync(path.join(dataPath, file), 'utf-8');
    const hotel: Hotel = JSON.parse(hotelData);
    if (hotel.slug === slug) {
      return hotel; // Return the hotel if slug matches
    }
  }
  return null; 
};

export const getHotelByIdOrSlug = (req: Request, res: Response): any => {
  const { idOrSlug } = req.params; // Get the parameter from the request (either ID or slug)

  // First, try to get hotel by ID (numeric)
  const isId = !isNaN(Number(idOrSlug)); // Check if the input is a numeric ID
  if (isId) {
    const filePath = getHotelFilePath(idOrSlug); // Get file path using ID
    try {
      const hotelData = fs.readFileSync(filePath, 'utf-8');
      const hotel = JSON.parse(hotelData);
      return res.status(200).json(hotel); // Return hotel if file exists
    } catch (error) {
      console.error('Error reading hotel data by ID:', error);
      return res.status(404).json({ message: 'Hotel not found' });
    }
  }

  // If it's not an ID, attempt to get hotel by slug
  const hotel = getHotelBySlug(idOrSlug); // Try to find hotel by slug
  if (hotel) {
    return res.status(200).json(hotel); // Return hotel if found
  }

  // If no match was found for either ID or slug
  return res.status(404).json({ message: 'Hotel not found' });
};

/////////////////////////////////////////////////////////////////////////////////////
/* 
PUT /hotel/{hotel-id}:
Update an existing hotel's data (e.g., title, description, etc.) using its unique ID. The
request body should contain the updated hotel information.
*/
export const updateHotelById = (req: Request, res: Response): any => {
  const { id } = req.params; // Get the hotel ID from the request parameters
  const filePath = getHotelFilePath(id);

  // Check if the hotel file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'Hotel not found' });
  }

  // Get the new data from the request body
  const { title, description, guestCount, bedroomCount, bathroomCount, amenities, host, address, latitude, longitude, rooms } = req.body;

  try {
    // Read the existing hotel data from the file
    const hotelData = fs.readFileSync(filePath, 'utf-8');
    const hotel = JSON.parse(hotelData);
    
    // Update the hotel details with the new data, if provided
    hotel.title = title || hotel.title;
    hotel.description = description || hotel.description;
    hotel.guestCount = guestCount || hotel.guestCount;
    hotel.bedroomCount = bedroomCount || hotel.bedroomCount;
    hotel.bathroomCount = bathroomCount || hotel.bathroomCount;
    hotel.amenities = amenities || hotel.amenities;
    hotel.host = host || hotel.host;
    hotel.address = address || hotel.address;
    hotel.latitude = latitude || hotel.latitude;
    hotel.longitude = longitude || hotel.longitude;
    hotel.rooms = rooms || hotel.rooms;

    // Optionally, update the slug if the title has changed
    if (title && title !== hotel.title) {
      hotel.slug = slugify(title, { lower: true });
    }

    // Save the updated hotel data back to the file
    fs.writeFileSync(filePath, JSON.stringify(hotel, null, 2));

    // Respond with the updated hotel data
    res.status(200).json({ message: 'Hotel updated successfully', hotel});
  } catch (error) {
    console.error('Error updating hotel data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

