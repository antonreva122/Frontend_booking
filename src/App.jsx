import { AuthProvider } from './context/AuthContext'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <header className="App-header">
          <h1>🎫 Booking System</h1>
          <p>Welcome to your booking management system</p>
          <div className="info-box">
            <h2>Status: Setup Complete ✓</h2>
            <p>React frontend is ready!</p>
            <p>Backend API: <code>http://127.0.0.1:8000</code></p>
            <p>Authentication Context: <code>✓ Active</code></p>
          </div>
        </header>
      </div>
    </AuthProvider>
  )
}

export default App

