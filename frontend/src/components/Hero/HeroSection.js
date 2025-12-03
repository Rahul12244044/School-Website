import React from 'react';
import { ChevronRight, Award, Users, BookOpen } from 'lucide-react';

const HeroSection = () => {
  const stats = [
    { icon: <Award className="h-8 w-8" />, value: '95%', label: 'Success Rate' },
    { icon: <Users className="h-8 w-8" />, value: '1500+', label: 'Students' },
    { icon: <BookOpen className="h-8 w-8" />, value: '50+', label: 'Courses' },
  ];

  return (
    <div className="relative bg-gradient-to-r from-blue-200 to-blue-400 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-semibold mb-4">
              Excellence in Education Since 1995
            </span>
            
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              Shaping Future
              <span className="block text-secondary-400">Leaders Today</span>
            </h1>
            
            <p className="text-xl mb-8 opacity-90">
              A premier educational institution dedicated to holistic development 
              and academic excellence. Join our vibrant learning community.
            </p>
            
           
          </div>

          {/* Right Content - Stats */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-white/20 rounded-full">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-4xl font-bold mb-1">{stat.value}</div>
                <div className="text-white/80">{stat.label}</div>
              </div>
            ))}
            
            {/* Achievement Badge */}
            <div className="col-span-2 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold mb-1">#1</div>
                  <div className="text-white/80">Ranked School in State</div>
                </div>
                <div className="text-5xl">🏆</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full">
          <path fill="#ffffff" fillOpacity="1" d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,74.7C1120,75,1280,53,1360,42.7L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;