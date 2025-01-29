import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOriginalUrl } from "../api/urlService";

const Redirect = () => {
  const { shortCode } = useParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUrl = async () => {
      try {
        const data = await getOriginalUrl(shortCode!);
        window.location.href = data.originalUrl;
      } catch (err) {
        console.error("Error fetching original URL:", err);
        setError("Short URL not found.");
      }
    };

    fetchUrl();
  }, [shortCode]);

  if (error) {
    return (
      <div className="text-center mt-20">
        <h1 className="text-2xl font-bold text-red-600">404 - Short URL Not Found</h1>
        <p className="text-gray-500 mt-2">The URL you requested does not exist.</p>
      </div>
    );
  }

  return <p className="text-gray-600">Redirecting...</p>;
};

export default Redirect;
