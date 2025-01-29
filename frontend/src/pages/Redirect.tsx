import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getOriginalUrl } from '../api/urlService';

const Redirect = () => {
  const { shortCode } = useParams<{ shortCode: string }>();

  useEffect(() => {
    const fetchAndRedirect = async () => {
      try {
        const data = await getOriginalUrl(shortCode!);
        window.location.href = data.originalUrl;
      } catch (err) {
        console.error('Failed to fetch original URL or invalid short code');
      }
    };

    fetchAndRedirect();
  }, [shortCode]);

  return <p>Redirecting...</p>;
};

export default Redirect;
