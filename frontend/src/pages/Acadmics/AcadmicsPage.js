import React from 'react';
import {
  BookOpen,
  GraduationCap,
  Microscope,
  Palette,
  Calculator,
  Globe,
  Code,
  Music,
  FlaskRound,
  Users,
  Target,
  Award,
  Clock,
  Calendar,
  CheckCircle,
  BarChart,
  Lightbulb,
  Library
} from 'lucide-react';

const AcademicsPage = () => {
  // Academic Programs
  const academicPrograms = [
    {
      icon: <Calculator className="h-10 w-10" />,
      title: 'Science & Mathematics',
      description: 'Advanced courses in Physics, Chemistry, Biology, and Mathematics with practical lab sessions',
      grades: '9-12',
      features: ['Advanced Placement', 'Research Projects', 'STEM Labs']
    },
    {
      icon: <Globe className="h-10 w-10" />,
      title: 'Humanities & Social Sciences',
      description: 'Comprehensive study of History, Geography, Economics, and Political Science',
      grades: '6-12',
      features: ['Model UN', 'Debate Club', 'Field Research']
    },
    {
      icon: <Code className="h-10 w-10" />,
      title: 'Technology & Computer Science',
      description: 'Modern programming, robotics, and digital literacy for the 21st century',
      grades: '5-12',
      features: ['Coding Bootcamps', 'Robotics Club', 'AI Basics']
    },
    {
      icon: <Palette className="h-10 w-10" />,
      title: 'Arts & Creative Studies',
      description: 'Visual arts, performing arts, music, and creative writing programs',
      grades: '1-12',
      features: ['Art Exhibitions', 'Music Concerts', 'Drama Productions']
    }
  ];

  // Grade Levels
  const gradeLevels = [
    {
      level: 'Elementary School',
      grades: 'Grades 1-5',
      description: 'Foundational learning with emphasis on literacy, numeracy, and social skills',
      focus: ['Basic Literacy', 'Numeracy Skills', 'Social Development', 'Creative Play']
    },
    {
      level: 'Middle School',
      grades: 'Grades 6-8',
      description: 'Transitional phase with introduction to specialized subjects',
      focus: ['Subject Specialization', 'Critical Thinking', 'Project-Based Learning']
    },
    {
      level: 'High School',
      grades: 'Grades 9-12',
      description: 'College preparatory curriculum with advanced placement options',
      focus: ['Advanced Courses', 'College Prep', 'Career Guidance', 'AP Classes']
    }
  ];

  // Special Programs
  const specialPrograms = [
    {
      icon: <Award className="h-8 w-8" />,
      title: 'Honors Program',
      description: 'Accelerated learning for high-achieving students'
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: 'Gifted & Talented',
      description: 'Specialized curriculum for gifted students'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Learning Support',
      description: 'Individualized support for diverse learning needs'
    },
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: 'Innovation Lab',
      description: 'Hands-on STEM and technology projects'
    }
  ];

  // Academic Calendar Highlights
  const academicCalendar = [
    { month: 'August', event: 'Academic Year Begins', type: 'Important Date' },
    { month: 'October', event: 'Mid-Term Examinations', type: 'Assessment' },
    { month: 'December', event: 'Winter Break', type: 'Holiday' },
    { month: 'January', event: 'Science Fair', type: 'Academic Event' },
    { month: 'March', event: 'Final Examinations', type: 'Assessment' },
    { month: 'June', event: 'Graduation Ceremony', type: 'Celebration' }
  ];

  // Faculty Stats
  const facultyStats = [
    { label: 'Total Faculty', value: '85+', icon: <Users className="h-6 w-6" /> },
    { label: 'PhD Holders', value: '65%', icon: <GraduationCap className="h-6 w-6" /> },
    { label: 'Avg. Experience', value: '15+ Years', icon: <Clock className="h-6 w-6" /> },
    { label: 'Student-Teacher Ratio', value: '12:1', icon: <BarChart className="h-6 w-6" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-700 to-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10">
            <BookOpen className="h-40 w-40" />
          </div>
          <div className="absolute bottom-10 right-10">
            <GraduationCap className="h-40 w-40" />
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/20 rounded-full mb-6">
              <Award className="h-5 w-5" />
              <span className="font-semibold">Excellence in Education</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Academic Excellence
              <span className="block text-blue-200">Our Curriculum</span>
            </h1>
            
            <p className="text-xl mb-8 max-w-3xl">
              A comprehensive, innovative, and balanced curriculum designed to nurture 
              intellectual curiosity, critical thinking, and lifelong learning skills.
            </p>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full">
            <path fill="#f0f9ff" fillOpacity="1" d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,74.7C1120,75,1280,53,1360,42.7L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 -mt-10 relative z-10">
        
        {/* Faculty Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {facultyStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 border border-blue-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <div className="text-blue-600">{stat.icon}</div>
                </div>
              </div>
              <div className="text-3xl font-bold text-blue-700 mb-2">{stat.value}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Academic Programs */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Academic Programs
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our diverse curriculum is designed to meet the needs of every student
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {academicPrograms.map((program, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="p-8">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <div className="text-blue-600">{program.icon}</div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{program.title}</h3>
                      <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold mt-2">
                        {program.grades}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6">
                    {program.description}
                  </p>
                  
                  <div className="space-y-3">
                    {program.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
               
              </div>
            ))}
          </div>
        </div>

        {/* Grade Levels Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Grade Level Structure
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {gradeLevels.map((level, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-blue-500"
              >
                <div className="text-center mb-6">
                  <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-bold text-lg">
                    {level.grades}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mt-4">{level.level}</h3>
                </div>
                
                <p className="text-gray-600 mb-6 text-center">
                  {level.description}
                </p>
                
                <div className="space-y-3">
                  {level.focus.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Special Programs */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Special Programs
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {specialPrograms.map((program, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <div className="text-blue-600">{program.icon}</div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{program.title}</h3>
                <p className="text-gray-600">{program.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Academic Calendar */}
        <div className="mb-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Academic Calendar</h2>
              <p className="text-gray-600">Key dates and events for the academic year</p>
            </div>
            
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-4 px-6 text-left font-semibold text-gray-700">Month</th>
                    <th className="py-4 px-6 text-left font-semibold text-gray-700">Event</th>
                    <th className="py-4 px-6 text-left font-semibold text-gray-700">Type</th>
                    <th className="py-4 px-6 text-left font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {academicCalendar.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="font-bold text-gray-800">{item.month}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-800">{item.event}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          item.type === 'Important Date' 
                            ? 'bg-blue-100 text-blue-700'
                            : item.type === 'Assessment'
                            ? 'bg-red-100 text-red-700'
                            : item.type === 'Holiday'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-700">
                          <Calendar className="w-4 h-4 mr-1" />
                          Upcoming
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        
      </div>
    </div>
  );
};

export default AcademicsPage;