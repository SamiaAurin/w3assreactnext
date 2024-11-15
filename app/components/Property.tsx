export const TitleSection = ({ title }: { title: string }) => (
    <h1 className="text-3xl font-semibold text-gray-800">{title}</h1>
  );
  

export const PropertyInfo = ({ description, guestCount, bedroomCount, bathroomCount, host, address, latitude, longitude }: { 
    description: string;
    guestCount: number;
    bedroomCount: number;
    bathroomCount: number;
    host: string;
    address: string;
    latitude: number;
    longitude: number;
  }) => (
    <div className="mt-4 text-lg text-gray-600">
      <p>{description}</p>
      <div className="mt-2">
        <p>Guests: {guestCount}</p>
        <p>Bedrooms: {bedroomCount}</p>
        <p>Bathrooms: {bathroomCount}</p>
        <p>Host: {host}</p>
        <p>Address: {address}</p>
        <p>Latitude: {latitude}</p>
        <p>Longitude: {longitude}</p>
      </div>
    </div>
  );
  


export const Amenities = ({ amenities }: { amenities: string[] }) => (
    <div className="mt-4">
      <h3 className="text-xl font-semibold text-gray-700">Amenities</h3>
      <ul className="list-disc pl-5 mt-2">
        {amenities.map((amenity, index) => (
          <li key={index} className="text-gray-600">{amenity}</li>
        ))}
      </ul>
    </div>
  );
  

