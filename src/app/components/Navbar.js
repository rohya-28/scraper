'use client';
import Link from 'next/link';

const Navbar = () => {
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
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 