import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
//import { AllTagsProvider } from './context/AllTagsContext';
import { Toaster } from 'react-hot-toast';

// pages and components
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Read from "./pages/Read";
import Navbar from './components/Navbar';
import CreateNew from './components/CreateNew';
import Footer from './components/Footer';


function App() {
  const { user } = useAuthContext()

  return (
    <div className="App">
      <BrowserRouter>
      {/* <AllTagsProvider> */ }
      <Toaster 
        position='top-center'
        toastOptions={{
          duration: 3000,
          style: {
            color: '#fffffff',
          },
          success: {
            duration: 3000,
            style: {
              color: "#435362",
              fontFamily: "Lexend Deca, Helvetica, Arial, sans-serif",
              fontWeight: "bold"
            },
            iconTheme: {
              primary: "#BD7374",
            }
          },
        }}/>
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
              element={!user ? <Signup /> : <Read />}
            />
            <Route
              path="/create_new"
              element={!user ? <Signup /> : <CreateNew />}
            />
          </Routes>
        </div>
        <Footer />
        { /* </AllTagsProvider> */ }
      </BrowserRouter>
    </div>
  )
}

export default App;
