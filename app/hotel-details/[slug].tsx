// app/hotel-details/[slug].tsx
import { useEffect, useState } from 'react';

// Define the type for the hotel data structure
type Hotel = {
  title: string;
  description: string;
  images: string[];  // Array of image URLs
  // Add any other properties that are part of the hotel object, for example:
  // id: string;
  // location: string;
};

const HotelDetails = ({ slug }: { slug: string }) => {
  const [hotel, setHotel] = useState<Hotel | null>(null);  // Specify the type

  useEffect(() => {
    const fetchHotelData = async () => {
      const res = await fetch(`http://localhost:5000/hotel/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setHotel(data);  // TypeScript now knows 'data' is of type 'Hotel'
      } else {
        console.error('Failed to fetch hotel data');
      }
    };

    fetchHotelData();
  }, [slug]);

  if (!hotel) return <div>Loading...</div>;

  return (
    <div>
      <h1>{hotel.title}</h1>
      <p>{hotel.description}</p>
      <div>
        {hotel.images?.map((image, index) => (
          <img key={index} src={image} alt={`Hotel Image ${index + 1}`} />
        ))}
      </div>
    </div>
  );
};

export default HotelDetails;



