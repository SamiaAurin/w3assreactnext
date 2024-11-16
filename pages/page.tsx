//import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Gallery from './components/Gallery';
import Property from './components/PropertyInfo';
import RoomsBeds from './components/RoomsBeds';
import { notFound } from 'next/navigation'; // For 404 page redirection

type Hotel = {
  title: string;
  description: string;
  images: string[];
  guestCount: number;
  bedroomCount: number;
  bathroomCount: number;
  amenities: string[];
  host: string;
  address: string;
  latitude: number;
  longitude: number;
  rooms: { hotelSlug: string; roomSlug: string; roomTitle: string; bedroomCount: number }[];
};

interface Props {
  params: {
    slug: string;
  };
}

const HotelDetailsPage = async ({ params }: Props) => {
  console.log(params);
  const { slug } = params;
  console.log(slug);
  
  // Fetching data directly in the Server Component
  const res = await fetch(`http://localhost:5000/api/hotel/${slug}`);
  const hotel: Hotel = await res.json();

  if (!hotel) {
    notFound();  // Redirect to 404 if hotel not found
  }
  console.log(hotel); // Check the structure of the hotel object

  const rooms = hotel.rooms ? hotel.rooms.map((room) => ({
    name: room.roomTitle, // Use roomTitle as the name
    beds: room.bedroomCount, // Use bedroomCount as beds
  })) : [];
  const amenities = hotel.amenities || []; 
  return (
    <div>
      <Navbar />
      <Gallery images={hotel.images} />
      <Property
        title={hotel.title}
        description={hotel.description}
        guestCount={hotel.guestCount}
        bedroomCount={hotel.bedroomCount}
        bathroomCount={hotel.bathroomCount}
        amenities={amenities}
        host={hotel.host}
        address={hotel.address}
        latitude={hotel.latitude}
        longitude={hotel.longitude}
      />
      <RoomsBeds rooms={rooms} />
    </div>
  );
};

export default HotelDetailsPage;
