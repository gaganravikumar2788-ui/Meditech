import { useRef, useState, useEffect } from 'react';
import { HeartPulse, Send } from 'lucide-react';

const REMEDIES = {
  headache: {
    keywords: ['headache', 'head ache', 'head pain', 'migraine', 'head hurts', 'head is pounding'],
    icon: '🤕',
    title: 'Headache Relief Suggestions',
    tips: [
      '💊 OTC Pain Relief: Paracetamol (500mg) or Ibuprofen (200-400mg) with food.',
      '💧 Stay Hydrated: Drink plenty of water — dehydration is a common cause.',
      '😴 Rest: Lie down in a quiet, dark room for 20-30 minutes.',
      '🧊 Cold Compress: Apply a cold pack to your forehead for 15 minutes.',
      '☕ Caffeine: A small cup of coffee can help mild headaches.',
    ],
    warning:
      'See a doctor if: headache is severe/sudden, accompanied by fever, stiff neck, confusion, or lasts more than 3 days.',
  },
  cold: {
    keywords: [
      'cold',
      'runny nose',
      'sneezing',
      'stuffy nose',
      'nasal congestion',
      'blocked nose',
      'flu',
      'common cold',
    ],
    icon: '🤧',
    title: 'Cold & Flu Suggestions',
    tips: [
      '💊 Decongestant: Pseudoephedrine or Phenylephrine tablets for stuffy nose.',
      '🍯 Honey & Lemon: Warm water with honey and lemon soothes symptoms.',
      '🛁 Steam Inhalation: Breathe steam from hot water for 10 minutes.',
      '💧 Fluids: Drink warm soups, herbal teas, and lots of water.',
      '💊 Antihistamine: Cetirizine (10mg) if sneezing/runny nose is severe.',
    ],
    warning:
      'See a doctor if: fever above 103°F (39.4°C), symptoms last more than 10 days, or difficulty breathing.',
  },
  sore_throat: {
    keywords: [
      'sore throat',
      'throat pain',
      'throat hurts',
      'scratchy throat',
      'painful swallowing',
      'swollen throat',
    ],
    icon: '😷',
    title: 'Sore Throat Suggestions',
    tips: [
      '🧂 Salt Water Gargle: Mix ½ tsp salt in warm water, gargle 3-4 times daily.',
      '🍯 Honey: 1-2 teaspoons of raw honey to coat and soothe the throat.',
      '💊 Lozenges: Throat lozenges with menthol or benzocaine for relief.',
      '🍵 Warm Drinks: Chamomile or ginger tea with honey.',
    ],
    warning:
      'See a doctor if: difficulty breathing or swallowing, fever above 101°F, rash, or lasts more than a week.',
  },
  stomach: {
    keywords: [
      'stomach',
      'stomach ache',
      'stomach pain',
      'nausea',
      'indigestion',
      'bloating',
      'gas',
      'acidity',
      'acid reflux',
      'diarrhea',
      'vomiting',
      'tummy',
    ],
    icon: '🤢',
    title: 'Stomach Issue Suggestions',
    tips: [
      '💊 Antacid: Over-the-counter antacids for acidity/heartburn.',
      '🫚 Ginger: Ginger tea or chewing fresh ginger helps nausea.',
      '🍌 BRAT Diet: Bananas, Rice, Applesauce, Toast — gentle on the stomach.',
      '💧 Hydrate: Small sips of water or ORS if vomiting/diarrhea present.',
      '🚫 Avoid: Spicy, oily, and dairy foods until you feel better.',
    ],
    warning:
      'See a doctor if: severe abdominal pain, blood in stool/vomit, high fever, or symptoms last more than 2 days.',
  },
  body_pain: {
    keywords: [
      'body pain',
      'muscle pain',
      'body ache',
      'joint pain',
      'back pain',
      'muscle ache',
      'sore muscles',
      'fatigue',
      'leg pain',
      'arm pain',
    ],
    icon: '💪',
    title: 'Body & Muscle Pain Suggestions',
    tips: [
      '💊 Pain Relief: Ibuprofen (200-400mg) or Paracetamol (500mg).',
      '🧴 Topical Relief: Apply pain relief gel (Diclofenac gel) to affected area.',
      '♨️ Warm Compress: Apply a warm towel or heating pad for 15-20 minutes.',
      '🧘 Gentle Stretching: Light stretches to relieve muscle tension.',
    ],
    warning:
      'See a doctor if: pain is severe or sudden, accompanied by swelling/redness, numbness, or lasts more than a week.',
  },
  cough: {
    keywords: ['cough', 'coughing', 'dry cough', 'wet cough', 'chest congestion'],
    icon: '😮‍💨',
    title: 'Cough Relief Suggestions',
    tips: [
      '🍯 Honey: 1-2 teaspoons before bedtime (not for children under 1).',
      '💊 Cough Syrup: Dextromethorphan for dry cough; Guaifenesin for wet cough.',
      '🍵 Warm Fluids: Hot tea with honey and lemon.',
      '🧂 Salt Gargle: Warm salt water gargle to soothe throat irritation.',
    ],
    warning:
      'See a doctor if: cough lasts more than 3 weeks, coughing up blood, wheezing, or shortness of breath.',
  },
  fever: {
    keywords: ['fever', 'temperature', 'high temperature', 'feverish', 'chills'],
    icon: '🌡️',
    title: 'Fever Management Suggestions',
    tips: [
      '💊 Paracetamol: 500mg every 4-6 hours (max 4g/day for adults).',
      '💧 Fluids: Drink plenty of water, juice, and soups to prevent dehydration.',
      '🧊 Cool Compress: Place a cool damp cloth on forehead.',
      '👕 Light Clothing: Wear lightweight clothes and use thin bedding.',
    ],
    warning:
      'See a doctor if: fever above 103°F (39.4°C), lasts more than 3 days, stiff neck, confusion, or in infants under 3 months.',
  },
  allergy: {
    keywords: ['allergy', 'allergic', 'itching', 'rash', 'hives', 'skin rash', 'itchy skin'],
    icon: '🤧',
    title: 'Allergy Relief Suggestions',
    tips: [
      '💊 Antihistamine: Cetirizine (10mg) or Loratadine (10mg) once daily.',
      '🧴 Calamine Lotion: Apply to itchy skin for soothing relief.',
      '🧊 Cold Compress: Apply to rash/hives to reduce swelling and itch.',
    ],
    warning:
      'Seek EMERGENCY care if: swelling of face/tongue/throat, difficulty breathing, or dizziness.',
  },
  insomnia: {
    keywords: ['insomnia', 'cant sleep', "can't sleep", 'sleepless', 'trouble sleeping'],
    icon: '😴',
    title: 'Sleep Improvement Suggestions',
    tips: [
      '🌙 Sleep Hygiene: Go to bed and wake up at the same time daily.',
      '📱 No Screens: Avoid phones/laptops 1 hour before bed.',
      '🍵 Chamomile Tea: A warm cup before bedtime promotes relaxation.',
      '🚫 Avoid: Caffeine after 2pm and heavy meals before bedtime.',
    ],
    warning:
      'See a doctor if: insomnia persists for more than 4 weeks or breathing stops during sleep.',
  },
};

