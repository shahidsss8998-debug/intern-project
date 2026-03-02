import React from 'react';
import SeatMap from './components/SeatMap';
import Legend from './components/Legend';

const sampleTables = [
  { id: 1, tableNumber: 'T1', x_position: 120, y_position: 120, shape: 'circle', capacity: 4, status: 'available' },
  { id: 2, tableNumber: 'T2', x_position: 270, y_position: 120, shape: 'rect', capacity: 6, status: 'occupied' },
  { id: 3, tableNumber: 'T3', x_position: 430, y_position: 120, shape: 'circle', capacity: 2, status: 'reserved', guest: 'Mr. Patel', notes: 'Window seat requested' },
  { id: 4, tableNumber: 'T4', x_position: 120, y_position: 260, shape: 'rect', capacity: 8, status: 'available' },
  { id: 5, tableNumber: 'T5', x_position: 270, y_position: 260, shape: 'circle', capacity: 3, status: 'available', notes: 'High chair available' }
];

export default function App() {
  function handleSelect(tableOrIds) {
    console.log('Selected:', tableOrIds);
  }

  return (
    <div className="p-6 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen text-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Restaurant Seat Map</h1>
        <div className="bg-gray-900 p-4 rounded-lg shadow-lg">
          <div style={{ height: 520 }} className="w-full">
            <SeatMap tables={sampleTables} width={600} height={400} onSelect={handleSelect} />
          </div>
          <div className="mt-4">
            <Legend />
          </div>
        </div>
      </div>
    </div>
  );
}
