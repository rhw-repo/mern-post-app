import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import { Toaster } from 'react-hot-toast';

// pages and components
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from './components/Navbar';
import CreateNew from './components/CreateNew';
import Footer from './components/Footer';
import ContentDetail from './pages/ContentDetail';
import ErrorBoundary from './components/ErrorBoundary';


function App() {
  const { user } = useAuthContext()

  return (
    <ErrorBoundary>
      <div className="App">
        <BrowserRouter>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              className: "toaster",
              success: {
                duration: 3000,
                className: "toaster-success",
              },
            }} />
          <Navbar />
          <div className='pages'>
            <Routes>
              <Route
                path="/"
                element={user ? <Home /> : <Navigate to="/login" />}
              />
              <Route
                path="/login"
                element={!user ? <Login /> : <Navigate to="/" />}
              />
              <Route
                path="/signup"
                element={!user ? <Signup /> : <Navigate to="/" />}
              />
              <Route
                path="/articles/:_id"
                element={!user ? <Signup /> : <ContentDetail />}
              />
              <Route
                path="/create_new"
                element={!user ? <Signup /> : <CreateNew />}
              />
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </div>
    </ErrorBoundary>
  )
}

export default App;
