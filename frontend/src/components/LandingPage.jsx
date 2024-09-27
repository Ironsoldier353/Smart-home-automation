import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.webp';
const LandingPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
 
      <header className="flex justify-between items-center px-4 py-4 bg-black bg-opacity-60">
     
        <div className="flex items-center space-x-4">
        <img src={logo} alt="LumenHive Logo" className="h-10" />
          <span className="font-bold text-xl md:text-2xl">LumenHive</span>
        </div>

    
        <nav className="hidden md:flex space-x-8">
          <button onClick={() => scrollToSection('features')} className="text-gray-300 hover:text-white">
            FEATURES
          </button>
          <button onClick={() => scrollToSection('aim')} className="text-gray-300 hover:text-white">
            AIM
          </button>
        </nav>

        <div className="flex items-center space-x-4">
          <Link to="/signin" className="text-gray-300 hover:text-white text-sm md:text-lg">Sign In</Link>
          <Link to="/signup" className="bg-purple-500 text-white text-sm md:text-lg px-4 py-2 rounded-lg hover:bg-purple-400 transition">
            Sign Up
          </Link>
        </div>
      </header>

      
      <section className="flex flex-col items-center justify-center text-center px-6 py-20 md:py-32 bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-600">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
          Revolutionize Your Home with <span className="text-pink-400">Smart Automation</span>
        </h1>
        <p className="text-base md:text-lg mb-8 max-w-2xl">
          Control every aspect of your home, from smart door locks to recipe suggestions based on calories, powered by ESP32 and PCB technology.
        </p>
        <Link to="/get-started" className="bg-white text-black font-bold py-2 px-6 rounded-lg hover:bg-gray-200">
          Get Started
        </Link>
      </section>

      
      <section id="aim" className="py-16 md:py-24 bg-gray-800 text-center px-6">
        <h2 className="text-2xl md:text-4xl font-bold mb-6">Our Aim</h2>
        <p className="text-sm md:text-lg mb-4 max-w-4xl mx-auto">
          The goal of our Smart Home Automation project is to enhance the quality of life by simplifying home management tasks. We aim to provide a seamless integration of technology and daily living, allowing users to manage their homes with ease and efficiency.
        </p>
        <p className="text-sm md:text-lg max-w-4xl mx-auto">
          Utilizing cutting-edge technologies such as ESP32, IoT, and custom PCB design, we strive to create solutions that are not only innovative but also accessible to everyone. Our focus is on improving safety, convenience, and personalization in every home.
        </p>
      </section>

      <section id="features" className="py-16 md:py-24 bg-gray-900 text-center px-6">
        <h2 className="text-2xl md:text-4xl font-bold mb-12">Smart Home Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
       
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6 md:p-8 rounded-lg shadow-lg">
            <h3 className="text-lg md:text-xl font-semibold mb-4">Smart Door Lock/Unlock</h3>
            <p className="text-sm md:text-base">
              Control the security of your home remotely with our smart door lock system powered by ESP32. Manage access with ease through your smartphone and enhance your home’s security.
            </p>
          </div>
   
          <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6 md:p-8 rounded-lg shadow-lg">
            <h3 className="text-lg md:text-xl font-semibold mb-4">Recipe Suggestor Based on Calories</h3>
            <p className="text-sm md:text-base">
              Manage your diet with ease. Our smart home automation system suggests recipes based on your calorie needs, helping you maintain a balanced diet effortlessly.
            </p>
          </div>
   
          <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 md:p-8 rounded-lg shadow-lg">
            <h3 className="text-lg md:text-xl font-semibold mb-4">Smart Energy Management</h3>
            <p className="text-sm md:text-base">
              Monitor and control your home’s energy consumption through smart plugs and sensors, ensuring efficiency and reducing electricity bills.
            </p>
          </div>
   
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 md:p-8 rounded-lg shadow-lg">
            <h3 className="text-lg md:text-xl font-semibold mb-4">Home Environment Monitoring</h3>
            <p className="text-sm md:text-base">
              Keep track of your home's air quality, temperature, and humidity with sensors that notify you when adjustments are needed for a healthier living space.
            </p>
          </div>
    
          <div className="bg-gradient-to-r from-yellow-500 to-green-500 p-6 md:p-8 rounded-lg shadow-lg">
            <h3 className="text-lg md:text-xl font-semibold mb-4">Automated Lighting Control</h3>
            <p className="text-sm md:text-base">
              Automate your home lighting based on occupancy or time of day, enhancing convenience and saving energy.
            </p>
          </div>
    
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 md:p-8 rounded-lg shadow-lg">
            <h3 className="text-lg md:text-xl font-semibold mb-4">Voice-Activated Home Assistant</h3>
            <p className="text-sm md:text-base">
              Integrate voice-activated technology to control various devices in your home, making your living experience more interactive and enjoyable.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
