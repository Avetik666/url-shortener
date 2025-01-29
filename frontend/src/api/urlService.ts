const API_BASE_URL = import.meta.env.VITE_API_URL;

export const createShortUrl = async (originalUrl: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ originalUrl }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error shortening URL:', error);
    throw new Error('Failed to shorten URL.');
  }
};


export const getOriginalUrl = async (shortCode: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/url/${shortCode}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch original URL. Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching original URL:', error);
    throw new Error('Failed to fetch original URL.');
  }
};
