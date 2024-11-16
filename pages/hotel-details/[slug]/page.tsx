import { GetServerSideProps } from 'next';
import Navbar from '../../components/Navbar';
import Gallery from '../../components/Gallery';
import Property from '../../components/PropertyInfo';
import RoomsBeds from '../../components/RoomsBeds';

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
  hotel: Hotel;
}

const HotelDetailsPage = ({ hotel }: Props) => {
  const rooms = hotel.rooms ? hotel.rooms.map((room) => ({
    name: room.roomTitle, // Use roomTitle as the name
    beds: room.bedroomCount, // Use bedroomCount as beds
  })) : [];
  return (
    <div>
      <Navbar />
      {/* Gallery Section */}
      <Gallery images={hotel.images} />

      {/* Property Details Section */}
      <div className="m-8">
        <Property
          title={hotel.title}
          description={hotel.description}
          guestCount={hotel.guestCount}
          bedroomCount={hotel.bedroomCount}
          bathroomCount={hotel.bathroomCount}
          amenities={hotel.amenities}
          host={hotel.host}
          address={hotel.address}
          latitude={hotel.latitude}
          longitude={hotel.longitude}
        />
      </div>

      {/* Rooms & Beds Section */}
      <RoomsBeds rooms={rooms} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string };

  try {
    const res = await fetch(`http://localhost:5000/api/hotel/${slug}`);
    if (!res.ok) {
      throw new Error('Failed to fetch hotel data');
    }

    const hotel: Hotel = await res.json();

    // Converting string values to number (optional, if needed)
    hotel.guestCount = Number(hotel.guestCount);
    hotel.bedroomCount = Number(hotel.bedroomCount);
    hotel.bathroomCount = Number(hotel.bathroomCount);
    hotel.latitude = Number(hotel.latitude);
    hotel.longitude = Number(hotel.longitude);

    return {
      props: { hotel },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
};

export default HotelDetailsPage;
