'use client';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Default role is user
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://scrap-be.vercel.app/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      let data;
      try {
        data = await response.json(); // Ensures JSON parsing won't break
      } catch {
        data = { message: 'Unexpected server response.' };
      }

      if (response.ok) {
        toast.success(data.message || 'Signup successful!');
        router.push('/login');
      } else {
        const errorMessage = data.error || `Error ${response.status}: ${response.statusText}`;
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error:', error);

      if (error.name === 'TypeError') {
        toast.error('Network error: Failed to connect to server.');
      } else {
        toast.error('An unexpected error occurred. Please try again later.');
      }
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
      <ToastContainer />
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-green-200">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-700">Sign Up</h2>


        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full p-2 border rounded border-green-300 focus:ring focus:ring-green-200 text-black"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-2 border rounded border-green-300 focus:ring focus:ring-green-200 text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-2 border rounded border-green-300 focus:ring focus:ring-green-200 text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Role
            </label>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                className={`p-2 border rounded ${role === 'resident' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700'}`}
                onClick={() => setRole('resident')}
              >
                Resident
              </button>
              <button
                type="button"
                className={`p-2 border rounded ${role === 'collector' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700'}`}
                onClick={() => setRole('collector')}
              >
                Collector
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-all"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>

  );
}