'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    const token = localStorage.getItem('scrapauthToken');
    const storedUserName = localStorage.getItem('userName');
    if (token && storedUserName) {
      setIsLoggedIn(true);
      setUserName(storedUserName);
    } else if (token) {
      const fetchProfile = async () => {
        try {
          const response = await fetch('https://scrap-be.vercel.app/api/auth/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch profile');
          }

          const data = await response.json();
          localStorage.setItem('userName', data.name);
          setUserName(data.name);
          setIsLoggedIn(true);
        } catch (error) {
          console.error('Error fetching profile:', error);
          setIsLoggedIn(false);
        }
      };
      fetchProfile();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('scrapauthToken');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setUserName('');
    router.push('/'); // Redirect to home page
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-green-600">
              ScrapCollect
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-600 font-medium">Welcome, {userName}</span>
                <button
                  onClick={handleLogout}
                  className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;