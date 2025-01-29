import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UrlShortenerForm from './components/UrlShortenerForm';
import ShortenedUrlDisplay from './components/ShortenedUrlDisplay';
import { createShortUrl } from './api/urlService';
import Redirect from './pages/Redirect';

const App = () => {
  const [shortenedUrl, setShortenedUrl] = useState<string | null>(null);

  const handleShortenUrl = async (url: string) => {
    try {
      const data = await createShortUrl(url);
      setShortenedUrl(`${window.location.origin}/${data.shortCode}`);
    } catch (error) {
      console.error('Error shortening URL:', error);
      alert('Failed to shorten URL. Please try again later.');
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div id="root" className="text-center">
              <header>
                <h1 className="text-3xl font-bold mb-4">URL Shortener</h1>
              </header>
              <main className="flex flex-col items-center">
                <UrlShortenerForm onShortenUrl={handleShortenUrl} />
                {shortenedUrl && <ShortenedUrlDisplay shortenedUrl={shortenedUrl} />}
              </main>
            </div>
          }
        />
        <Route path="/:shortCode" element={<Redirect />} />
      </Routes>
    </Router>
  );
};

export default App;
