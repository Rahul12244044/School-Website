import React, { useState } from 'react';
import { 
  MapPin, Phone, Mail, Clock, Send, CheckCircle,
  Facebook, Twitter, Instagram, Youtube, MessageCircle,
  AlertCircle, Loader2, Home, School, User, Calendar,
  Building, Globe, Shield, BookOpen, Users, Award
} from 'lucide-react';
import emailjs from '@emailjs/browser';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    studentGrade: '',
    inquiryType: 'general'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);

  // EmailJS Configuration - REPLACE WITH YOUR CREDENTIALS
  const EMAILJS_CONFIG = {
    SERVICE_ID: 'service_kyjnthl', // Replace with your EmailJS Service ID
    TEMPLATE_ID: 'template_r7k17n8', // Replace with your EmailJS Template ID
    PUBLIC_KEY: 'U2fESCkFzJEDIRu8T' // Replace with your EmailJS Public Key
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Get current date and time
      const now = new Date();
      const date = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const time = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      // Prepare template parameters
      const templateParams = {
        to_email: 'radhakr2412@gmail.com',
        to_name: 'School Administration',
        from_name: formData.name,
        from_email: formData.email,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || 'Not provided',
        subject: formData.subject,
        message: formData.message,
        student_grade: formData.studentGrade || 'Not applicable',
        inquiry_type: formData.inquiryType,
        date: date,
        time: time,
        reply_to: formData.email
      };

      console.log('Sending email to radhakr2412@gmail.com:', templateParams);

      // Send email using EmailJS
      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAILJS_CONFIG.PUBLIC_KEY
      );

      // Success
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        studentGrade: '',
        inquiryType: 'general'
      });

      setTimeout(() => setIsSubmitted(false), 5000);

    } catch (err) {
      console.error('Email sending failed:', err);
      setError('Failed to send message. Please email us directly at radhakr2412@gmail.com or call us.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: <MapPin className="h-6 w-6" />,
      title: 'Visit Our Campus',
      details: ['123 Education Street', 'Academic City, AC 12345', 'United States'],
      description: 'Main Administration Building',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: 'Contact Numbers',
      details: ['Main Office: (555) 123-4567', 'Admissions: (555) 123-4568', 'Emergency: (555) 123-911'],
      description: 'Mon-Fri: 8:00 AM - 5:00 PM',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: 'Email Addresses',
      details: [
        'General: info@premierschool.edu',
        'Admissions: admissions@premierschool.edu',
        'Support: support@premierschool.edu'
      ],
      description: 'Response within 24 hours',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Office Hours',
      details: [
        'Monday - Friday: 8:00 AM - 5:00 PM',
        'Saturday: 9:00 AM - 1:00 PM',
        'Sunday: Closed'
      ],
      description: 'Appointments recommended',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const departments = [
    { name: 'Admissions', phone: '(555) 123-4568', email: 'admissions@premierschool.edu', icon: <User className="h-4 w-4" /> },
    { name: 'Academic Affairs', phone: '(555) 123-4569', email: 'academics@premierschool.edu', icon: <BookOpen className="h-4 w-4" /> },
    { name: 'Student Services', phone: '(555) 123-4570', email: 'services@premierschool.edu', icon: <Users className="h-4 w-4" /> },
    { name: 'Finance Office', phone: '(555) 123-4571', email: 'finance@premierschool.edu', icon: <Shield className="h-4 w-4" /> },
    { name: 'Athletics', phone: '(555) 123-4572', email: 'athletics@premierschool.edu', icon: <Award className="h-4 w-4" /> },
    { name: 'Alumni Relations', phone: '(555) 123-4573', email: 'alumni@premierschool.edu', icon: <Building className="h-4 w-4" /> }
  ];

  const socialMedia = [
    { icon: <Facebook className="h-5 w-5" />, name: 'Facebook', link: '#', color: 'hover:bg-blue-100 hover:text-blue-600' },
    { icon: <Twitter className="h-5 w-5" />, name: 'Twitter', link: '#', color: 'hover:bg-sky-100 hover:text-sky-600' },
    { icon: <Instagram className="h-5 w-5" />, name: 'Instagram', link: '#', color: 'hover:bg-pink-100 hover:text-pink-600' },
    { icon: <Youtube className="h-5 w-5" />, name: 'YouTube', link: '#', color: 'hover:bg-red-100 hover:text-red-600' }
  ];

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry', icon: <Home className="h-4 w-4" /> },
    { value: 'admissions', label: 'Admissions', icon: <School className="h-4 w-4" /> },
    { value: 'academic', label: 'Academic Questions', icon: <BookOpen className="h-4 w-4" /> },
    { value: 'financial', label: 'Financial Aid', icon: <Shield className="h-4 w-4" /> },
    { value: 'visit', label: 'Schedule a Visit', icon: <Calendar className="h-4 w-4" /> }
  ];

  const gradeOptions = [
    { value: '', label: 'Select grade level' },
    { value: 'preschool', label: 'Preschool' },
    { value: 'kindergarten', label: 'Kindergarten' },
    { value: '1-5', label: 'Elementary School (Grades 1-5)' },
    { value: '6-8', label: 'Middle School (Grades 6-8)' },
    { value: '9-12', label: 'High School (Grades 9-12)' },
    { value: 'not-applicable', label: 'Not Applicable' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full translate-y-48 -translate-x-48"></div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-semibold mb-6">
              <Globe className="h-4 w-4 mr-2" />
              Excellence in Education Since 1995
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              Bright Future School
              <span className="block text-blue-200">We're Here to Help You</span>
            </h1>
            
            <p className="text-xl mb-8 opacity-90 max-w-3xl">
              Connect with our dedicated team for admissions, academic inquiries, or any questions about our programs. 
              We're committed to providing exceptional support to our students and families.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <a 
                href="tel:5551234567" 
                className="inline-flex items-center px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-colors duration-200"
              >
                <Phone className="h-5 w-5 mr-2" />
                Call Now: (555) 123-4567
              </a>
              <a 
                href="mailto:radhakr2412@gmail.com" 
                className="inline-flex items-center px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-colors duration-200"
              >
                <Mail className="h-5 w-5 mr-2" />
                Email: radhakr2412@gmail.com
              </a>
            </div>
          </div>
        </div>
        
        {/* Wave Decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full">
            <path fill="#f9fafb" fillOpacity="1" d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,74.7C1120,75,1280,53,1360,42.7L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 -mt-12 relative z-20">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column - Contact Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {contactInfo.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-start space-x-4 mb-4">
                    <div className={`p-3 bg-gradient-to-br ${item.color} text-white rounded-xl`}>
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {item.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-700">
                        {detail}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Departments Grid */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <MessageCircle className="h-6 w-6 mr-2 text-blue-600" />
                    Department Contacts
                  </h2>
                  <p className="text-gray-600 mt-1">Direct lines to specific departments</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments.map((dept, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex items-start space-x-3 mb-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                        {dept.icon}
                      </div>
                      <h4 className="font-bold text-gray-800 text-lg">{dept.name}</h4>
                    </div>
                    <a href={`tel:${dept.phone.replace(/\D/g, '')}`} className="text-gray-600 text-sm mb-1 hover:text-blue-600 transition-colors block">
                      📞 {dept.phone}
                    </a>
                    <a href={`mailto:${dept.email}`} className="text-blue-600 text-sm truncate hover:text-blue-700 transition-colors block">
                      ✉️ {dept.email}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Connect With Us Online
              </h2>
              <div className="flex flex-wrap gap-4">
                {socialMedia.map((social, index) => (
                  <a
                    key={index}
                    href={social.link}
                    className={`flex items-center space-x-3 px-6 py-3 bg-gray-50 rounded-xl border border-gray-200 transition-all duration-200 group ${social.color}`}
                  >
                    <span className="text-gray-600 group-hover:text-current">
                      {social.icon}
                    </span>
                    <span className="font-medium text-gray-700 group-hover:text-current">
                      {social.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 sticky top-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4">
                  <Send className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Send a Message
                </h2>
                <p className="text-gray-600">
                  All messages are sent directly to radhakr2412@gmail.com
                </p>
              </div>

              {/* Success Message */}
              {isSubmitted && (
                <div className="mb-6 p-5 bg-green-50 border border-green-200 rounded-xl animate-fadeIn">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-green-700 font-medium mb-1">
                        ✅ Message Sent Successfully!
                      </p>
                      <p className="text-green-600 text-sm">
                        Your message has been delivered to <strong>radhakr2412@gmail.com</strong>. 
                        We'll respond to <strong>{formData.email}</strong> within 24 hours.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-5 bg-red-50 border border-red-200 rounded-xl animate-fadeIn">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-red-700 font-medium mb-1">⚠️ Error Sending Message</p>
                      <p className="text-red-600 text-sm mb-2">{error}</p>
                      <p className="text-red-600 text-sm">
                        Please contact us directly:<br/>
                        📧 <strong>radhakr2412@gmail.com</strong><br/>
                        📞 <strong>(555) 123-4567</strong>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="John Smith"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Inquiry Type *
                  </label>
                  <div className="relative">
                    <select
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-white appearance-none"
                    >
                      {inquiryTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Student Grade Level
                  </label>
                  <select
                    name="studentGrade"
                    value={formData.studentGrade}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-white"
                  >
                    {gradeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="Inquiry about admissions"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
                    placeholder="Please type your detailed message here..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg ${
                    isSubmitting 
                      ? 'opacity-70 cursor-not-allowed' 
                      : 'hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Sending to radhakr2412@gmail.com...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Send Message Now
                    </>
                  )}
                </button>

                <div className="text-center text-gray-500 text-sm pt-4 border-t">
                  <div className="flex items-center justify-center mb-2">
                    <Mail className="h-4 w-4 mr-2 text-blue-500" />
                    <span>Direct delivery to: </span>
                    <strong className="ml-1 text-gray-700">radhakr2412@gmail.com</strong>
                  </div>
                  <p className="text-xs text-gray-400">
                    ✨ We respond within 24 hours on business days
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Map & Directions Section */}
        <div className="mt-16">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            <div className="p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Visit Our Campus
                  </h2>
                  <p className="text-gray-600">Experience our state-of-the-art facilities firsthand</p>
                </div>
                <a
                  href="https://maps.google.com/?q=123+Education+Street,+Academic+City,+AC+12345"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <MapPin className="h-5 w-5 mr-2" />
                  Get Directions on Google Maps
                </a>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <div className="h-[400px] bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl overflow-hidden relative">
                    {/* Map Placeholder */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                      <div className="p-4 bg-white rounded-full shadow-lg mb-4">
                        <MapPin className="h-16 w-16 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        Premier School Campus
                      </h3>
                      <p className="text-gray-600 max-w-md">
                        123 Education Street<br/>
                        Academic City, AC 12345<br/>
                        United States
                      </p>
                      <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4">
                          <div className="text-blue-600 font-semibold">Parking</div>
                          <div className="text-gray-600 text-sm">Visitor parking available</div>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4">
                          <div className="text-blue-600 font-semibold">Security</div>
                          <div className="text-gray-600 text-sm">24/7 campus security</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                      Campus Tour Hours
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mon-Fri</span>
                        <span className="font-semibold">10:00 AM - 3:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Saturday</span>
                        <span className="font-semibold">9:00 AM - 12:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sunday</span>
                        <span className="font-semibold text-red-500">Closed</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-bold text-gray-800 mb-4">Quick Links</h4>
                    <div className="space-y-3">
                      <a href="#" className="flex items-center text-blue-600 hover:text-blue-700 transition-colors">
                        <School className="h-4 w-4 mr-2" />
                        Admissions Requirements
                      </a>
                      <a href="#" className="flex items-center text-blue-600 hover:text-blue-700 transition-colors">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Academic Calendar
                      </a>
                      <a href="#" className="flex items-center text-blue-600 hover:text-blue-700 transition-colors">
                        <Users className="h-4 w-4 mr-2" />
                        Faculty Directory
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
};

// Add custom animations
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }
`;
document.head.appendChild(style);

export default ContactPage;