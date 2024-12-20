import React from 'react';

const SetupRoom = () => {
  const handleSignUpClick = () => {
    window.location.href = '/signup';  // Redirect to the Sign Up page
  };

  const handleLoginClick = () => {
    window.location.href = '/login';   // Redirect to the Login page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-opacity-75">
      <div className="bg-white shadow-xl rounded-lg p-8 w-96 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome!</h1>
        <p className="text-gray-600 mb-6">Choose your action below to proceed:</p>
        <div className="flex flex-col space-y-4">
          <button 
            onClick={handleSignUpClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded transition-transform transform hover:scale-105">
            Sign Up
          </button>
          <button 
            onClick={handleLoginClick}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded transition-transform transform hover:scale-105">
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetupRoom;
