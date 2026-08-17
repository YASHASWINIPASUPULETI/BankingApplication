import React from 'react';
import { useLocation } from 'react-router-dom';

const routeInfo = {
  '/': { title: 'Executive Dashboard', subtitle: 'Real-time overview of bank metrics and statistics' },
  '/customers': { title: 'Customer Management', subtitle: 'View, add, edit, and manage customer records' },
  '/accounts': { title: 'Account Management', subtitle: 'Manage active customer savings & current accounts' },
  '/deposit': { title: 'Cash Deposit', subtitle: 'Process instant credit deposits to customer accounts' },
  '/withdraw': { title: 'Cash Withdrawal', subtitle: 'Process secure debit withdrawals from accounts' },
  '/transfer': { title: 'Fund Transfer', subtitle: 'Transfer funds between active bank accounts' },
  '/transactions': { title: 'Transaction History', subtitle: 'Audit log of all banking operations' },
};

export default function Navbar() {
  const location = useLocation();
  const info = routeInfo[location.pathname] || { title: 'NexaBank Console', subtitle: 'Enterprise Banking Suite' };

  return (
    <header className="top-navbar">
      <div className="page-title-box">
        <h1>{info.title}</h1>
        <p>{info.subtitle}</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div className="status-pill">
          <span className="status-dot" />
          API Connected (localhost:8080)
        </div>
      </div>
    </header>
  );
}
