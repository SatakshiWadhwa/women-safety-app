import { useState } from "react";

const CATEGORIES = [
  {
    id: "techniques",
    label: "Self Defense Techniques",
    icon: "🥋",
    items: [
      {
        title: "Palm Strike",
        description: "Use the heel of your palm to strike the attackers nose or chin with full force. More effective than a fist and less likely to injure your hand.",
        tip: "Aim for nose, chin, or throat",
      },
      {
        title: "Groin Kick",
        description: "A powerful kick to the groin area can instantly disable an attacker. Use your knee if they are close or your foot if at a distance.",
        tip: "Most effective against male attackers",
      },
      {
        title: "Eye Gouge",
        description: "Use your thumbs or fingers to jab at the attackers eyes. Even the threat of this move can make an attacker back off.",
        tip: "Use when grabbed from front",
      },
      {
        title: "Elbow Strike",
        description: "The elbow is one of the hardest points of your body. Drive it into the attackers face, temple, or ribs with maximum force.",
        tip: "Best for close range attacks",
      },
      {
        title: "Wrist Escape",
        description: "If your wrist is grabbed, rotate it toward the attackers thumb which is the weakest point of their grip and pull sharply.",
        tip: "Rotate toward thumb side",
      },
      {
        title: "Bear Hug Escape",
        description: "If grabbed from behind, drop your weight suddenly, stomp on their foot, throw your head back into their face, then elbow their ribs.",
        tip: "Drop weight first then strike",
      },
    ],
  },
  {
    id: "awareness",
    label: "Situational Awareness",
    icon: "👁️",
    items: [
      {
        title: "Trust Your Instincts",
        description: "If something feels wrong, it probably is. Your brain processes danger signals before you consciously recognize them. Never ignore that feeling.",
        tip: "Your gut feeling is data",
      },
      {
        title: "Avoid Distractions",
        description: "Stay off your phone while walking alone. Attackers target people who are distracted. Keep your head up and be aware of surroundings.",
        tip: "No headphones in both ears",
      },
      {
        title: "Know Your Exits",
        description: "Whenever you enter a new place, immediately identify the exits. This habit can save your life in emergencies.",
        tip: "Always know two exit routes",
      },
      {
        title: "Walk Confidently",
        description: "Attackers target people who look uncertain or vulnerable. Walk with purpose, head up, and make brief eye contact to show confidence.",
        tip: "Confident posture deters attackers",
      },
      {
        title: "Safe Zones",
        description: "Know the safe zones on your campus — security booths, 24hr shops, populated areas. Plan your routes to pass through them.",
        tip: "Map safe zones near you",
      },
    ],
  },
  {
    id: "legal",
    label: "Legal Rights in India",
    icon: "⚖️",
    items: [
      {
        title: "Right to Private Complaint",
        description: "A woman can file a complaint directly with the Judicial Magistrate if police refuse to register her FIR under Section 156(3) CrPC.",
        tip: "You can bypass police if needed",
      },
      {
        title: "Zero FIR",
        description: "You can file a Zero FIR at any police station regardless of jurisdiction. They must register it and transfer to the correct station.",
        tip: "File at ANY police station",
      },
      {
        title: "Right to Free Legal Aid",
        description: "Every woman victim of crime is entitled to free legal aid under the Legal Services Authorities Act. Contact your District Legal Services Authority.",
        tip: "Free lawyers are available",
      },
      {
        title: "Section 354 IPC",
        description: "Assault or criminal force on a woman with intent to outrage her modesty is punishable with 1-5 years imprisonment.",
        tip: "Report ALL forms of harassment",
      },
      {
        title: "POSH Act",
        description: "The Prevention of Sexual Harassment Act protects women at workplace. Every organization with 10+ employees must have an Internal Complaints Committee.",
        tip: "Your college must have ICC",
      },
      {
        title: "Right to Record Statement at Home",
        description: "A woman victim can have her statement recorded at her residence by a female police officer. You do not have to go to the police station.",
        tip: "Request home statement recording",
      },
    ],
  },
  {
    id: "emergency",
    label: "Emergency Numbers",
    icon: "📞",
    items: [
      { title: "Police", description: "National emergency police helpline", tip: "100" },
      { title: "Women Helpline", description: "24x7 national women helpline", tip: "1091" },
      { title: "Emergency", description: "All purpose national emergency number", tip: "112" },
      { title: "Ambulance", description: "Medical emergency ambulance service", tip: "108" },
      { title: "Childline", description: "For girls under 18 in distress", tip: "1098" },
      { title: "Cyber Crime", description: "Report online harassment and cyber crimes", tip: "1930" },
    ],
  },
];

function SelfDefense() {
  const [activeCategory, setActiveCategory] = useState("techniques");
  const [expandedItem, setExpandedItem] = useState(null);

  const current = CATEGORIES.find((c) => c.id === activeCategory);

  return (
    <div className="min-h-screen bg-pink-50 p-6">
      <div className="max-w-2xl mx-auto">

        <h1 className="text-3xl font-bold text-pink-700 mb-2">Self Defense</h1>
        <p className="text-gray-500 mb-6">Knowledge and techniques to keep yourself safe</p>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto mb-6 pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setExpandedItem(null); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap font-medium transition ${
                activeCategory === cat.id
                  ? "bg-pink-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-pink-400"
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Items */}
        <div className="flex flex-col gap-3">
          {current.items.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow overflow-hidden"
            >
              <button
                onClick={() => setExpandedItem(expandedItem === index ? null : index)}
                className="w-full px-6 py-4 flex justify-between items-center text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-pink-600 font-semibold">{item.title}</span>
                  {activeCategory === "emergency" && (
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold">
                      {item.tip}
                    </span>
                  )}
                </div>
                <span className="text-gray-400 text-xl">
                  {expandedItem === index ? "−" : "+"}
                </span>
              </button>

              {expandedItem === index && (
                <div className="px-6 pb-4 border-t border-pink-50">
                  <p className="text-gray-600 mt-3 leading-relaxed">{item.description}</p>
                  {activeCategory !== "emergency" && (
                    <div className="mt-3 bg-pink-50 rounded-lg px-4 py-2">
                      <p className="text-pink-600 text-sm font-medium">
                        Tip: {item.tip}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default SelfDefense;
