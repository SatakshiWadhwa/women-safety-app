function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
      
      <div className="text-4xl mb-4">
        {icon}
      </div>

      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        {title}
      </h2>

      <p className="text-gray-600">
        {description}
      </p>

    </div>
  );
}

export default FeatureCard;