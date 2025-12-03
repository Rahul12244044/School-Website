import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setTheme } from './store/slices/uiSlice';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/Home/HomePage';
import EventsPage from './pages/Events/EventsPage';
import NewsPage from './pages/News/NewsPage';
import GalleryPage from './pages/Gallery/GalleryPage';
import EventDetailPage from './pages/Events/EventDetailPage';
import NewsDetailPage from './pages/News/NewsDetailPage';
import ContactPage from "./pages/Contact/Contactpage"
import AboutPage from "./pages/About/AboutPage";
import AcademicsPage from "./pages/Acadmics/AcadmicsPage";
import Toast from './components/Common/Toast';
import LoadingSpinner from './components/Common/LoadingSpinner';
import './App.css';

// ... existing imports ...

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    dispatch(setTheme(savedTheme));
    
    // Apply theme to document
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dispatch]);

  return (
    <Router>
      <div className="App min-h-screen flex flex-col">
        <Toast />
        <LoadingSpinner />
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:id" element={<NewsDetailPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            {/* Add more routes as needed */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage/>}/>
            <Route path="/academics" element={<AcademicsPage/>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;