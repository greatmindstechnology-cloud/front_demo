// src/components/BookCard.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BookCard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const { id, title, author, price, imageUrl } = state || {};
  const [isProcessing, setIsProcessing] = useState(false);

  if (!state) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-red-200">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Course Data Available</h3>
            <p className="text-gray-600 mb-4">Please go back and enroll again to view course details.</p>
            <button
              onClick={() => navigate(-1)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    navigate(-1);
  };

  const handlePayOnline = async () => {
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      console.log("Processing online payment for:", title);
    }, 2000);
  };

  const handlePayOffline = () => {
    console.log("Processing offline payment for:", title);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Navigation */}
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 group"
          >
            <div className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center mr-3 group-hover:shadow-lg transition-shadow duration-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <span className="hidden sm:inline">Back to Courses</span>
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-indigo-700/90"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
            <div className="relative z-10">
              <h1 className="text-white text-2xl sm:text-3xl font-bold mb-2">Course Enrollment</h1>
              <p className="text-blue-100 text-sm sm:text-base">Complete your purchase to access premium content</p>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 sm:p-8">
            {/* Course Details */}
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mb-8">
              {/* Image Section */}
              <div className="flex-shrink-0 mx-auto lg:mx-0">
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                  <img 
                    src={imageUrl} 
                    alt={title} 
                    className="relative w-48 h-64 sm:w-56 sm:h-72 lg:w-48 lg:h-64 xl:w-56 xl:h-72 rounded-xl object-cover shadow-xl border-2 border-white" 
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Details Section */}
              <div className="flex-grow text-center lg:text-left">
                <div className="mb-6">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                    {title}
                  </h2>
                  <div className="flex items-center justify-center lg:justify-start mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Instructor</p>
                      <p className="font-semibold text-gray-800 text-lg">{author}</p>
                    </div>
                  </div>

                  {/* Price Section */}
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-4 sm:p-6 border border-red-100 mb-6">
                    <div className="flex items-center justify-center lg:justify-start">
                      <div className="text-center lg:text-left">
                        <p className="text-sm text-gray-600 mb-1">Course Price</p>
                        <div className="flex items-baseline">
                          <span className="text-3xl sm:text-4xl font-bold text-red-600">₹{price.toFixed(2)}</span>
                          <span className="text-sm text-gray-500 ml-2">One-time payment</span>
                        </div>
                        <div className="flex items-center mt-2 text-green-600 text-sm">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Lifetime Access</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  {[
                    { icon: "🎓", text: "Certificate" },
                    { icon: "📱", text: "Mobile Access" },
                    { icon: "⏰", text: "Lifetime" },
                  ].map((feature, index) => (
                    <div key={index} className="bg-blue-50 rounded-xl p-3 text-center">
                      <div className="text-2xl mb-1">{feature.icon}</div>
                      <p className="text-sm font-medium text-blue-800">{feature.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Choose Your Payment Method</h3>
              
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {/* Online Payment */}
                <button
                  onClick={handlePayOnline}
                  disabled={isProcessing}
                  className="relative group bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-6 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-center mb-3">
                      {isProcessing ? (
                        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <h4 className="font-bold text-lg mb-2">Pay Online</h4>
                    <p className="text-sm text-blue-100 mb-3">Instant access via UPI, Cards & Wallets</p>
                    <div className="flex items-center justify-center text-xs">
                      <span className="bg-green-500 text-white px-2 py-1 rounded-full mr-2">⚡ Instant</span>
                      <span>Secure Payment</span>
                    </div>
                  </div>
                </button>

                {/* Offline Payment */}
                <button
                  onClick={handlePayOffline}
                  className="group bg-white border-2 border-gray-200 text-gray-700 rounded-2xl p-6 hover:border-blue-300 hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-12 h-12 bg-gray-100 group-hover:bg-blue-100 rounded-full flex items-center justify-center transition-colors duration-300">
                      <svg className="w-6 h-6 text-gray-600 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>
                  <h4 className="font-bold text-lg mb-2 group-hover:text-blue-800">Pay Offline</h4>
                  <p className="text-sm text-gray-600 group-hover:text-blue-600 mb-3">Bank transfer or visit our center</p>
                  <div className="flex items-center justify-center text-xs">
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded-full mr-2">📍 Manual</span>
                    <span>Flexible Options</span>
                  </div>
                </button>
              </div>

              {/* Additional Info */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center justify-center text-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-blue-800">💡 Pro Tip</p>
                    <p className="text-blue-600">Online payments get instant course access and exclusive bonuses!</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center mt-6 text-sm text-gray-500">
              <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Secured by 256-bit SSL encryption
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;