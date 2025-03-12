'use client';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter, useSearchParams } from 'next/navigation';
import DirectionMap from '../components/DirectionMap';

export default function MyPage() {
  const searchParams = useSearchParams();
  const startLat = parseFloat(searchParams.get('startLat'));
  const startLng = parseFloat(searchParams.get('startLng'));
  const endLat = parseFloat(searchParams.get('endLat'));
  const endLng = parseFloat(searchParams.get('endLng'));

  const start = { latitude: startLat, longitude: startLng };
  const end = { latitude: endLat, longitude: endLng };

  if (isNaN(startLat) || isNaN(startLng) || isNaN(endLat) || isNaN(endLng)) {
    return (
      <div>
        <p>Invalid or missing location parameters.</p>
      </div>
    );
  }

  return (
    <div>
      <DirectionMap start={start} end={end} />
    </div>
  );
}