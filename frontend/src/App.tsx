import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AuthSuccess from './pages/AuthSuccess';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-linkedin-400/20 to-blue-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <Header />
        <main className="relative z-10">
          <div className="section-container py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth/success" element={<AuthSuccess />} />
              <Route 
                path="/auth/error" 
                element={
                  <div className="text-center mt-16 fade-in">
                    <div className="card max-w-md mx-auto">
                      <div className="text-red-600 text-6xl mb-4">⚠️</div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Failed</h2>
                      <p className="text-gray-600">Please try connecting your LinkedIn account again.</p>
                    </div>
                  </div>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </div>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App; 