import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './components/AuthProvider'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<div className="min-h-screen bg-background text-foreground flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">SAMVEDNA</h1>
                <p className="text-muted-foreground">AI Mental Health Companion</p>
                <p className="text-sm mt-4">Setting up...</p>
              </div>
            </div>} />
          </Routes>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  )
}

export default App

