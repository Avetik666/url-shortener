import React from 'react';

interface Props {
  shortenedUrl: string;
}

const ShortenedUrlDisplay: React.FC<Props> = ({ shortenedUrl }) => {
  return (
    <div className="bg-white p-4 rounded shadow-md mt-4 w-full max-w-md">
      <p className="text-sm text-gray-600">Shortened URL:</p>
      <a
        href={shortenedUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline break-all"
      >
        {shortenedUrl}
      </a>
    </div>
  );
};

export default ShortenedUrlDisplay;
