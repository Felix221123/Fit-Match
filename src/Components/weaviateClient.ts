import weaviate, { ApiKey } from 'weaviate-ts-client';

// Initialize the Weaviate client
const weaviateClient = weaviate.client({
  scheme: 'https',
  host: import.meta.env.VITE_WEAVIATE_URL.replace('https://', ''),
  apiKey: new ApiKey(import.meta.env.VITE_WEAVIATE_API_KEY),
});

export default weaviateClient;
