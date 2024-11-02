// import React, { useState } from 'react';
// import weaviateClient from './weaviateClient'; // import the client
// import clothingData from '../data.json'; // Assuming you have JSON data for upsert

// const WeaviateDataHandler = () => {
//   const [status, setStatus] = useState('');
//   const [similarItems, setSimilarItems] = useState([]);

//   // Upsert data into Weaviate
//   const upsertClothingData = async () => {
//     setStatus('Upserting data to Weaviate...');

//     try {
//       for (const item of clothingData) {
//         // Prepare the data object for upsert
//         const response = await weaviateClient.data
//           .creator()
//           .withClassName('Clothing') // Define class name (make sure this class exists in Weaviate schema)
//           .withProperties({
//             name: item.name,
//             category: item.category,
//             color: item.colour,
//             pattern: item.pattern,
//             gender: item.gender,
//             size: item.size,
//             imageUrl: item.image_url,
//             itemLink: item.item_link,
//           })
//           .do();

//         console.log('Data upserted:', response);
//       }

//       setStatus('Data upserted to Weaviate successfully!');
//     } catch (error) {
//       console.error('Error upserting data:', error);
//       setStatus('Failed to upsert data to Weaviate.');
//     }
//   };

//   // Query similar items from Weaviate
//   const querySimilarItems = async (queryText) => {
//     setStatus(`Querying Weaviate for items similar to "${queryText}"...`);

//     try {
//       const response = await weaviateClient.graphql
//         .get()
//         .withClassName('Clothing')
//         .withFields('name category color pattern gender size imageUrl itemLink')
//         .withNearText({ concepts: [queryText] })
//         .withLimit(5)
//         .do();

//       const items = response.data.Get.Clothing || [];
//       setSimilarItems(items);
//       setStatus(`Found ${items.length} similar items.`);
//     } catch (error) {
//       console.error('Error querying similar items:', error);
//       setStatus('Failed to query similar items.');
//     }
//   };

//   return (
//     <div>
//       <h3>Weaviate Data Handler</h3>

//       {/* Button to Upsert Data */}
//       <button onClick={upsertClothingData}>Upsert Clothing Data</button>
//       <p>Status: {status}</p>

//       {/* Button to Query Similar Items */}
//       <button onClick={() => querySimilarItems('blue jeans')}>Find Similar to "blue jeans"</button>

//       {/* Display Results */}
//       {similarItems.length > 0 && (
//         <div>
//           <h4>Similar Items:</h4>
//           <ul>
//             {similarItems.map((item, index) => (
//               <li key={index}>
//                 <p><strong>Name:</strong> {item.name}</p>
//                 <p><strong>Category:</strong> {item.category}</p>
//                 <p><strong>Color:</strong> {item.color}</p>
//                 <p><strong>Pattern:</strong> {item.pattern}</p>
//                 <a href={item.itemLink} target="_blank" rel="noopener noreferrer">View Item</a>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default WeaviateDataHandler;
