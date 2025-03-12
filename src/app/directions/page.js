import DirectionMap from '../components/DirectionMap';

export default function MyPage() {
  const start = { latitude: 28.7041, longitude: 77.1025 };
  const end = { latitude: 28.6139, longitude: 77.2090 };

  return (
    <div>
      <DirectionMap start={start} end={end} />
    </div>
  );
}