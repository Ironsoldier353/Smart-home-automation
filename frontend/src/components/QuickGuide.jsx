import { useState } from "react";
import Modal from "react-modal";
import s1 from "../assets/images/feature1.png";

Modal.setAppElement("#root");

const QuickGuide = () => {
  const sections = [
    {
        title: "Installation",
        description: "Learn how to install this in your room quickly and easily.",
        images: [
          { src: s1, description: "Register screen" },
          { src: s1, description: "Login screen" },
          { src: s1, description: "" },
        ],
      },
    {
        title: "Register as Admin",
        description: "Learn how to register or log in to your account quickly and easily.",
        images: [
          { src: s1, description: "Register screen" },
          { src: s1, description: "Login screen" },
          { src: s1, description: "" },
        ],
      },
    {
      title: "Add Member",
      description: "Learn how to add new member into your account quickly and easily.",
      images: [
        { src: s1, description: "Add member screen" },
        { src: s1, description: "Member profile" },
        { src: s1, description: "" },
      ],
    },
    {
        title: "Register as Member",
        description: "Learn how to register or log in to your account quickly and easily.",
        images: [
          { src: s1, description: "Register screen" },
          { src: s1, description: "Login screen" },
          { src: s1, description: "" },
        ],
      },
    {
        title: "Add Device",
        description: "Learn how to add new PCB in your room.",
        images: [
          { src: s1, description: "" },
          { src: s1, description: "" },
        ],
      },
    {
      title: "Shop",
      description: "Explore the shop and discover amazing deals and features we offer.",
      images: [
        { src: s1, description: "Shop homepage" },
        { src: s1, description: "Product listing" },
        { src: s1, description: "" },
      ],
    },
    {
        title: "Membership",
        description: "",
        images: [
          { src: s1, description: "" },
          { src: s1, description: "" },
          { src: s1, description: "" },
        ],
      },
  ];

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openModal = (section) => {
    setCurrentSection(section);
    setCurrentImageIndex(0); // Reset image index when opening modal
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentSection(null);
  };

  const handleSwipe = (direction) => {
    if (direction === "left") {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? currentSection.images.length - 1 : prevIndex - 1
      );
    } else if (direction === "right") {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === currentSection.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  return (
    <div className="bg-gray-900 py-12 px-8 text-white w-full min-h-screen flex flex-col items-center">
  <h1 className="text-5xl font-bold text-center mb-12 text-green-400 animate__animated animate__fadeIn">
    Quick Guide
  </h1>
  <div className="space-y-12 w-full flex-grow">
    {sections.map((section, index) => (
      <div
        key={index}
        className={`flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-6 ${
          index % 2 === 0 ? "" : "sm:flex-row-reverse"
        }`}
      >
        <img
          src={section.images[0].src}
          alt={section.title}
          className="w-full sm:w-1/2 rounded-lg shadow-lg cursor-pointer transform transition-transform duration-500 hover:scale-110"
          onClick={() => openModal(section)}
        />
        <div className="w-full sm:w-1/2">
          <h2 className="text-3xl font-semibold mb-4 text-cyan-400">{section.title}</h2>
          <p className="text-gray-400">{section.description}</p>
          <button
            className="mt-6 bg-green-500 text-black py-2 px-6 rounded-lg hover:bg-green-600 shadow-md transform hover:scale-110 transition-transform duration-300"
            onClick={() => openModal(section)}
          >
            Learn More
          </button>
        </div>
      </div>
    ))}
  </div>

  {/* Modal */}
  {currentSection && (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      className="max-w-full sm:max-w-4xl w-[90%] sm:w-auto bg-gray-900 rounded-lg shadow-lg mx-auto p-6 sm:p-8 transform transition-transform duration-500 ease-in-out scale-100"
      overlayClassName="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center transition-opacity duration-300"
    >
      <div className="relative">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 bg-red-700 text-white p-3 rounded-full hover:bg-red-900 shadow-md transform hover:scale-110 transition-transform duration-300 z-10"
        >
          X
        </button>

        <h2 className="text-4xl font-bold mb-4 text-center text-green-400 animate__animated animate__fadeIn">
          {currentSection.title}
        </h2>
        <p className="text-gray-400 mb-6 text-center sm:text-left">
          {currentSection.description}
        </p>

        {/* Image Gallery */}
        <div className="flex justify-between items-center mb-4 w-full px-4">
          <button
            className="text-white text-4xl sm:text-5xl hover:text-green-500"
            onClick={() => handleSwipe("left")}
            style={{ zIndex: 130 }}
          >
            &#10094;
          </button>

          <div className="flex flex-col items-center">
            <img
              src={currentSection.images[currentImageIndex].src}
              alt={`Image ${currentImageIndex + 1}`}
              className="w-full max-w-xs sm:max-w-md h-auto object-cover rounded-lg transform transition-all duration-500 animate__animated animate__fadeIn"
            />
            {currentSection.images[currentImageIndex].description && (
              <p className="mt-4 text-gray-400 text-center">
                {currentSection.images[currentImageIndex].description}
              </p>
            )}
          </div>

          <button
            className="text-white text-4xl sm:text-5xl hover:text-green-500"
            onClick={() => handleSwipe("right")}
            style={{ zIndex: 10 }}
          >
            &#10095;
          </button>
        </div>

        {/* Image Indicator */}
        <div className="flex space-x-2 mt-2 justify-center">
          {currentSection.images.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentImageIndex
                  ? "bg-green-500 animate__animated animate__pulse animate__infinite"
                  : "bg-gray-500"
              }`}
            ></div>
          ))}
        </div>
      </div>
    </Modal>
  )}
</div>
  );
};

export default QuickGuide;
