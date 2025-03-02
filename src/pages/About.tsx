import React from 'react';

export default function About() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">About Us</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-8 prose max-w-none">
          <p>
            Welcome to Free Gemstone Identifier, your educational resource for AI-powered mineralogy and gemstone identification.
            We're passionate about helping people learn about the fascinating world of crystals and precious stones through
            technology, while promoting understanding and appreciation of earth's geological treasures.
          </p>

          <h2>Our Mission</h2>
          <p>
            Our mission is to make mineralogy education accessible to everyone by providing a free, easy-to-use
            gemstone identification tool. We aim to foster appreciation for gemstones while helping
            people learn about their properties, formation, and cultural significance. Our tool is designed for educational
            purposes only, helping collectors, jewelry enthusiasts, geology students, and curious minds learn about different
            gemstones from around the world.
          </p>

          <h2>Why Choose Our Tool?</h2>
          <ul>
            <li>Advanced AI gemstone recognition technology</li>
            <li>Detailed mineralogical information</li>
            <li>Educational insights about crystal structures and properties</li>
            <li>Geological formation context</li>
            <li>Value assessment and collection guidelines</li>
            <li>Completely free to use</li>
            <li>No registration required</li>
            <li>Privacy-focused approach</li>
            <li>Regular updates to improve accuracy</li>
          </ul>

          <h2>Support Our Project</h2>
          <p>
            We're committed to keeping this gemstone identification tool free and accessible to everyone.
            If you find our educational tool useful, consider supporting us by buying us a coffee.
            Your support helps us maintain and improve the service, ensuring it remains available to all
            mineralogy enthusiasts who want to learn about gemstone identification and information.
          </p>

          <div className="mt-8 text-center">
            <a
              href="https://roihacks.gumroad.com/l/dselxe?utm_campaign=donation-home-page&utm_medium=website&utm_source=gemstone-identifier"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors text-lg font-semibold"
            >
              Support Our Work
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}