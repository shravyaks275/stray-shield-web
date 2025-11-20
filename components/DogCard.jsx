export default function DogCard({ dog }) {
  return (
    <div className="border rounded-lg p-4 bg-card shadow-sm flex flex-col">
      <div className="relative w-full h-70 mb-4"> 
        <img
          src={dog.image}
          alt={dog.name}
          className="w-full h-full object-cover rounded-md"
        />
      </div>

      <div className="flex-1">
        <h2 className="text-xl font-bold text-foreground">{dog.name}</h2>
        <p className="text-sm text-muted-foreground">{dog.breed} • {dog.age} - {dog.sex}</p>
        <p className="text-sm text-muted-foreground mt-1">Location: {dog.location}</p>
      </div>

      <button className="mt-4 w-full py-2 px-4 bg-blue-400 text-white rounded-lg hover:bg-blue-600 transition-colors">
        Express Interest
      </button>
    </div>
  );
}