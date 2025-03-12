'use client';
import dynamic from 'next/dynamic';

const LeafletMap = dynamic(() => import('./wrapper'), {
  ssr: false,
});

export default function DirectionMap({ start, end }) {
  return <LeafletMap start={start} end={end} />;
}