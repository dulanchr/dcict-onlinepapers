'use client';

import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

export default function ContactForm() {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    studentEmail: '',
    grade: '',
    schoolName: '',
    classType: '',
    additionalInfo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const grades = [
    'Grade 6',
    'Grade 7',
    'Grade 8',
    'Grade 9',
    'Grade 10',
    'Grade 11'
  ];

  const classTypes = [
    'Home Visit',
    'Group Class',
    'Online Class'
  ];

  const schools = [
    'Royal College',
    'Ananda College',
    'Nalanda College',
    'Visakha Vidyalaya',
    'Ladies College',
    'Musaeus College',
    'S. Thomas College',
    'Trinity College',
    'Colombo International School',
    'Gateway College',
    'Other'
  ].sort();

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
    setSubmitStatus(null);

    try {
      // EmailJS configuration
      const serviceId = 'service_1liki5n';
      const templateId = 'template_ofhhn2k';
      const publicKey = 'fNy1eJpCdOoBM0Z48';

      // Prepare template parameters
      const templateParams = {
        to_email: 'ictdulanchathuranga@gmail.com',
        from_name: formData.studentName,
        from_email: formData.studentEmail,
        student_name: formData.studentName,
        student_email: formData.studentEmail,
        grade: formData.grade,
        school_name: formData.schoolName,
        class_type: formData.classType,
        additional_info: formData.additionalInfo || 'No additional information provided',
        message: `
New Student Inquiry

Student Name: ${formData.studentName}
Email: ${formData.studentEmail}
Grade: ${formData.grade}
School: ${formData.schoolName}
Class Type: ${formData.classType}

Additional Information:
${formData.additionalInfo || 'None'}
        `
      };

      // Send email
      await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      );

      setSubmitStatus('success');
      setFormData({
        studentName: '',
        studentEmail: '',
        grade: '',
        schoolName: '',
        classType: '',
        additionalInfo: ''
      });

      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      console.error('Email send error:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Status Messages */}
      {submitStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-sm text-green-800">
          <p className="font-medium">Message sent successfully!</p>
          <p className="text-sm">We'll get back to you as soon as possible.</p>
        </div>
      )}
      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-sm text-red-800">
          <p className="font-medium">Failed to send message.</p>
          <p className="text-sm">Please try again or contact us directly.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Student Name */}
        <div>
          <label htmlFor="studentName" className="block text-sm font-medium text-black mb-2">
            Student Name *
          </label>
          <input
            type="text"
            id="studentName"
            name="studentName"
            required
            value={formData.studentName}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-black text-black"
            placeholder="Enter student name"
          />
        </div>

        {/* Student Email */}
        <div>
          <label htmlFor="studentEmail" className="block text-sm font-medium text-black mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="studentEmail"
            name="studentEmail"
            required
            value={formData.studentEmail}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-black text-black"
            placeholder="your.email@example.com"
          />
        </div>

        {/* Grade Selection - Card Style */}
        <div>
          <label className="block text-sm font-medium text-black mb-3">
            Grade *
          </label>
          <div className="grid grid-cols-3 gap-3">
            {grades.map((grade) => (
              <button
                key={grade}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, grade }))}
                className={`p-3 border rounded-sm text-sm transition-all duration-300 ${
                  formData.grade === grade
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-gray-300 hover:bg-gray-50'
                }`}
              >
                {grade}
              </button>
            ))}
          </div>
        </div>

        {/* School Name */}
        <div>
          <label htmlFor="schoolName" className="block text-sm font-medium text-black mb-2">
            School Name *
          </label>
          <select
            id="schoolName"
            name="schoolName"
            required
            value={formData.schoolName}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-black text-black bg-white"
          >
            <option value="">Select school</option>
            {schools.map((school) => (
              <option key={school} value={school}>
                {school}
              </option>
            ))}
          </select>
        </div>

        {/* Class Type - Card Style */}
        <div>
          <label className="block text-sm font-medium text-black mb-3">
            Class Type *
          </label>
          <div className="grid grid-cols-3 gap-3">
            {classTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, classType: type }))}
                className={`p-3 border rounded-sm text-sm transition-all duration-300 ${
                  formData.classType === type
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-gray-300 hover:bg-gray-50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Additional Information */}
        <div>
          <label htmlFor="additionalInfo" className="block text-sm font-medium text-black mb-2">
            Additional Information <span className="text-gray-400">(Optional)</span>
          </label>
          <textarea
            id="additionalInfo"
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-black text-black resize-none"
            placeholder="Any other questions or information..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white px-6 py-3 rounded-sm hover:bg-gray-800 transition-colors duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}
