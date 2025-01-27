import React, { useState } from 'react';

interface Props {
  onShortenUrl: (url: string) => void;
}

const UrlShortenerForm: React.FC<Props> = ({ onShortenUrl }) => {
  const [url, setUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setError('Please enter a valid URL starting with http:// or https://');
      return;
    }
    setError(null);
    onShortenUrl(url);
    setUrl('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow-md w-full max-w-md"
    >
      <label htmlFor="url" className="block text-sm font-medium text-gray-700">
        Enter URL
      </label>
      <input
        type="text"
        id="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com"
        className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      <button
        type="submit"
        className="mt-3 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
      >
        Shorten URL
      </button>
    </form>
  );
};

export default UrlShortenerForm;
