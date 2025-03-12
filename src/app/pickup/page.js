'use client';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function NearbyScrap() {
  const [nearbyRequests, setNearbyRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationRequested, setLocationRequested] = useState(false);
  const [jwtToken, setJwtToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('scrapauthToken');
    if (token) {
      setJwtToken(token);
    }
  }, []);

  const requestLocation = () => {
    setLocationRequested(true);
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLoading(false);
        },
        (err) => {
          setError('Could not get user location.');
          setLoading(false);
          toast.error('Could not get user location.');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
      toast.error('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    if (userLocation && jwtToken) {
      const { latitude, longitude } = userLocation;
      const radius = 500;

      const fetchNearbyRequests = async () => {
        setLoading(true);
        setError(null);
        try {
          if (!jwtToken) {
            setError('Authentication token missing.');
            setLoading(false);
            toast.error('Authentication token missing.');
            return;
          }

          const response = await fetch(
            `https://scrap-be.vercel.app/api/scrap-requests/nearby?latitude=${latitude}&longitude=${longitude}&radius=${radius}`,
            {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
              },
            }
          );

          if (!response.ok) {
            if (response.status === 401) {
              setError('Authentication failed. Please log in again.');
              localStorage.removeItem('scrapauthToken');
              setJwtToken(null);
              toast.error('Authentication failed. Please log in again.');
            } else {
              throw new Error('Failed to fetch nearby requests');
            }
            setLoading(false);
            return;
          }

          const data = await response.json();
          setNearbyRequests(data);
          console.log(data);
        } catch (err) {
          setError(err.message);
          toast.error(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchNearbyRequests();
    }
  }, [userLocation, jwtToken]);

  const handleAccept = async (scrapRequestId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://scrap-be.vercel.app/api/pickups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          scrapRequestId: scrapRequestId,
          scheduledTime: '',
          status: 'accepted',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to accept request');
      }

      toast.success('Request accepted successfully!');
      // Refresh the list after accepting
      fetchNearbyRequests();
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }

    const fetchNearbyRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!jwtToken) {
          setError('Authentication token missing.');
          setLoading(false);
          toast.error('Authentication token missing.');
          return;
        }

        const response = await fetch(
          `https://scrap-be.vercel.app/api/scrap-requests/nearby?latitude=${userLocation.latitude}&longitude=${userLocation.longitude}&radius=500`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            setError('Authentication failed. Please log in again.');
            localStorage.removeItem('scrapauthToken');
            setJwtToken(null);
            toast.error('Authentication failed. Please log in again.');
          } else {
            throw new Error('Failed to fetch nearby requests');
          }
          setLoading(false);
          return;
        }

        const data = await response.json();
        setNearbyRequests(data);
        console.log(data);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNearbyRequests();
  };

  if (!locationRequested) {
    return (
      <div className="flex justify-center items-center h-screen bg-green-50">
        <button
          onClick={requestLocation}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Get Nearby Scrap Requests
        </button>
        <ToastContainer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-green-50">
        <p className="text-green-700">Loading...</p>
        <ToastContainer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600 bg-green-50">
        <p>Error: {error}</p>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-green-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4 text-green-800">Nearby Scrap Requests</h1>
      {nearbyRequests.length === 0 ? (
        <p className="text-gray-600">No nearby scrap requests found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nearbyRequests.map((request) => (
            <div
              key={request._id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-green-200"
            >
              <img
                src={request.image}
                alt={request.scrapName}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2 text-green-700">
                  {request.scrapName}
                </h2>
                <p className="text-sm text-gray-700 mb-1">
                  Status: <span className="capitalize text-green-600">{request.status}</span>
                </p>
                <p className="text-sm text-gray-700">
                  User: {request.userId.email}
                </p>
                <button
                  onClick={() => handleAccept(request._id)}
                  className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                >
                  Accept
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <ToastContainer />
    </div>
  );
}