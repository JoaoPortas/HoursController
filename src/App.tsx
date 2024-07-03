import React from 'react';
import { createRoot } from 'react-dom/client';

// Clear the existing HTML content
document.body.innerHTML = '<div id="app"></div>';

// Render your React component instead
const elm = document.getElementById('app');
if (elm !== null) {
  const root = createRoot(elm);
  root.render(<h1>Hello, world</h1>);
}

