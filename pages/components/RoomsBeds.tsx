// RoomsBeds.tsx
function RoomsBeds({ rooms }: { rooms: { name: string; beds: number }[] }) {
  if (!rooms || rooms.length === 0) {
    return <p>No rooms available.</p>; // Add a fallback message when rooms is undefined or empty
  }

  return (
    <div>
      {rooms.map((room, index) => (
        <div key={index}>
          <h3>{room.name}</h3>
          <p>Number of beds: {room.beds}</p>
        </div>
      ))}
    </div>
  );
}

export default RoomsBeds;
