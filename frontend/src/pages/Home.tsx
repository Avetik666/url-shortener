import { useState } from 'react';
import UrlForm from '../components/UrlForm';
import UrlList from '../components/UrlList';

const Home = () => {
  const [shortCode, setShortCode] = useState<string | null>(null);

  return (
    <div className="home">
      <h1>URL Shortener</h1>
      <UrlForm onSuccess={setShortCode} />
      {shortCode && <UrlList shortCode={shortCode} />}
    </div>
  );
};

export default Home;
