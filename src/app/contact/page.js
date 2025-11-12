'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '../../components/landing/Navigation';
import Footer from '../../components/common/Footer';

export default function ContactPage() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    // Trigger animations after component mounts
    setIsLoaded(true);
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitStatus('success');
      setIsSubmitting(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 1000);
  };

  const contactMethods = [
    {
      id: 1,
      title: 'Email',
      info: 'support@ictbydulan.com',
      description: 'Send us an email and we\'ll respond within 24 hours',
      icon: '📧',
    },
    {
      id: 2,
      title: 'Phone',
      info: '+94 77 123 4567',
      description: 'Call us during office hours for immediate assistance',
      icon: '📞',
    },
    {
      id: 3,
      title: 'Address',
      info: 'Colombo, Sri Lanka',
      description: 'Visit us at our office during business hours',
      icon: '📍',
    },
    {
      id: 4,
      title: 'Office Hours',
      info: 'Mon - Fri: 9AM - 5PM',
      description: 'We\'re available to help you during these times',
      icon: '🕐',
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="pt-24 pb-12 lg:pt-32 lg:pb-16">
          <div className="max-w-6xl mx-auto px-4">
            {/* Animated Hero Content */}
            <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="text-center max-w-4xl mx-auto">
                <img 
                  src="/images/logo-full.svg" 
                  alt="ICTBYDULAN.COM" 
                  className="h-7 lg:h-10 w-auto mx-auto mb-3 lg:mb-4"
                />
                <h1 className="text-3xl lg:text-5xl font-light tracking-tight text-black mb-4">
                  Contact Us
                </h1>
                <p className="text-lg lg:text-xl text-gray-600 font-light">
                  Get in touch with us for any questions or support
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Methods Grid Section */}
        <section className="py-12 lg:py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {contactMethods.map((method, index) => (
                <div
                  key={method.id}
                  className={`transition-all duration-1000 delay-${index * 150} ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                >
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 lg:p-8 hover:shadow-lg transition-shadow duration-300">
                    <div className="text-4xl mb-4">{method.icon}</div>
                    <h3 className="text-2xl font-light text-black mb-2">
                      {method.title}
                    </h3>
                    <p className="text-sm text-blue-600 mb-3 font-medium">
                      {method.info}
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      {method.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-12 lg:py-16 bg-gray-50">
          <div className="max-w-2xl mx-auto px-4">
            <div className={`transition-all duration-1000 delay-600 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div className="text-center mb-8">
                <h2 className="text-2xl lg:text-3xl font-light text-black mb-4">
                  Send Us a Message
                </h2>
                <p className="text-gray-600">
                  Fill out the form below and we'll get back to you soon
                </p>
              </div>

              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                  <p className="font-medium">Message sent successfully!</p>
                  <p className="text-sm">We'll get back to you as soon as possible.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 lg:p-8 rounded-2xl border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="What is this regarding?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                    placeholder="Tell us more..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
