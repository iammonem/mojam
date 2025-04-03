'use client';

import React from 'react';
import App from './page';

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <App />
      </body>
    </html>
  );
}
