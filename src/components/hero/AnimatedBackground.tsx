
const AnimatedBackground = () => {
  return (
    <>
      <div 
        className="absolute inset-0 bg-black"
        style={{
          backgroundImage: "url('/lovable-uploads/828dd9cc-ec23-41dd-b02a-de5ed79ae411.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/40" /> {/* Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" /> {/* Gradient fade */}
      </div>
    </>
  );
};

export default AnimatedBackground;

