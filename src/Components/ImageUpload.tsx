import React, { useState } from 'react';
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage } from '@cloudinary/react';
import { CloudinaryImage } from '@cloudinary/url-gen/assets/CloudinaryImage';
import ClarifaiAnalysis from './ImageAnalysis';


const cld = new Cloudinary({
  cloud: { cloudName: 'drjjavzx5' }
});

const ImageUpload: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<CloudinaryImage | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);

  // Handle file upload to Cloudinary
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'kvfi_ix');

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/drjjavzx5/image/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

       // Set the Cloudinary image URL for use in ClarifaiAnalysis
      setImageURL(data?.secure_url);

      // Generate the Cloudinary image with transformations
      const img = cld
        .image(data.public_id)
        .format('auto')
        .quality('auto')
        .resize(auto().gravity(autoGravity()).width(500).height(500));

      setUploadedImage(img);

      console.log('Image uploaded to Cloudinary:', data);

    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
    }
  };

  return (
    <div>
      <h2>Upload an Image</h2>
      <input type="file" onChange={handleFileUpload} />

      {uploadedImage && (
        <div>
          <h3>Uploaded Image</h3>
          <AdvancedImage cldImg={uploadedImage} />
        </div>
      )}

      {
        uploadedImage && (
          <ClarifaiAnalysis imageUrl={imageURL || ""}/>
        )
      }

    </div>
  );
};

export default ImageUpload;