function findRemedy(text) {
  const lower = text.toLowerCase();
  for (const data of Object.values(REMEDIES)) {
    if (data.keywords.some((kw) => lower.includes(kw))) {
      return data;
    }
  }
  return null;
}

const CHIPS = [
  { label: '🤕 Headache', text: 'I have a headache' },
  { label: '🤧 Cold', text: 'I have a cold' },
  { label: '😷 Sore Throat', text: 'I have a sore throat' },
  { label: '🤢 Stomach Ache', text: 'I have stomach ache' },
  { label: '💪 Body Pain', text: 'I have body pain' },
  { label: '🌡️ Fever', text: 'I have fever' },
];

export default function WellnessAIPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      isUser: false,
      text: "Hello! 👋 I'm Medicom, your Wellness Assistant. Tell me about a minor ailment (headache, cold, sore throat, stomach ache, fever, sleep issues) and I'll suggest general remedies.",
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { id: Date.now(), isUser: true, text: trimmed }]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const remedy = findRemedy(trimmed);
      const botMsg = remedy
        ? {
            id: Date.now() + 1,
            isUser: false,
            remedy,
          }
        : {
            id: Date.now() + 1,
            isUser: false,
            text: "I can help with common ailments like headache, cold, cough, sore throat, stomach ache, body pain, fever, allergies, or trouble sleeping. Try describing one of those, or book a doctor consultation for personalized medical advice.",
          };

      setMessages((prev) => [...prev, botMsg]);
      setTyping(false);
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-slate-900 text-emerald-50 rounded-3xl shadow-2xl overflow-hidden border border-slate-800 flex flex-col h-[78vh]">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10 bg-slate-950/60">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-sky-500 flex items-center justify-center text-white">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white">Medicom AI Wellness Assistant</h1>
            <p className="text-xs text-emerald-400">General wellness suggestions only</p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 text-center text-xs text-amber-300">
          <strong>⚠️ Disclaimer:</strong> This is NOT medical advice. Always consult a real doctor
          for diagnosis and prescriptions.
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.isUser ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.isUser
                    ? 'bg-emerald-500 text-white rounded-br-sm'
                    : 'bg-slate-800 text-slate-100 rounded-bl-sm border border-slate-700'
                }`}
              >
                {m.remedy ? (
                  <div className="space-y-2.5">
                    <div className="font-bold text-emerald-300 text-base">
                      {m.remedy.icon} {m.remedy.title}
                    </div>
                    <ul className="space-y-1.5 text-slate-200">
                      {m.remedy.tips.map((tip) => (
                        <li key={tip}>{tip}</li>
                      ))}
                    </ul>
                    <div className="mt-2 pt-2 border-t border-slate-700 text-xs text-amber-300">
                      ⚠️ {m.remedy.warning}
                    </div>
                  </div>
                ) : (
                  <p>{m.text}</p>
                )}
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex justify-start">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-xs text-emerald-300">
                Medicom is typing...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="px-5 pb-2 flex flex-wrap gap-2">
          {CHIPS.map((c) => (
            <button
              key={c.label}
              type="button"
              onClick={() => sendMessage(c.text)}
              className="text-xs px-3 py-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20 transition-colors"
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="p-4 border-t border-white/10 flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe how you're feeling..."
            className="flex-1 rounded-xl px-4 py-3 text-sm bg-white/10 text-white placeholder-slate-400 border border-white/10 focus:ring-2 focus:ring-emerald-400 outline-none"
          />
          <button
            type="submit"
            className="rounded-xl px-5 bg-gradient-to-r from-emerald-400 to-sky-500 text-white font-semibold hover:opacity-90 flex items-center justify-center"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
