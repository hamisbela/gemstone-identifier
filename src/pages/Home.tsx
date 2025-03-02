import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Upload, Gem, Loader2 } from 'lucide-react';
import { analyzeImage } from '../lib/gemini';
import SupportBlock from '../components/SupportBlock';

// Default gemstone image path
const DEFAULT_IMAGE = "/default-gemstone.jpg";

// Default analysis for the gemstone
const DEFAULT_ANALYSIS = `1. Gemstone Identification:
- Name: Amethyst
- Type: Variety of Quartz (SiO2)
- Color Range: Pale lilac to deep purple
- Crystal System: Hexagonal (trigonal)
- Transparency: Transparent to translucent
- Primary Sources: Brazil, Uruguay, Zambia, Russia, South Korea

2. Physical Properties:
- Hardness: 7 on Mohs scale
- Specific Gravity: 2.65-2.66
- Luster: Vitreous (glass-like)
- Cleavage: None (conchoidal fracture)
- Refractive Index: 1.544-1.553
- Characteristic Features: Color zoning, pleochroism (different colors when viewed from different angles)

3. Formation & Geology:
- Origin: Forms in silica-rich geodes and volcanic rocks
- Formation Process: Crystallizes from silicon dioxide with iron impurities and radiation exposure
- Geological Age: Found in rocks of various ages, particularly volcanic and metamorphic
- Associated Minerals: Often found with citrine, clear quartz, and agate
- Environmental Conditions: Forms in gas cavities in lava, hydrothermal veins, or metamorphic deposits

4. Value & Collection:
- Value Factors: Color intensity (deep purple most valuable), clarity, size, and cut
- Commercial Grade: AA (high quality) to B (lower quality)
- Common Treatments: Heat treatment to enhance color (often changes to citrine when heated)
- Care Requirements: Avoid prolonged sun exposure, clean with mild soap and water
- Popular Cuts: Faceted, cabochon, beads, and tumbled stones

5. Cultural & Metaphysical Aspects:
- Historical Significance: Named from Greek "amethystos" meaning "not intoxicated" (believed to prevent drunkenness)
- Traditional Uses: Jewelry, protective amulets, religious artifacts
- Birthstone: February
- Chakra Association: Third eye and crown chakras in crystal healing practices
- Cultural Beliefs: Associated with clarity of thought, peace, and protection`;

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load default image and analysis without API call
    const loadDefaultContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(DEFAULT_IMAGE);
        if (!response.ok) {
          throw new Error('Failed to load default image');
        }
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          setImage(base64data);
          setAnalysis(DEFAULT_ANALYSIS);
          setLoading(false);
        };
        reader.onerror = () => {
          setError('Failed to load default image');
          setLoading(false);
        };
        reader.readAsDataURL(blob);
      } catch (err) {
        console.error('Error loading default image:', err);
        setError('Failed to load default image');
        setLoading(false);
      }
    };

    loadDefaultContent();
  }, []);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setError('Image size should be less than 20MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImage(base64String);
      setError(null);
      handleAnalyze(base64String);
    };
    reader.onerror = () => {
      setError('Failed to read the image file. Please try again.');
    };
    reader.readAsDataURL(file);

    // Reset the file input so the same file can be selected again
    e.target.value = '';
  }, []);

  const handleAnalyze = async (imageData: string) => {
    setLoading(true);
    setError(null);
    const gemstonePrompt = "Analyze this gemstone image for educational purposes and provide the following information:\n1. Gemstone identification (name, type, color range, crystal system, transparency, primary sources)\n2. Physical properties (hardness on Mohs scale, specific gravity, luster, cleavage, refractive index, characteristic features)\n3. Formation and geology (origin, formation process, geological age, associated minerals, environmental conditions)\n4. Value and collection (value factors, commercial grade, common treatments, care requirements, popular cuts)\n5. Cultural and metaphysical aspects (historical significance, traditional uses, birthstone information, cultural associations)\n\nIMPORTANT: This is for educational purposes only.";
    try {
      const result = await analyzeImage(imageData, gemstonePrompt);
      setAnalysis(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze image. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const formatAnalysis = (text: string) => {
    return text.split('\n').map((line, index) => {
      // Remove any markdown-style formatting
      const cleanLine = line.replace(/[*_#`]/g, '').trim();
      if (!cleanLine) return null;

      // Format section headers (lines starting with numbers)
      if (/^\d+\./.test(cleanLine)) {
        return (
          <div key={index} className="mt-8 first:mt-0">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {cleanLine.replace(/^\d+\.\s*/, '')}
            </h3>
          </div>
        );
      }
      
      // Format list items with specific properties
      if (cleanLine.startsWith('-') && cleanLine.includes(':')) {
        const [label, ...valueParts] = cleanLine.substring(1).split(':');
        const value = valueParts.join(':').trim();
        return (
          <div key={index} className="flex gap-2 mb-3 ml-4">
            <span className="font-semibold text-gray-800 min-w-[120px]">{label.trim()}:</span>
            <span className="text-gray-700">{value}</span>
          </div>
        );
      }
      
      // Format regular list items
      if (cleanLine.startsWith('-')) {
        return (
          <div key={index} className="flex gap-2 mb-3 ml-4">
            <span className="text-gray-400">•</span>
            <span className="text-gray-700">{cleanLine.substring(1).trim()}</span>
          </div>
        );
      }

      // Regular text
      return (
        <p key={index} className="mb-3 text-gray-700">
          {cleanLine}
        </p>
      );
    }).filter(Boolean);
  };

  return (
    <div className="bg-gray-50 py-6 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Free Gemstone Identifier</h1>
          <p className="text-base sm:text-lg text-gray-600">Upload a gemstone photo for educational mineralogy identification and crystal information</p>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-12">
          <div className="flex flex-col items-center justify-center mb-6">
            <label 
              htmlFor="image-upload"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer w-full sm:w-auto"
            >
              <Upload className="h-5 w-5" />
              Upload Gemstone Photo
              <input
                ref={fileInputRef}
                id="image-upload"
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                onChange={handleImageUpload}
              />
            </label>
            <p className="mt-2 text-sm text-gray-500">PNG, JPG, JPEG or WEBP (MAX. 20MB)</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 rounded-md">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {loading && !image && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
              <span className="ml-2 text-gray-600">Loading...</span>
            </div>
          )}

          {image && (
            <div className="mb-6">
              <div className="relative rounded-lg mb-4 overflow-hidden bg-gray-100">
                <img
                  src={image}
                  alt="Gemstone preview"
                  className="w-full h-auto max-h-[500px] object-contain mx-auto"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleAnalyze(image)}
                  disabled={loading}
                  className="flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Gem className="-ml-1 mr-2 h-5 w-5" />
                      Identify Gemstone
                    </>
                  )}
                </button>
                <button
                  onClick={triggerFileInput}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Another Photo
                </button>
              </div>
            </div>
          )}

          {analysis && (
            <div className="bg-gray-50 rounded-lg p-6 sm:p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Gemstone Analysis Results</h2>
              <div className="text-gray-700">
                {formatAnalysis(analysis)}
              </div>
            </div>
          )}
        </div>

        <SupportBlock />

        <div className="prose max-w-none my-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">Free Gemstone Identifier: Your Educational Guide to Mineralogy</h2>
          
          <p>Welcome to our free gemstone identifier tool, powered by advanced artificial intelligence technology.
             This educational tool helps you learn about different precious and semi-precious stones,
             providing essential information about physical properties, formation, and cultural significance.</p>

          <h3>How Our Educational Gemstone Identifier Works</h3>
          <p>Our tool uses AI to analyze gemstone photos and provide educational information about mineral
             identification, physical properties, and geological context. Simply upload a clear photo of a gemstone,
             and our AI will help you learn about its composition and characteristics.</p>

          <h3>Key Features of Our Gemstone Identifier</h3>
          <ul>
            <li>Educational mineralogy information</li>
            <li>Detailed physical property analysis</li>
            <li>Geological formation and origin details</li>
            <li>Value and collection guidelines</li>
            <li>Cultural and historical significance</li>
            <li>100% free to use</li>
          </ul>

          <h3>Perfect For Learning About:</h3>
          <ul>
            <li>Precious and semi-precious stones</li>
            <li>Crystal structures and properties</li>
            <li>Geological formation processes</li>
            <li>Gemstone value and quality factors</li>
            <li>Cultural significance of minerals and crystals</li>
          </ul>

          <p>Try our free gemstone identifier today and expand your knowledge of mineralogy!
             No registration required - just upload a photo and start learning about fascinating gemstones from around the world.</p>
        </div>

        <SupportBlock />
      </div>
    </div>
  );
}