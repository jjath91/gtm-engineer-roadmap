import { useState } from 'react'
import Home from './Home'
import GTMRoadmap from './GTMRoadmap'
import GenAIRoadmap from './GenAIRoadmap'
import CFPRoadmap from './CFPRoadmap'
import PhysicsEERoadmap from './PhysicsEERoadmap'
import AppliedAIRoadmap from './AppliedAIRoadmap'
import FinancialMarketsRoadmap from './FinancialMarketsRoadmap'
import ThinkingToolsRoadmap from './ThinkingToolsRoadmap'

function App() {
  const [view, setView] = useState('home')

  if (view === 'thinking-tools') return <ThinkingToolsRoadmap onBack={() => setView('home')} />
  if (view === 'gtm') return <GTMRoadmap onBack={() => setView('home')} />
  if (view === 'applied-ai') return <AppliedAIRoadmap onBack={() => setView('home')} />
  if (view === 'financial-markets') return <FinancialMarketsRoadmap onBack={() => setView('home')} />
  if (view === 'genai') return <GenAIRoadmap onBack={() => setView('home')} />
  if (view === 'cfp') return <CFPRoadmap onBack={() => setView('home')} />
  if (view === 'physics-ee') return <PhysicsEERoadmap onBack={() => setView('home')} />
  return <Home onSelect={setView} />
}

export default App
