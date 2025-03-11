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
  const [image, setImage] = useState(null);
  const [previousRequests, setPreviousRequests] = useState([]);

  useEffect(() => {
    if (navigator.geolocation && location === null) {
      getLocation();
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch('https://scrap-be.vercel.app/api/scrap-requests');
      const data = await res.json();
      console.log('Fetched requests:', data);
      setPreviousRequests(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error('Failed to fetch previous requests', err);
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          setError('Could not get location.');
          console.error('Geolocation error:', error);
        }
      );
    } else {
      setError('Geolocation not supported.');
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('phone', phone);
      formData.append('scrapType', scrapType);
      formData.append('location', JSON.stringify(location));
      if (image) {
        formData.append('image', image);
      }

      const response = await fetch('/api/scrap-request', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setName('');
        setPhone('');
        setScrapType('');
        setImage(null);
        fetchRequests(); // refresh the list
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

      <div className="flex flex-col md:flex-row p-4 gap-6 mt-14">
        {/* Left: Previous Requests */}
        <div className="md:w-7/10 bg-white p-4 rounded shadow-md border border-green-200 overflow-y-auto max-h-[90vh]">
          <h2 className="text-xl font-semibold mb-4 text-green-700">Previous Scrap Requests</h2>
          {previousRequests.length === 0 ? (
            <p className="text-sm text-gray-500">No previous requests found.</p>
          ) : (
            previousRequests.map((req) => (
              <div key={req._id} className="border p-3 mb-3 rounded bg-green-50">
                <img src={req.image} alt={req.scrapName} className="w-full h-40 object-cover rounded mb-2" />
                <p className="text-green-700 font-medium">{req.scrapName} ({req.scrapType})</p>
                <p className="text-sm text-gray-600">Qty: {req.quantity}</p>
                <p className="text-sm text-gray-600 capitalize">Status: {req.status}</p>
                <p className="text-xs text-gray-500">Created at: {new Date(req.createdAt).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>

        {/* Right: Form */}
        <div className="md:w-3/10 bg-white p-6 rounded shadow-md border border-green-200">
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
                className="w-full p-2 border text-green-600 rounded text-sm border-green-300 focus:ring focus:ring-green-200"
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
                className="w-full p-2 border rounded text-green-600 text-sm border-green-300 focus:ring focus:ring-green-200"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium text-green-700 mb-1">Scrap Type</label>
              <div className="flex space-x-2">
                {[
                  { type: 'Electronics', icon: <FaLaptop /> },
                  { type: 'Wood', icon: <FaTree /> },
                  { type: 'Plastic', icon: <FaRecycle /> },
                ].map(({ type, icon }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setScrapType(type)}
                    className={`p-2 border rounded transition-colors duration-200 ${
                      scrapType === type
                        ? 'bg-green-200 border-green-300'
                        : 'border-green-300 hover:bg-green-100'
                    }`}
                  >
                    <span className="text-lg text-green-700">{icon}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-2">
              <label htmlFor="image" className="block text-sm font-medium text-green-700 mb-1">
                Image
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                className="w-full p-2 border rounded text-green-600 text-sm border-green-300 focus:ring focus:ring-green-200"
                onChange={handleImageChange}
              />
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
              className={`w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 active:bg-green-700 transition-colors duration-200 text-sm focus:ring focus:ring-green-200 ${
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
