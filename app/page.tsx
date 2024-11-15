import Navbar from './components/Navbar';
import Gallery from './components/Gallery';
import Property from './components/PropertyInfo';
import RoomsBeds from './components/RoomsBeds';

const Page = () => {
  const galleryImages = [
    "/images/radisson.jpeg",
  ];
  
  const propertyDetails = {
    title: "Luxury Villa",
    description: "A beautiful luxury villa in a prime location.",
    guestCount: 6,
    bedroomCount: 3,
    bathroomCount: 2,
    amenities: ["Wi-Fi", "Pool", "Gym", "Parking"],
    host: "John Doe",
    address: "Kurmitola",
    latitude: 38,
    longitude: -118
  };
  const rooms = [
    { name: "Master Bedroom", beds: 2 },
    { name: "Guest Room", beds: 1 },
  ];

  return (
    <div>
      <Navbar />
      <Gallery images={galleryImages} />
      <Property {...propertyDetails} />
      <RoomsBeds rooms={rooms} />
    </div>
  );
};

export default Page;
