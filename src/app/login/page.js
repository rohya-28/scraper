'use client';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const router = useRouter();



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://scrap-be.vercel.app/api/auth/login',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = response.data;
      console.log('data', data);



      if (response.status === 200 && data.success) {
        toast.success(data.message || 'Login successful!');
        localStorage.setItem('scrapauthToken', data.token); // Store the token

        router.push('/home');
      } else {
        const errorMessage = data.error || `Error ${response.status}: ${response.statusText}`;
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Invalid credentials. Please try again.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <ToastContainer />
      <div className="pt-24">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Login</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-black"

              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-black"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}