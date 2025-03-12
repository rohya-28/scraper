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
  const [userRequests, setUserRequests] = useState([]);
  const [scrapName, setScrapName] = useState('');
  const [quantity, setQuantity] = useState('');
  

  useEffect(() => {
    if (navigator.geolocation && location === null) {
      getLocation();
    }
  }, []);

  useEffect(() => {
    fetchRequests();
    fetchUserRequests()
  }, []);

  const fetchRequests = async () => {
    try {
      // const res = await fetch('https://scrap-be.vercel.app/api/scrap-requests',);
      const res = await fetch('https://scrap-be.vercel.app/api/scrap-requests', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('scrapauthToken')}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setPreviousRequests(data.scrapRequests);
      } else {
        setError(data.message || 'Failed to fetch requests');
        setPreviousRequests([]);
      }
      console.log('Fetched requests:', data.scrapRequests);
     
    } catch (err) {
      console.error('Failed to fetch previous requests', err);
      setPreviousRequests([]);
    }
  };

  const fetchUserRequests = async () => {
    try {
      const token = localStorage.getItem('scrapauthToken');
      if (!token) {
        setError('Authentication token missing.');
        setUserRequests([]); // Clear previous requests
        return;
      }
  
      const response = await fetch('https://scrap-be.vercel.app/api/scrap-requests/user', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch user requests');
        setUserRequests([]); // Clear previous requests
        return;
      }
  
      const data = await response.json();
      setUserRequests(data);
      console.log('Fetched user requests:', data);
  
    } catch (err) {
      setError('Failed to fetch user requests');
      setUserRequests([]); // Clear previous requests
      console.error('Failed to fetch user requests', err);
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
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setError('Location access denied. Please enable location services.');
              break;
            case error.POSITION_UNAVAILABLE:
              setError('Location information is unavailable.');
              break;
            case error.TIMEOUT:
              setError('Location request timed out. Try again.');
              break;
            default:
              setError('An unknown error occurred.');
              break;
          }
          console?.error('Geolocation error:', error);
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
      formData.append('scrapType', scrapType); //todo
      formData.append('latitude', location?.latitude || 28.7041); //todo
      formData.append('longitude', location?.longitude || 77.1025); //todo
      formData.append('image', image);
      formData.append('quantity', quantity); //todo
      formData.append('scrapName', scrapName); //todo


      console.log('Data to send:', formData);


      const response = await fetch('https://scrap-be.vercel.app/api/scrap-requests', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('scrapauthToken')}`,
        },
      });

      const data = await response.json();

      console.log('data', data);


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
        
        
        <div className="md:w-7/10 bg-white p-6 rounded shadow-md border border-green-200 overflow-y-auto max-h-[90vh]">
  <h2 className="text-2xl font-semibold mb-6 text-green-700 text-center">Previous Scrap Requests</h2>
  {previousRequests.length === 0 && userRequests.length === 0 ? (
    <p className="text-lg text-gray-600 text-center">No previous requests found.</p>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Pending Requests */}
      {previousRequests.map((req) => (
        <div
          key={req._id}
          className="bg-green-50 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
        >
          <img
            src={req.image}
            alt={req.scrapName}
            className="w-full h-48 object-cover object-center"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              {req.scrapName} ({req.scrapType})
            </h3>
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-medium">Qty:</span> {req.quantity}
            </p>
            <p className="text-sm text-gray-700 mb-2 capitalize">
              <span className="font-medium">Status:</span> {req.status}
            </p>
            <p className="text-xs text-gray-600">
              <span className="font-medium">Created at:</span>{' '}
              {new Date(req.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      ))}

      {/* Accepted Requests */}
      {userRequests.map((req) => (
        <div
          key={req._id}
          className="bg-blue-50 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
        >
          <img
            src={req.image}
            alt={req.scrapName}
            className="w-full h-48 object-cover object-center"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              {req.scrapName} ({req.scrapType})
            </h3>
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-medium">Qty:</span> {req.quantity}
            </p>
            <p className="text-sm text-gray-700 mb-2 capitalize">
              <span className="font-medium">Status:</span> {req.status}
            </p>
            <p className="text-xs text-gray-600">
              <span className="font-medium">Created at:</span>{' '}
              {new Date(req.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
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
              <label htmlFor="scrapName" className="block text-sm font-medium text-green-700 mb-1">
              scrapName
              </label>
              <input
                type="text"
                id="scrapName"
                className="w-full p-2 border rounded text-green-600 text-sm border-green-300 focus:ring focus:ring-green-200"
                value={scrapName}
                onChange={(e) => setScrapName(e.target.value)}
                required
              />
            </div>
            <div className="mb-2">
              <label htmlFor="Quantity" className="block text-sm font-medium text-green-700 mb-1">
              Quantity
              </label>
              <input
                type="text"
                id="Quantity"
                className="w-full p-2 border rounded text-green-600 text-sm border-green-300 focus:ring focus:ring-green-200"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
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
                    className={`p-2 border rounded transition-colors duration-200 ${scrapType === type
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
              className={`w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 active:bg-green-700 transition-colors duration-200 text-sm focus:ring focus:ring-green-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''
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