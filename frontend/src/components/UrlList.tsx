const UrlList = ({ shortCode }: { shortCode: string }) => {
  const shortUrl = `${window.location.origin}/${shortCode}`;

  return (
    <div className="url-list">
      <p>Your shortened URL:</p>
      <a href={shortUrl} target="_blank" rel="noopener noreferrer">
        {shortUrl}
      </a>
    </div>
  );
};

export default UrlList;
