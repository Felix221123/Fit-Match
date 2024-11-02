import React, { useState } from 'react';
import { OpenAI } from 'openai';

interface ImageAnalyzerProps {
  imageUrl: string;
}

interface ClothingAttributes {
  category: string;
  color: string;
  name?: string;
  pattern: string;
  event?: string;
  outfitStyle?: string;
  gender?: string;
  size?: string;
}

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const ImageAnalyzer: React.FC<ImageAnalyzerProps> = ({ imageUrl }) => {
  const [attributes, setAttributes] = useState<ClothingAttributes | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // State for user answers to additional questions
  const [event, setEvent] = useState<string>('');
  const [outfitStyle, setOutfitStyle] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [size, setSize] = useState<string>('');

  const analyzeImage = async () => {
    if (!event || !outfitStyle || !gender || !size) {
      setError('Please answer all questions before analyzing the image.');
      return;
    }

    setLoading(true);
    setError('');
    setAttributes(null);

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

      console.log("Full OpenAI Response: ", response);

      // Extract the JSON response
      const gptResponse = response.choices[0]?.message?.content?.trim();

      // Parse the JSON
      if (gptResponse) {
        const jsonText = gptResponse.replace(/```json|```/g, '').trim();
        console.log('jsonText', jsonText);

        try {
          const parsedResponse = JSON.parse(jsonText);

          // Combine user inputs with image attributes
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

          console.log('parsedResponse ', attributes);

          
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
    </div>
  );
};



export default ImageAnalyzer;
