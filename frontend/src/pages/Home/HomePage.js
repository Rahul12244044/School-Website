import React from 'react';
import HeroSection from '../../components/Hero/HeroSection';
import EventsSection from '../../components/Events/EventsSection';
import NewsSection from '../../components/News/NewsSection';
import GallerySection from '../../components/Gallery/GallerySection';
import StatsSection from '../../components/Stats/StatsSection';

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <StatsSection />
      <EventsSection />
      <NewsSection />
    </div>
  );
};

export default HomePage;