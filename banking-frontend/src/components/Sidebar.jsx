import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRightLeft,
  History,
  ShieldCheck
} from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-icon">
          <Building2 size={24} />
        </div>
        <div>
          <div className="brand-title">NexaBank</div>
          <div className="brand-subtitle">Core Banking</div>
        </div>
      </div>

      <div className="sidebar-menu">
        <div className="menu-group-label">Overview</div>
        <NavLink to="/" end className={({ isActive }) => `menu-link ${isActive ? 'active' : ''}`}>
          <span className="menu-icon"><LayoutDashboard size={18} /></span>
          Dashboard
        </NavLink>

        <div className="menu-group-label">Management</div>
        <NavLink to="/customers" className={({ isActive }) => `menu-link ${isActive ? 'active' : ''}`}>
          <span className="menu-icon"><Users size={18} /></span>
          Customers
        </NavLink>

        <NavLink to="/accounts" className={({ isActive }) => `menu-link ${isActive ? 'active' : ''}`}>
          <span className="menu-icon"><Building2 size={18} /></span>
          Accounts
        </NavLink>

        <div className="menu-group-label">Transactions</div>
        <NavLink to="/deposit" className={({ isActive }) => `menu-link ${isActive ? 'active' : ''}`}>
          <span className="menu-icon"><ArrowDownLeft size={18} /></span>
          Deposit
        </NavLink>

        <NavLink to="/withdraw" className={({ isActive }) => `menu-link ${isActive ? 'active' : ''}`}>
          <span className="menu-icon"><ArrowUpRight size={18} /></span>
          Withdraw
        </NavLink>

        <NavLink to="/transfer" className={({ isActive }) => `menu-link ${isActive ? 'active' : ''}`}>
          <span className="menu-icon"><ArrowRightLeft size={18} /></span>
          Transfer
        </NavLink>

        <NavLink to="/transactions" className={({ isActive }) => `menu-link ${isActive ? 'active' : ''}`}>
          <span className="menu-icon"><History size={18} /></span>
          Transaction History
        </NavLink>
      </div>

      <div className="sidebar-footer">
        <div className="user-badge">
          <div className="avatar-circle">AD</div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>Bank Admin</div>
            <div style={{ fontSize: 11, color: '#64748b' }}>admin@nexabank.com</div>
          </div>
        </div>
        <ShieldCheck size={18} color="#10b981" />
      </div>
    </aside>
  );
}
