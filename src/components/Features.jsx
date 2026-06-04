import FeatureCard from "./FeatureCard";

function Features() {
  return (
    <section className="px-8 py-16 bg-white">

      <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
        Key Features
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

        <FeatureCard
          icon="🚨"
          title="Emergency SOS"
          description="Send instant emergency alerts with live location sharing."
        />

        <FeatureCard
          icon="🛣️"
          title="Safe Route Navigation"
          description="Find safer walking routes between metro stations, hostels, and campus."
        />

        <FeatureCard
          icon="🗺️"
          title="Unsafe Zone Alerts"
          description="View high-risk areas reported by students during late-night hours."
        />

        <FeatureCard
          icon="🚶"
          title="Walking Companion Mode"
          description="Share live location and ETA with trusted friends while walking at night."
        />

        <FeatureCard
          icon="🤖"
          title="AI Risk Detection"
          description="AI analyzes reports and warns users about risky routes after dark."
        />

        <FeatureCard
          icon="🚕"
          title="Trusted Ride Monitoring"
          description="Track auto and rickshaw safety experiences shared by students."
        />
          
        <FeatureCard
  icon="👭"
  title="Smart Walking Buddy"
  description="Connect with verified students traveling on the same route during late-night hours."
/>

      </div>

    </section>
  );
}

export default Features;