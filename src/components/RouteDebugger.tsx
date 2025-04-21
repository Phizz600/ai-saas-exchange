
import React from 'react';
import { Link } from 'react-router-dom';

export const RouteDebugger = () => {
  const routes = [
    '/', 
    '/about', 
    '/contact', 
    '/coming-soon', 
    '/list-product', 
    '/marketplace', 
    '/messages', 
    '/settings',
    '/policies',
    '/terms',
    '/nda-policy',
    '/fees-pricing'
  ];

  return (
    <div className="p-4 bg-gray-100 rounded">
      <h2 className="text-lg font-bold mb-4">Route Debugger</h2>
      <div className="space-y-2">
        {routes.map(route => (
          <Link 
            key={route} 
            to={route} 
            className="block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Navigate to {route}
          </Link>
        ))}
      </div>
    </div>
  );
};
