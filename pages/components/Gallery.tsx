const Gallery = ({ images }: { images: string[] }) => {
  if (!images || images.length === 0) {
    return <p>No images available.</p>;
  }
    return (
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 m-8">
        {images.map((image, index) => (
          <div key={index} className="bg-gray-100 rounded-lg overflow-hidden shadow-md">
            <img src={image} alt={`Gallery Image ${index + 1}`} className="w-full h-48 object-cover" />
          </div>
        ))}
      </section>
    );
  };
  
  export default Gallery;
  