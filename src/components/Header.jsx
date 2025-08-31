import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from './logo.jpeg'; 
import { Menu, X, Languages } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTranslatorActive, setIsTranslatorActive] = useState(false);

  useEffect(() => {
    // Load Google Translate script
    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.head.appendChild(script);

    // Initialize Google Translate
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement({
        pageLanguage: 'en',
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false,
      }, 'google_translate_element');
    };

    return () => {
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const toggleTranslator = () => {
    setIsTranslatorActive(!isTranslatorActive);
    if (!isTranslatorActive) {
      // Show translator
      const translateElement = document.getElementById('google_translate_element');
      if (translateElement) {
        translateElement.style.display = 'block';
      }
    } else {
      // Hide translator
      const translateElement = document.getElementById('google_translate_element');
      if (translateElement) {
        translateElement.style.display = 'none';
      }
    }
  };

  return (
    <header className="bg-pink-200 py-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Diabetopedia Logo" className="h-12 w-12 rounded-full object-cover" />
          <h1 className="text-2xl md:text-3xl font-extrabold italic font-serif text-gray-800">
            Maa Suvidha
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-4 items-center">
          <Link to="/" className="bg-pink-400 px-4 py-2 rounded-full text-white hover:bg-pink-500">
            Home
          </Link>
          <Link to="/categories" className="bg-pink-400 px-4 py-2 rounded-full text-white hover:bg-pink-500">
            Categories
          </Link>
          <a 
            href="https://growthchartonline.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-purple-500 px-4 py-2 rounded-full text-white hover:bg-purple-600 transition-colors"
          >
            Growth Chart
          </a>
          <button 
            onClick={toggleTranslator}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
              isTranslatorActive 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            <Languages size={18} />
            <span>{isTranslatorActive ? 'Hide Translator' : 'Translate'}</span>
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden flex items-center" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Google Translate Element */}
      <div 
        id="google_translate_element" 
        className="container mx-auto mt-2"
        style={{ display: 'none' }}
      ></div>

      {/* Mobile Navigation */}
      {isOpen && (
        <nav className="md:hidden bg-pink-300 mt-2 p-4 rounded-lg">
          <ul className="flex flex-col space-y-2">
            <li>
              <Link to="/" className="block text-gray-900 hover:bg-pink-500 px-4 py-2 rounded-md">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="block text-gray-900 hover:bg-pink-500 px-4 py-2 rounded-md">
                About
              </Link>
            </li>
            <li>
              <a 
                href="https://growthchartonline.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-gray-900 hover:bg-purple-500 hover:text-white px-4 py-2 rounded-md transition-colors"
              >
                Growth Chart
              </a>
            </li>
            <li>
              <button 
                onClick={toggleTranslator}
                className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  isTranslatorActive 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                <Languages size={18} />
                <span>{isTranslatorActive ? 'Hide Translator' : 'Translate'}</span>
              </button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
