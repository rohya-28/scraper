'use client';
import { useState } from 'react';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Default role is user

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle signup logic here (e.g., send data to an API)
    console.log({ name, email, password, role });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center text-green-700">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full p-2 border rounded border-green-300 focus:ring focus:ring-green-200"
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
              className="w-full p-2 border rounded border-green-300 focus:ring focus:ring-green-200"
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
              className="w-full p-2 border rounded border-green-300 focus:ring focus:ring-green-200"
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
                className={`p-2 border rounded ${role === 'user' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700'}`}
                onClick={() => setRole('user')}
              >
                User
              </button>
              <button
                type="button"
                className={`p-2 border rounded ${role === 'admin' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700'}`}
                onClick={() => setRole('admin')}
              >
                Admin
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}