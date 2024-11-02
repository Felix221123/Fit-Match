import React, { useState, useEffect } from 'react';
import { OpenAI } from 'openai';
import "../Styles/styles.css"
import ClothingData from '../data.json';

interface ImageAnalyzerProps {
  imageUrl: string;
}

interface ClothingItem {
  id: number;
  name: string;
  category: string;
  colour: string; // Using "colour" as per JSON data
  pattern: string;
  gender: string;
  size: (string | number)[]; // Adjusting to handle both strings and numbers
  image_url: string;
  item_link?: string;
}

interface ClothingAttributes {
  category: string;
  color: string;
  name?: string;
  pattern: string;
  event?: string;
  outfitStyle?: string;
  gender?: string;
  size?: string | number;
}

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});



const ImageAnalyzer: React.FC<ImageAnalyzerProps> = ({ imageUrl }) => {
  const [attributes, setAttributes] = useState<ClothingAttributes | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [similarItems, setSimilarItems] = useState<ClothingItem[]>([]);

  // State for user answers to additional questions
  const [event, setEvent] = useState<string>('');
  const [outfitStyle, setOutfitStyle] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [size, setSize] = useState<string | number>('');

  const findSimilarItems = (attributes: ClothingAttributes | null) => {
    if (!attributes) {
      console.error('No attributes provided');
      return;
    }

    // Helper function to perform keyword-based matching
    const keywordMatch = (itemValue: string, attrValue: string) => {
      const itemWords = itemValue.toLowerCase().split(" ");
      const attrWords = attrValue.toLowerCase().split(" ");
      return attrWords.some(word => itemWords.includes(word));
    };

    const recommendedItems = ClothingData.filter((item) => {
      const categoryMatch = attributes.category
        ? keywordMatch(item.category, attributes.category)
        : false;

      const colorMatch = attributes.color
        ? keywordMatch(item.colour, attributes.color)
        : false;

      const patternMatch = attributes.pattern
        ? keywordMatch(item.pattern, attributes.pattern)
        : false;

      const genderMatch = attributes.gender
        ? item.gender.toLowerCase() === attributes.gender.toLowerCase()
        : false;

      // Logic for cross-category recommendations
      const crossCategoryRecommendation = attributes.category && (
        (attributes.category.toLowerCase() === "shorts" && item.category.toLowerCase() === "shirts") ||
        (attributes.category.toLowerCase() === "t-shirts" && item.category.toLowerCase() === "jackets") ||
        (attributes.category.toLowerCase() === "hoodies" && item.category.toLowerCase() === "trousers")
      );

      // Combine the matching logic
      return categoryMatch || colorMatch || patternMatch || genderMatch || crossCategoryRecommendation;
    });

    setSimilarItems(recommendedItems);
    setStatus(`Found ${recommendedItems.length} similar items.`);
  };


  // Use useEffect to trigger findSimilarItems whenever attributes changes
  useEffect(() => {
    if (attributes) {
      findSimilarItems(attributes);
    }
  }, [attributes]);

  const analyzeImage = async () => {
    if (!event || !outfitStyle || !gender || !size) {
      setError('Please answer all questions before analyzing the image.');
      return;
    }

    setLoading(true);
    setError('');
    setAttributes(null);
    setStatus('Analyzing image and generating attributes...');

    try {
      const prompt = `
        Please analyze the clothing item in this image located at ${imageUrl} and provide a JSON response with the following format  most images will be from next website since this application is for next hackathon event.
        {
          "category": "string",       // e.g., "dress", "shirt", "jacket"
          "name": "string",           // Match with names commonly found on the Next website, such as "floral midi dress", "striped blouse", "puffer jacket", etc.
          "pattern": "string",        // e.g., "floral", "striped", "plain"
          "color": "string"           // e.g., "blue", "red", "black", "multicolored"
        }
        Only respond with the JSON object.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
      });

      const gptResponse = response.choices[0]?.message?.content?.trim();
      if (gptResponse) {
        const jsonText = gptResponse.replace(/```json|```/g, '').trim();
        try {
          const parsedResponse = JSON.parse(jsonText);

          // Combine user inputs with image attributes and update state
          setAttributes({
            category: parsedResponse.category,
            color: parsedResponse.color,
            name: parsedResponse.name,
            pattern: parsedResponse.pattern,
            event,
            outfitStyle,
            gender,
            size,
          });

          console.log('Attributes:', attributes);
        } catch (parseError) {
          console.error("Failed to parse JSON:", parseError);
          setError("Failed to parse the response. Please ensure the API returns a valid JSON.");
        }
      } else {
        setError("No response from the model.");
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      setError('An error occurred while analyzing the image.');
    } finally {
      setLoading(false);
    }
  };

  console.log('value of loading', loading);




  return (
    <div>
      <h3>Image Analysis</h3>

      {/* Questions Section */}
      <div>
        <h4>Please answer the following questions:</h4>

        <label>What event are you going to?</label>
        <div>
          <label><input type="radio" name="event" value="wedding" onChange={() => setEvent('wedding')} /> Wedding</label>
          <label><input type="radio" name="event" value="party" onChange={() => setEvent('party')} /> Party</label>
          <label><input type="radio" name="event" value="casual" onChange={() => setEvent('casual')} /> Casual</label>
          <label><input type="radio" name="event" value="formal" onChange={() => setEvent('formal')} /> Formal</label>
        </div>

        <label>What is your usual outfit style?</label>
        <div>
          <label><input type="radio" name="outfitStyle" value="casual" onChange={() => setOutfitStyle('casual')} /> Casual</label>
          <label><input type="radio" name="outfitStyle" value="formal" onChange={() => setOutfitStyle('formal')} /> Formal</label>
          <label><input type="radio" name="outfitStyle" value="sporty" onChange={() => setOutfitStyle('sporty')} /> Sporty</label>
          <label><input type="radio" name="outfitStyle" value="business" onChange={() => setOutfitStyle('business')} /> Business</label>
        </div>

        <label>Gender:</label>
        <div>
          <label><input type="radio" name="gender" value="male" onChange={() => setGender('male')} /> Male</label>
          <label><input type="radio" name="gender" value="female" onChange={() => setGender('female')} /> Female</label>
          <label><input type="radio" name="gender" value="non-binary" onChange={() => setGender('non-binary')} /> Non-binary</label>
        </div>

        <label>Size:</label>
        <select onChange={(e) => setSize(e.target.value)} value={size}>
          <option value="">Select size</option>
          <option value="XS">XS</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
          <option value="XXL">XXL</option>
        </select>
      </div>

      {/* Analyze Image Button */}
      <button onClick={analyzeImage} disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze Image'}
      </button>

      {/* Display Errors */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display Analysis Results */}
      {attributes && (
        <div>
          <h4>Analysis Result:</h4>
          <p><strong>Category:</strong> {attributes.category}</p>
          <p><strong>Color:</strong> {attributes.color}</p>
          <p><strong>Pattern:</strong> {attributes.pattern}</p>
          {attributes.name && <p><strong>Name:</strong> {attributes.name}</p>}
          <p><strong>Event:</strong> {attributes.event}</p>
          <p><strong>Usual Outfit Style:</strong> {attributes.outfitStyle}</p>
          <p><strong>Gender:</strong> {attributes.gender}</p>
          <p><strong>Size:</strong> {attributes.size}</p>
        </div>
      )}


      {status && <p>Status: {status}</p>}

      {similarItems.length > 0 && (
        <div>
          <h4>Recommended Items to try out or similar items:</h4>
          <ul>
            {similarItems.map((item, index) => (
              <li key={index}>
                <img src={item.image_url} alt={item.name} style={{ width: "100px", height: "auto" }} />
                <p><strong>Name:</strong> {item.name}</p>
                <p><strong>Category:</strong> {item.category}</p>
                <a href={item.item_link} target="_blank">go to link</a>
                {/* Other details */}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};



export default ImageAnalyzer;
