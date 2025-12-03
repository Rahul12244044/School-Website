import React from 'react';
import { GraduationCap, Users, Trophy, Globe } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    {
      icon: <GraduationCap className="h-10 w-10" />,
      value: '98%',
      label: 'Graduation Rate',
      description: 'College acceptance'
    },
    {
      icon: <Users className="h-10 w-10" />,
      value: '150+',
      label: 'Certified Teachers',
      description: 'Highly qualified staff'
    },
    {
      icon: <Trophy className="h-10 w-10" />,
      value: '25+',
      label: 'National Awards',
      description: 'Academic excellence'
    },
    {
      icon: <Globe className="h-10 w-10" />,
      value: '15+',
      label: 'Countries',
      description: 'Student diversity'
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose Our School
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We are committed to providing the best educational experience 
            with proven results and exceptional facilities.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-100 text-primary-600 mb-6">
                {stat.icon}
              </div>
              <div className="text-5xl font-bold text-gray-900 mb-2">
                {stat.value}
              </div>
              <div className="text-xl font-semibold text-gray-800 mb-2">
                {stat.label}
              </div>
              <p className="text-gray-600">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;