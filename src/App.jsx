import { useState } from 'react'
import Home from './Home'
import GTMRoadmap from './GTMRoadmap'
import GenAIRoadmap from './GenAIRoadmap'
import CFPRoadmap from './CFPRoadmap'

function App() {
  const [view, setView] = useState('home')

  if (view === 'gtm') return <GTMRoadmap onBack={() => setView('home')} />
  if (view === 'genai') return <GenAIRoadmap onBack={() => setView('home')} />
  if (view === 'cfp') return <CFPRoadmap onBack={() => setView('home')} />
  return <Home onSelect={setView} />
}

export default App
