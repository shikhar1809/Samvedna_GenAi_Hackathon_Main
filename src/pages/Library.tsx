import { useNavigate } from 'react-router-dom'

const resources = [
  {
    id: 1,
    category: 'CBT',
    title: 'Introduction to Cognitive Behavioral Therapy',
    description: 'Learn the basics of CBT and how it can help manage negative thought patterns.',
    type: 'Article',
    url: 'https://www.apa.org/ptsd-guideline/patients-and-families/cognitive-behavioral'
  },
  {
    id: 2,
    category: 'Mindfulness',
    title: '10-Minute Mindfulness Meditation',
    description: 'A guided meditation to help you relax and center yourself.',
    type: 'Video',
    url: 'https://www.youtube.com/watch?v=ZToicYcHIOU'
  },
  {
    id: 3,
    category: 'DBT',
    title: 'Understanding Dialectical Behavior Therapy',
    description: 'Overview of DBT techniques for emotional regulation.',
    type: 'Article',
    url: 'https://behavioraltech.org/resources/faqs/dialectical-behavior-therapy-dbt/'
  },
  {
    id: 4,
    category: 'Breathing',
    title: '4-7-8 Breathing Exercise',
    description: 'A simple breathing technique to reduce anxiety and promote calm.',
    type: 'Video',
    url: 'https://www.youtube.com/watch?v=gz4G31LGyog'
  },
  {
    id: 5,
    category: 'Mindfulness',
    title: 'Body Scan Meditation',
    description: 'Progressive relaxation technique for stress relief.',
    type: 'Video',
    url: 'https://www.youtube.com/watch?v=15q-N-_oPkEg'
  },
  {
    id: 6,
    category: 'CBT',
    title: 'Challenging Negative Thoughts Worksheet',
    description: 'Practical exercises for identifying and reframing cognitive distortions.',
    type: 'Article',
    url: 'https://www.therapistaid.com/therapy-worksheet/cbt-thought-record'
  },
]

export default function Library() {
  const navigate = useNavigate()

  const categories = Array.from(new Set(resources.map(r => r.category)))

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">Therapy Library</h1>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 text-sm border border-border rounded-md hover:bg-accent transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-muted-foreground mb-8">
            Explore curated resources to support your mental health journey
          </p>

          {categories.map(category => (
            <div key={category} className="mb-8">
              <h2 className="text-xl font-bold mb-4">{category}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources
                  .filter(r => r.category === category)
                  .map(resource => (
                    <div
                      key={resource.id}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-border hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-lg">{resource.title}</h3>
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                          {resource.type}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {resource.description}
                      </p>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm"
                      >
                        View Resource →
                      </a>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

