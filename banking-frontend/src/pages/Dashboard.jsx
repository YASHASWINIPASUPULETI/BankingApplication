import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Building2,
  Wallet,
  History,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRightLeft,
  UserPlus,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { customerAPI, accountAPI, transactionAPI } from '../services/api';
import Spinner from '../components/Spinner';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalAccounts: 0,
    totalBalance: 0,
    totalTransactions: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [custRes, accRes, txnRes] = await Promise.all([
        customerAPI.getAll(),
        accountAPI.getAll(),
        transactionAPI.getAll(),
      ]);

      const customers = custRes.data || [];
      const accounts = accRes.data || [];
      const txns = txnRes.data || [];

      const sumBalance = accounts.reduce((acc, current) => acc + (Number(current.balance) || 0), 0);

      setStats({
        totalCustomers: customers.length,
        totalAccounts: accounts.length,
        totalBalance: sumBalance,
        totalTransactions: txns.length,
      });

      setRecentTransactions([...txns].reverse().slice(0, 6));
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <Spinner />;

  const statCards = [
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: <Users size={24} />,
      colorClass: 'blue',
      formatter: (v) => v.toLocaleString('en-IN'),
    },
    {
      title: 'Active Accounts',
      value: stats.totalAccounts,
      icon: <Building2 size={24} />,
      colorClass: 'sky',
      formatter: (v) => v.toLocaleString('en-IN'),
    },
    {
      title: 'Total Balance Held',
      value: stats.totalBalance,
      icon: <Wallet size={24} />,
      colorClass: 'green',
      formatter: (v) => `₹${v.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
    {
      title: 'Total Transactions',
      value: stats.totalTransactions,
      icon: <History size={24} />,
      colorClass: 'purple',
      formatter: (v) => v.toLocaleString('en-IN'),
    },
  ];

  const quickActions = [
    { label: 'Deposit Money', desc: 'Credit funds to account', to: '/deposit', icon: <ArrowDownLeft size={20} color="#10b981" />, bg: '#ecfdf5' },
    { label: 'Withdraw Money', desc: 'Debit funds from account', to: '/withdraw', icon: <ArrowUpRight size={20} color="#ef4444" />, bg: '#fef2f2' },
    { label: 'Transfer Funds', desc: 'Move funds between accounts', to: '/transfer', icon: <ArrowRightLeft size={20} color="#2563eb" />, bg: '#eff6ff' },
    { label: 'New Customer', desc: 'Register a new customer', to: '/customers', icon: <UserPlus size={20} color="#0284c7" />, bg: '#f0f9ff' },
  ];

  return (
    <div>
      {/* Welcome Banner */}
      <div className="content-card mb-4" style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #1e40af 100%)',
        color: '#ffffff',
        padding: '32px',
        borderRadius: '16px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#93c5fd', fontWeight: 700, marginBottom: '6px' }}>
              Core Banking Platform
            </div>
            <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '6px', color: '#fff' }}>
              Enterprise Banking Dashboard
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '14px', maxWidth: '600px' }}>
              Real-time monitoring of active customers, bank accounts, liquidity, and ledger transactions.
            </p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="btn-secondary-custom"
            style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="row g-3 mb-4">
        {statCards.map((card, idx) => (
          <div key={idx} className="col-12 col-sm-6 col-xl-3">
            <div className="dashboard-stat-card">
              <div className="stat-header">
                <span className="stat-title">{card.title}</span>
                <div className={`stat-icon-wrapper ${card.colorClass}`}>
                  {card.icon}
                </div>
              </div>
              <div className="stat-number">{card.formatter(card.value)}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="row g-4">
        {/* Quick Actions */}
        <div className="col-12 col-lg-4">
          <div className="content-card h-100">
            <div className="card-header-bar">
              <h3>Quick Actions</h3>
            </div>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {quickActions.map((action, idx) => (
                <Link
                  key={idx}
                  to={action.to}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    background: '#ffffff',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease-in-out'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#3b82f6';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    background: action.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {action.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>{action.label}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{action.desc}</div>
                  </div>
                  <ArrowRight size={16} color="#94a3b8" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="col-12 col-lg-8">
          <div className="content-card h-100">
            <div className="card-header-bar">
              <h3>Recent Transactions</h3>
              <Link to="/transactions" style={{ fontSize: '13px', fontWeight: 700, color: '#2563eb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                View All History <ArrowRight size={14} />
              </Link>
            </div>
            {recentTransactions.length === 0 ? (
              <div className="empty-box">
                <div className="empty-icon"><History /></div>
                <h4>No transactions recorded</h4>
                <p>Transactions will appear here when deposits, withdrawals, or transfers occur.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="banking-table">
                  <thead>
                    <tr>
                      <th>Txn ID</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Sender</th>
                      <th>Receiver</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((t) => (
                      <tr key={t.transactionId}>
                        <td style={{ fontWeight: 700, color: '#0f172a' }}>#{t.transactionId}</td>
                        <td>
                          <span className={`badge-status ${t.transactionType?.toLowerCase()}`}>
                            {t.transactionType}
                          </span>
                        </td>
                        <td style={{
                          fontWeight: 800,
                          color: t.transactionType === 'DEPOSIT' ? '#10b981' : t.transactionType === 'WITHDRAW' ? '#ef4444' : '#1e40af'
                        }}>
                          ₹{Number(t.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td style={{ fontSize: '13px', color: '#64748b' }}>{t.senderAccountNumber || '—'}</td>
                        <td style={{ fontSize: '13px', color: '#64748b' }}>{t.receiverAccountNumber || '—'}</td>
                        <td style={{ fontSize: '12px', color: '#94a3b8' }}>
                          {t.transactionDate ? new Date(t.transactionDate).toLocaleDateString('en-IN') : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
