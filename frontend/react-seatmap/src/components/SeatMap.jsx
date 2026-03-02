import React, { useState, useEffect } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

/**
 * SeatMap Component
 * Props:
 * - tables: array of table objects (see JSON schema in tables.schema.json)
 * - width, height: numbers defining the coordinate system of the SVG (viewBox)
 * - onSelect(table) callback when a table is selected (only for available tables)
 * - selectable: boolean (default true)
 * - multiSelect: boolean (default false)
 *
 * Usage:
 * <SeatMap tables={tables} width={1000} height={600} onSelect={(t) => console.log(t)} />
 */
export default function SeatMap({ tables = [], width = 1000, height = 600, onSelect, selectable = true, multiSelect = false }) {
    const [selectedIds, setSelectedIds] = useState([]);

    useEffect(() => {
        // Reset selection when tables data changes
        setSelectedIds([]);
    }, [tables]);

    function handleSelect(table) {
        if (!selectable) return;
        if (table.status !== 'available') return; // only available tables are selectable

        if (multiSelect) {
            setSelectedIds(prev => {
                const exists = prev.includes(table.id);
                const next = exists ? prev.filter(id => id !== table.id) : [...prev, table.id];
                if (onSelect) onSelect(next.length === 0 ? null : next);
                return next;
            });
            return;
        }

        const isSelected = selectedIds.includes(table.id);
        const next = isSelected ? [] : [table.id];
        setSelectedIds(next);
        if (onSelect) onSelect(isSelected ? null : table);
    }

    const statusColor = (status) => {
        switch (status) {
            case 'available': return '#10B981'; // green
            case 'occupied': return '#EF4444'; // red
            case 'reserved': return '#F59E0B'; // amber
            default: return '#9CA3AF'; // gray
        }
    };

    const selectedColor = '#3B82F6'; // blue

    return (
        <div className="seatmap-container w-full h-full">
            <svg
                viewBox={`0 0 ${width} ${height}`}
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMid meet"
                role="img"
                aria-label="Restaurant seating map"
                className="block">

                <rect x="0" y="0" width={width} height={height} fill="transparent"/>

                {tables.map(table => {
                    const isSelected = selectedIds.includes(table.id);
                    const fill = isSelected ? selectedColor : statusColor(table.status);
                    const stroke = isSelected ? '#0ea5e9' : 'rgba(0,0,0,0.05)';

                    const commonProps = {
                        key: table.id,
                        onClick: () => handleSelect(table),
                        role: table.status === 'available' ? 'button' : 'img',
                        tabIndex: table.status === 'available' ? 0 : -1,
                        onKeyDown: (e) => { if ((e.key === 'Enter' || e.key === ' ') && table.status === 'available') handleSelect(table); },
                        style: { cursor: table.status === 'available' ? 'pointer' : 'default', transition: 'transform 120ms ease, opacity 180ms ease' },
                        'aria-label': `Table ${table.tableNumber} capacity ${table.capacity} status ${table.status}`
                    };

                    // build tooltip content (uses optional notes/guest fields)
                    const tooltipContent = (
                        <div className="text-xs text-left">
                            <div className="font-semibold">Table {table.tableNumber}</div>
                            <div>Capacity: {table.capacity}</div>
                            <div>Status: <span className="font-medium" style={{color: statusColor(table.status)}}>{table.status}</span></div>
                            {table.guest && <div>Guest: <span className="font-medium">{table.guest}</span></div>}
                            {table.notes && <div className="mt-1 text-gray-300">Notes: {table.notes}</div>}
                        </div>
                    );

                    if (table.shape === 'circle') {
                        const r = table.radius || Math.max(24, Math.min(48, 8 + table.capacity * 3));
                        return (
                            <Tippy key={table.id} content={tooltipContent} interactive={false} delay={[70, 0]} placement="top" theme="light">
                                <g {...commonProps} transform={`translate(${table.x_position},${table.y_position})`}>
                                    <circle r={r} cx={0} cy={0} fill={fill} stroke={stroke} strokeWidth={isSelected ? 3 : 1} />
                                    <text x={0} y={4} textAnchor="middle" fontSize={Math.max(10, Math.min(14, r / 2))} fill="#081124" fontWeight={700}>{table.tableNumber}</text>
                                </g>
                            </Tippy>
                        );
                    }

                    // default to rect
                    const w = table.width || Math.max(48, Math.min(120, 20 + table.capacity * 10));
                    const h = table.height || Math.max(32, Math.min(80, 20 + table.capacity * 6));
                    return (
                        <Tippy key={table.id} content={tooltipContent} interactive={false} delay={[70, 0]} placement="top" theme="light">
                            <g {...commonProps} key={table.id} transform={`translate(${table.x_position - w/2},${table.y_position - h/2})`}>
                                <rect width={w} height={h} rx={8} ry={8} fill={fill} stroke={stroke} strokeWidth={isSelected ? 3 : 1} />
                                <text x={w/2} y={h/2 + 4} textAnchor="middle" fontSize={Math.max(10, Math.min(14, h / 3))} fill="#081124" fontWeight={700}>{table.tableNumber}</text>
                            </g>
                        </Tippy>
                    );
                })}

            </svg>

            {/* Inline legend (keeps it with the map) */}
            <div className="mt-2 flex items-center gap-3 text-sm">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{background: '#10B981'}} />
                    <span className="text-xs text-gray-200">Available</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{background: '#EF4444'}} />
                    <span className="text-xs text-gray-200">Occupied</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{background: '#F59E0B'}} />
                    <span className="text-xs text-gray-200">Reserved</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{background: selectedColor}} />
                    <span className="text-xs text-gray-200">Selected</span>
                </div>
            </div>
        </div>
    );
}
