import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to <span className="text-primary">SAMVEDNA</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Your AI-powered companion for mental wellness. Get personalized support, connect with peers, 
            and embark on a journey towards better mental health.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-3 rounded-lg font-semibold border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/dashboard"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
            >
              🚀 Try Demo
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">🧠</div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered Diagnosis</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get personalized mental health insights using advanced AI trained on DSM-5 criteria.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-semibold mb-2">Peer Support</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Connect with matched peers who understand your journey and provide mutual support.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">📓</div>
            <h3 className="text-xl font-semibold mb-2">Smart Journaling</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Track your mood and thoughts with AI-enhanced journaling and progress analytics.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">💭</div>
            <h3 className="text-xl font-semibold mb-2">CBT Tools</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Reframe negative thoughts with cognitive behavioral therapy techniques.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold mb-2">Support Groups</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Join communities focused on specific mental health conditions and share experiences.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-2">Private & Secure</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Your data is encrypted and protected. Anonymous venting available for extra privacy.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <h2 className="text-3xl font-bold mb-4">Ready to start your wellness journey?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Join thousands who are taking control of their mental health
          </p>
          <Link
            to="/signup"
            className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  )
}

