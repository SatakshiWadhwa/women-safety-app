function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center px-6 py-20">
      
      <h1 className="text-5xl font-bold text-gray-800 leading-tight">
        Empowering Women Through
        <span className="text-pink-600"> Smart Campus Safety</span>
      </h1>

      <p className="mt-6 text-lg text-gray-600 max-w-2xl">
        Real-time SOS alerts, live location sharing, unsafe area reporting,
        and AI-powered safety assistance for students.
      </p>

      <div className="mt-8 flex gap-4">
        <button className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition">
          Get Started
        </button>

        <button className="border border-pink-600 text-pink-600 px-6 py-3 rounded-lg hover:bg-pink-100 transition">
          Learn More
        </button>
      </div>
    </section>
  );
}

export default Hero;