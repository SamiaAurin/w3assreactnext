const RoomsBeds = ({ rooms }: { rooms: { name: string; beds: number; }[] }) => (
    <section className="m-8">
      <h2 className="text-2xl font-semibold text-gray-800">Rooms & Beds</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {rooms.map((room, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-md shadow-md">
            <h3 className="text-xl font-semibold">{room.name}</h3>
            <p className="text-gray-600">Beds: {room.beds}</p>
          </div>
        ))}
      </div>
    </section>
  );
  
  export default RoomsBeds;
  