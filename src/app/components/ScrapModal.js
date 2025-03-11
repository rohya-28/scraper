'use client';
import { useState, useEffect } from 'react';

export default function ScrapModal({ onClose }) {
  // ... (state variables remain the same)

  useEffect(() => {
    // ... (geolocation logic remains the same)
  }, []);

  const handleSubmit = async (e) => {
    // ... (handleSubmit logic remains the same)
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-gray-900 text-gray-200 p-8 rounded-lg shadow-2xl w-full max-w-3xl relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-200">
          X
        </button>
        <h2 className="text-3xl font-semibold mb-6 text-center text-teal-400">Scrap Pickup Request</h2>
        {/* ... (success and error messages remain the same) */}
        {success && <p className="text-green-400 mb-4">Request submitted successfully!</p>}
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          {/* ... (form fields with theme changes) */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-gray-200 focus:ring focus:ring-teal-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-2">
              Address
            </label>
            <textarea
              id="address"
              className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-gray-200 focus:ring focus:ring-teal-500"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-gray-200 focus:ring focus:ring-teal-500"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="scrapType" className="block text-sm font-medium text-gray-300 mb-2">
              Scrap Type
            </label>
            <input
              type="text"
              id="scrapType"
              className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-gray-200 focus:ring focus:ring-teal-500"
              value={scrapType}
              onChange={(e) => setScrapType(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-300 mb-2">
              Pickup Date
            </label>
            <input
              type="date"
              id="pickupDate"
              className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-gray-200 focus:ring focus:ring-teal-500"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
              Message (Optional)
            </label>
            <textarea
              id="message"
              className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-gray-200 focus:ring focus:ring-teal-500"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>
          <button
            type="submit"
            className={`w-full bg-teal-500 text-white p-3 rounded-md hover:bg-teal-600 focus:outline-none focus:ring focus:ring-teal-200 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
}