React Seat Map Component (SVG) with Tailwind CSS

Overview
- A compact React component that renders a restaurant table layout in an SVG container so table positions can be precisely controlled.
- Tables JSON follows a provided schema and supports circle/rect shapes.
- Click-to-select functionality for available tables.
- Legend and responsive SVG scaling.

Files created
- `src/components/SeatMap.jsx` — main map component.
- `src/components/Legend.jsx` — small legend component.
- `src/data/tables.schema.json` — JSON schema for a table item.
- `src/App.jsx` — example usage.

Schema
See `tables.schema.json` — fields: id, tableNumber, x_position, y_position, shape, capacity, status, width, height, radius.

Tailwind & Usage
1. Create a React app (Vite / Create React App).
2. Install Tailwind CSS and configure per the Tailwind docs.
3. (Optional) Install Tippy for rich hover tooltips:

   npm install @tippyjs/react tippy.js

   `SeatMap.jsx` imports the Tippy CSS automatically; if you don't install Tippy the component still works (it will gracefully fall back to native titles), but for the richer tooltip experience install the package above.

4. Copy the components into your project.
5. Use the `<SeatMap tables={...} width={W} height={H} onSelect={fn} />` as shown in `App.jsx`.

Notes
- The SVG uses `viewBox` and `preserveAspectRatio="xMidYMid meet"` so it scales responsively inside a parent container — set a fixed height on the wrapper for consistent aspect ratio.
- The component supports single or multi-select (prop `multiSelect`), and respects table `status` (only `available` tables are selectable).
- You can customize colors and sizes (radius/width/height) in the table data.

If you want, I can:
- Add drag-and-drop repositioning with a simple editor mode.
- Add hovering seat labels and tooltips using Tippy.js or custom tooltip.
- Add persistence (save layout) to localStorage or your backend API.

Tell me which enhancements you'd like next.