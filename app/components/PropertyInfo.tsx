import { TitleSection , PropertyInfo, Amenities} from './Property'; 

const Property = ({ title, description, guestCount, bedroomCount, bathroomCount, amenities, host, address, latitude, longitude }: any) => (
  <div className="p-6 bg-white shadow-md rounded-md">
    <TitleSection title={title} />
    <PropertyInfo 
      description={description} 
      guestCount={guestCount} 
      bedroomCount={bedroomCount} 
      bathroomCount={bathroomCount} 
      host={host}
      address={address}
      latitude={latitude}
      longitude={longitude}
    />
    <Amenities amenities={amenities} />
  </div>
);

export default Property;
