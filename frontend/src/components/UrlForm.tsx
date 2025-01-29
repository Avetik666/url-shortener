import React, { useState } from 'react';
import { createShortUrl } from '../api/urlService';

const UrlForm = ({ onSuccess }: { onSuccess: (url: string) => void }) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const data = await createShortUrl(originalUrl);
      onSuccess(data.shortCode);
    } catch (err) {
      setError('Failed to shorten URL. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="url-form">
      <input
        type="url"
        value={originalUrl}
        onChange={(e) => setOriginalUrl(e.target.value)}
        placeholder="Enter a URL"
        required
        className="input"
      />
      <button type="submit" className="button">
        Shorten
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
};

export default UrlForm;
