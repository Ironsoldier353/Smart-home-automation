import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa'; // Importing the cart icon from react-icons
import logo from '../assets/logo.webp';
import bgImage2 from '../assets/bg-image-2.jpg'; // New background image

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
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 flex justify-between items-center px-4 py-4 bg-black bg-opacity-70 backdrop-filter backdrop-blur-lg shadow-lg transition-all duration-300">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="LumenHive Logo" className="h-10" />
          <span className="font-bold text-xl md:text-2xl">LumenHive</span>
        </div>
        <nav className="hidden md:flex space-x-8">
          <button onClick={() => scrollToSection('features')} className="text-gray-300 hover:text-white hover:underline transition-all duration-200 underline-offset-4">
            FEATURES
          </button>
          <button onClick={() => scrollToSection('aim')} className="text-gray-300 hover:text-white hover:underline transition-all duration-200 underline-offset-4">
            AIM
          </button>
        </nav>
        <div className="flex items-center space-x-4">
          <Link
            to="/shop"
            className="bg-purple-500 text-white flex items-center space-x-2 text-sm md:text-lg px-4 py-2 rounded-lg hover:bg-purple-400 transition shadow-lg hover:shadow-xl"
          >
            <FaShoppingCart className="text-lg" />
            <span>Shop</span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="relative flex flex-col items-center justify-center text-center px-6 py-20 md:py-32 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${bgImage2})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <h1 className="text-3xl md:text-5xl font-extrabold mb-10 text-white">
          Revolutionize Your Home with <span className="text-pink-400">Smart Automation</span>
        </h1>

        <p className="text-xl md:text-2xl mb-8 max-w-2xl text-gray-200 font-light leading-relaxed tracking-wide float-in">
          <span className="font-semibold text-white">Effortlessly control your home</span>—from smart locks to personalized recipes based on your goals. 
          Powered by <span className="text-pink-400 font-semibold">ESP32</span>, our system brings simplicity and convenience to your daily life.
        </p>

        <div className="flex space-x-4">
          <Link
            to="/find-room"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-opacity-90 transition-transform transform hover:scale-105 shadow-lg"
          >
            Find Room
          </Link>
          <Link
            to="/setup-room"
            className="bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-opacity-90 transition-transform transform hover:scale-105 shadow-lg"
          >
            Setup Room
          </Link>
        </div>
      </section>

      {/* Aim Section */}
      <section id="aim" className="py-16 md:py-24 bg-gray-800 text-center px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-6">
            Our Vision & Mission
          </h2>
          <p className="text-md md:text-lg text-gray-300 leading-relaxed">
            At <span className="text-purple-400 font-semibold">LumenHive</span>, we envision a future where technology seamlessly integrates with daily life, simplifying tasks and elevating comfort. Our Smart Home Automation project is designed to enhance every household’s quality of life, empowering users to manage their homes effortlessly.
          </p>
          <p className="text-md md:text-lg text-gray-300 leading-relaxed">
            By harnessing the power of <span className="text-indigo-400 font-semibold">ESP32</span>, <span className="text-green-400 font-semibold">IoT</span>, and custom PCB design, we aim to create intuitive, accessible, and sustainable solutions. Our focus is on boosting safety, convenience, and personalization to transform houses into smart, responsive homes.
          </p>
        </div>

        {/* Call-to-Action */}
        <div className="mt-12">
          <Link
            to="/learn-more"
            className="inline-block bg-purple-600 hover:bg-purple-500 text-white text-lg font-semibold px-8 py-3 rounded-full transition-transform transform hover:scale-105 shadow-lg"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-gray-900 text-center px-6">
        <h2 className="text-2xl md:text-4xl font-bold mb-12">Smart Home Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {[
            { title: "Smart recognition at door", colorFrom: "from-purple-500", colorTo: "to-indigo-500", description: "Control the security of your home remotely with our smart door lock system powered by ESP32." },
            { title: "Smart Cooking Assistant", colorFrom: "from-green-500", colorTo: "to-teal-500", description: "Manage your diet with ease. Our smart home automation system suggests recipes based on your calorie needs." },
            { title: "Energy Usage Breakdown", colorFrom: "from-red-500", colorTo: "to-orange-500", description: "Monitor and control your home’s energy consumption through smart plugs and sensors." },
            { title: "Smart Water Dispenser", colorFrom: "from-blue-500", colorTo: "to-purple-500", description: "The Smart Water Dispenser uses an IR sensor to dispense water automatically for hygiene and convenience." },
            { title: "Control appliances remotely", colorFrom: "from-yellow-500", colorTo: "to-green-500", description: "Remotely manage your home appliances from anywhere." },
            { title: "Voice-Activated Home Assistant", colorFrom: "from-purple-600", colorTo: "to-indigo-600", description: "Integrate voice-activated technology to control various devices in your home." }
          ].map((feature, index) => (
            <div
              key={index}
              className={`bg-gradient-to-r ${feature.colorFrom} ${feature.colorTo} p-6 md:p-8 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105`}
            >
              <h3 className="text-lg md:text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-sm md:text-base text-gray-200">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
