'use client';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { FaLaptop, FaTree, FaRecycle } from 'react-icons/fa';

export default function Home() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [scrapType, setScrapType] = useState('');
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (navigator.geolocation && location === null) {
      getLocation();
    }
  }, []);

  const getLocation = () => {
    console.log('Get Location clicked');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          console.log('Location:', location);
        },
        (error) => {
          setError('Could not get location.');
          console.error('Geolocation error:', error);
          console.log('error occured');
        }
      );
    } else {
      setError('Geolocation not supported.');
      console.log('error occured, geolocation not supported');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/scrap-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          phone,
          scrapType,
          location,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setName('');
        setPhone('');
        setScrapType('');
      } else {
        setError(data.message || 'An error occurred.');
      }
    } catch (err) {
      setError('Failed to submit request.');
      console.error('Scrap request error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-green-50">
      <Navbar />

      <div className="p-4">
        <div className="bg-white p-6 rounded shadow-md border border-green-200 w-full max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-center text-green-700">New Scrap Request</h2>
          {success && <p className="text-green-600 mb-4">Request submitted successfully!</p>}
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label htmlFor="name" className="block text-sm font-medium text-green-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full p-2 border rounded text-sm border-green-300 focus:ring focus:ring-green-200"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-2">
              <label htmlFor="phone" className="block text-sm font-medium text-green-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                className="w-full p-2 border rounded text-sm border-green-300 focus:ring focus:ring-green-200"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium text-green-700 mb-1">
                Scrap Type
              </label>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setScrapType('Electronics')}
                  className={`p-2 border rounded transition-colors duration-200 ${
                    scrapType === 'Electronics' ? 'bg-green-200 border-green-300' : 'border-green-300 hover:bg-green-100'
                  }`}
                >
                  <FaLaptop className="text-lg text-green-700" />
                </button>
                <button
                  type="button"
                  onClick={() => setScrapType('Wood')}
                  className={`p-2 border rounded transition-colors duration-200 ${
                    scrapType === 'Wood' ? 'bg-green-200 border-green-300' : 'border-green-300 hover:bg-green-100'
                  }`}
                >
                  <FaTree className="text-lg text-green-700" />
                </button>
                <button
                  type="button"
                  onClick={() => setScrapType('Plastic')}
                  className={`p-2 border rounded transition-colors duration-200 ${
                    scrapType === 'Plastic' ? 'bg-green-200 border-green-300' : 'border-green-300 hover:bg-green-100'
                  }`}
                >
                  <FaRecycle className="text-lg text-green-700" />
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={getLocation}
              className="w-full bg-green-200 text-green-700 p-2 rounded hover:bg-green-300 active:bg-green-400 transition-colors duration-200 text-sm mb-2"
            >
              Get Location
            </button>
            {location && (
              <div className="mb-2">
                <p className="text-sm text-green-700">
                  Location: Latitude {location.latitude}, Longitude {location.longitude}
                </p>
              </div>
            )}
            <button
              type="submit"
              className={`w-full bg-green-500 text-white p-4 rounded hover:bg-green-600 active:bg-green-700 transition-colors duration-200 text-sm focus:ring focus:ring-green-200 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}