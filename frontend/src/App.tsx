import React, { useState } from 'react';
import UrlShortenerForm from './components/UrlShortenerForm';
import ShortenedUrlDisplay from './components/ShortenedUrlDisplay';

const App: React.FC = () => {
  const [shortenedUrl, setShortenedUrl] = useState<string | null>(null);

  const handleShortenUrl = async (url: string) => {
    // Simulate API call; we'll replace this with actual backend integration
    const simulatedResponse = `https://short.ly/${btoa(url).slice(0, 6)}`;
    setShortenedUrl(simulatedResponse);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">URL Shortener</h1>
      <UrlShortenerForm onShortenUrl={handleShortenUrl} />
      {shortenedUrl && <ShortenedUrlDisplay shortenedUrl={shortenedUrl} />}
    </div>
  );
};

export default App;
