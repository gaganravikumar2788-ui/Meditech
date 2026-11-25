import { ExternalLink, PlayCircle } from 'lucide-react';

const VIDEOS = [
  {
    title: 'Meditation',
    description:
      'Meditation is a timeless practice for calming the mind, reducing anxiety, and restoring inner balance.',
    buttonText: 'Meditation Videos to Calm Your Mind',
    url: 'https://youtu.be/Hzi3PDz1AWU?si=P4pUas1Dg7DupXFB',
    img: '/images/image5.jpeg',
  },
  {
    title: 'Yoga',
    description:
      'Ancient yoga practices help improve flexibility, immunity, posture, and holistic physical & mental wellness.',
    buttonText: 'Yoga Videos to Keep Your Mind Calm',
    url: 'https://youtu.be/dAqQqmaI9vY?si=fdNjYw2oA3oede4v',
    img: '/images/image6.jpeg',
  },
  {
    title: 'Stress Management',
    description:
      'Mental health is just as important as physical health. Watch practical techniques to manage daily stress.',
    buttonText: 'Stress Management & Mind Calm Videos',
    url: 'https://youtu.be/qUz93CyNIz0?si=qw9DiCcZ8BWhpuA0',
    img: '/images/image7.jpeg',
  },
  {
    title: 'Health & Hygiene',
    description:
      'Maintain everyday health and personal hygiene habits simultaneously to prevent common infections.',
    buttonText: 'Health Maintenance & Hygiene',
    url: 'https://youtu.be/5J89gCDt_rk?si=aQ-FRzCfzjLM5q5a',
    img: '/images/image4.jpeg',
  },
];

export default function VideosPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Health &amp; Wellness Videos
        </h1>
        <p className="text-slate-600 mt-2 max-w-2xl mx-auto">
          Curated wellness videos on meditation, yoga, stress management, and daily hygiene.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {VIDEOS.map((v) => (
          <div
            key={v.title}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
          >
            <div className="h-48 bg-slate-100 relative overflow-hidden">
              <img
                src={v.img}
                alt={v.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-rose-400" />
                  {v.title}
                </h2>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <p className="text-sm text-slate-600 leading-relaxed mb-5">{v.description}</p>
              <a
                href={v.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-colors"
              >
                {v.buttonText}
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
