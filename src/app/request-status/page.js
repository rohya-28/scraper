// src/app/my-requests/page.js

'use client';

import { useEffect, useState } from 'react';

function MyRequestsPage() {
  const [userRequests, setUserRequests] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('userId');
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      setError(null);

      const fetchUserRequests = async () => {
        try {
          const formData = new FormData(); // You might not need FormData for GET requests, but kept it to match your example.
          formData.append('userId', userId); // Add userId to the formdata.

          const response = await fetch('https://scrap-be.vercel.app/api/scrap-requests', {
            method: 'POST', //Changed to POST to match your example.
            body: formData,
            headers: {
              Authorization: `Bearer ${localStorage.getItem('scrapauthToken')}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch user requests.');
          }

          const data = await response.json();
          console.log('data', data);

          if (data && data.scrapRequests) {
            setUserRequests(data.scrapRequests);
          } else {
            setUserRequests([]);
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchUserRequests();
    }
  }, [userId]);

  if (loading) {
    return <p className="text-center mt-4">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-4">Error: {error}</p>;
  }

  return (
    <div className="md:w-7/10 mx-auto bg-white p-6 rounded shadow-md border border-green-200 overflow-y-auto max-h-[90vh] mt-8">
      <h2 className="text-2xl font-semibold mb-6 text-green-700 text-center">My Scrap Requests</h2>
      {userRequests.length === 0 ? (
        <p className="text-lg text-gray-600 text-center">No previous requests found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  );
}

export default MyRequestsPage;