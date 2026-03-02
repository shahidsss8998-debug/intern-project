import React from 'react';

export default function Legend({ className = '' }) {
    const items = [
        { label: 'Available', color: '#10B981' },
        { label: 'Occupied', color: '#EF4444' },
        { label: 'Reserved', color: '#F59E0B' },
        { label: 'Selected', color: '#3B82F6' },
    ];

    return (
        <div className={`legend flex flex-wrap gap-3 ${className}`}>
            {items.map(it => (
                <div key={it.label} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ background: it.color }} />
                    <span className="text-xs text-gray-200">{it.label}</span>
                </div>
            ))}
        </div>
    );
}
