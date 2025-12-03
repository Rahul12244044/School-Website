import React from 'react';
import { 
  Award, 
  Users, 
  BookOpen, 
  Target,
  Heart,
  Globe,
  Clock,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Shield
} from 'lucide-react';

const AboutPage = () => {
  const coreValues = [
    {
      icon: <Target className="h-10 w-10" />,
      title: 'Excellence',
      description: 'Committed to academic excellence and personal growth'
    },
    {
      icon: <Heart className="h-10 w-10" />,
      title: 'Integrity',
      description: 'Building character through ethical values and honesty'
    },
    {
      icon: <Users className="h-10 w-10" />,
      title: 'Community',
      description: 'Fostering a supportive and inclusive environment'
    },
    {
      icon: <Globe className="h-10 w-10" />,
      title: 'Innovation',
      description: 'Embracing modern teaching methodologies'
    }
  ];

  const milestones = [
    { year: '1995', event: 'School Founded', description: 'Started with 50 students' },
    { year: '2005', event: 'State Recognition', description: 'Awarded Best Emerging School' },
    { year: '2015', event: 'Expansion', description: 'New science and tech wing added' },
    { year: '2023', event: 'Digital Campus', description: 'Fully integrated smart classrooms' }
  ];

  const leadershipTeam = [
    { name: 'Dr. Sarah Johnson', role: 'Principal', experience: '25+ years in education' },
    { name: 'Prof. Michael Chen', role: 'Vice Principal', experience: 'Curriculum Specialist' },
    { name: 'Ms. Emily Parker', role: 'Head of Academics', experience: 'PhD in Educational Leadership' },
    { name: 'Mr. David Wilson', role: 'Student Affairs', experience: '20+ years student counseling' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section for About Page */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About Our Institution
            </h1>
            <p className="text-xl opacity-90">
              For nearly three decades, we have been at the forefront of educational 
              excellence, shaping young minds and building future leaders through 
              innovative teaching and holistic development.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full">
            <path fill="#f9fafb" fillOpacity="1" d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,74.7C1120,75,1280,53,1360,42.7L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 -mt-10 relative z-10">
        
        {/* Our Story Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Established in 1995, our institution began with a simple yet powerful vision: 
                  to create an educational environment where every student can discover their 
                  potential and develop into well-rounded individuals.
                </p>
                <p>
                  What started as a small school with just 50 students has grown into a 
                  premier educational institution recognized statewide for its academic 
                  excellence and innovative teaching methodologies.
                </p>
                <p>
                  Today, we stand as a testament to our founders' vision, continuously 
                  evolving while staying true to our core values of excellence, integrity, 
                  and community.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-blue-100 rounded-2xl p-8">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="p-3 bg-blue-600 rounded-full">
                    <Calendar className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-blue-600">28+</div>
                    <div className="text-gray-600">Years of Excellence</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <span>State Certified Institution</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Award className="h-5 w-5 text-blue-600" />
                    <span>Accredited by National Board</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                    <span>100% College Placement</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                    {value.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center text-gray-800 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones Timeline */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            Our Journey
          </h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className="w-1/2 px-8">
                    <div className={`bg-white p-6 rounded-xl shadow-lg border-l-4 ${index % 2 === 0 ? 'border-blue-500 text-right' : 'border-blue-500'}`}>
                      <div className="text-2xl font-bold text-blue-600 mb-2">
                        {milestone.year}
                      </div>
                      <div className="text-xl font-semibold text-gray-800 mb-2">
                        {milestone.event}
                      </div>
                      <p className="text-gray-600">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-blue-600 rounded-full border-4 border-white relative z-10"></div>
                  <div className="w-1/2 px-8">
                    {/* Empty for spacing */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leadership Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Leadership Team
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {leadershipTeam.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-center text-gray-800 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 text-center font-semibold mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-center text-sm">
                    {member.experience}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-8">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Get in Touch
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
              <p className="opacity-90">123 Education Street</p>
              <p className="opacity-90">Knowledge City, State 12345</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Phone className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Call Us</h3>
              <p className="opacity-90">(123) 456-7890</p>
              <p className="opacity-90">Mon-Fri: 8:00 AM - 5:00 PM</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Mail className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email Us</h3>
              <p className="opacity-90">info@ourschool.edu</p>
              <p className="opacity-90">admissions@ourschool.edu</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;