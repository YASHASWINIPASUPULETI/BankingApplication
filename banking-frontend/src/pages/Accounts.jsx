import React, { useEffect, useState } from 'react';
import {
  Building2,
  PlusCircle,
  Search,
  Eye,
  Trash2,
  X,
  User,
  Wallet,
  Calendar,
  ShieldCheck
} from 'lucide-react';
import { accountAPI, customerAPI } from '../services/api';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const [form, setForm] = useState({ customerId: '', accountType: 'Savings', balance: '' });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ type: '', msg: '' });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [accRes, custRes] = await Promise.all([
        accountAPI.getAll(),
        customerAPI.getAll()
      ]);
      setAccounts(accRes.data || []);
      setFiltered(accRes.data || []);
      setCustomers(custRes.data || []);
    } catch {
      showAlert('error', 'Failed to load accounts. Ensure backend is active.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(accounts.filter(a =>
      a.accountNumber?.toLowerCase().includes(q) ||
      a.customerName?.toLowerCase().includes(q) ||
      a.accountType?.toLowerCase().includes(q) ||
      a.accountId?.toString().includes(q)
    ));
  }, [search, accounts]);

  const showAlert = (type, msg) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert({ type: '', msg: '' }), 4000);
  };

  const openCreate = () => {
    setForm({
      customerId: customers.length > 0 ? customers[0].customerId.toString() : '',
      accountType: 'Savings',
      balance: ''
    });
    setErrors({});
    setShowCreateModal(true);
  };

  const openDetails = (acc) => {
    setSelectedAccount(acc);
    setShowDetailsModal(true);
  };

  const validate = () => {
    const errs = {};
    if (!form.customerId) errs.customerId = 'Customer selection is required';
    if (!form.balance || isNaN(form.balance) || Number(form.balance) < 0) {
      errs.balance = 'Initial balance must be a non-negative number';
    }
    return errs;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        customerId: Number(form.customerId),
        accountType: form.accountType,
        balance: Number(form.balance)
      };
      await accountAPI.create(payload);
      showAlert('success', 'New bank account created successfully!');
      setShowCreateModal(false);
      fetchData();
    } catch (err) {
      showAlert('error', err.response?.data?.message || 'Failed to create account');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, accountNumber) => {
    if (!window.confirm(`Are you sure you want to delete account "${accountNumber}"?`)) return;
    try {
      await accountAPI.delete(id);
      showAlert('success', `Account "${accountNumber}" deleted successfully.`);
      fetchData();
    } catch (err) {
      showAlert('error', err.response?.data?.message || 'Delete operation failed.');
    }
  };

  return (
    <div>
      <Alert type={alert.type} message={alert.msg} onClose={() => setAlert({ type: '', msg: '' })} />

      <div className="content-card">
        <div className="card-header-bar flex-wrap gap-3">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="stat-icon-wrapper sky" style={{ width: 38, height: 38, fontSize: 18 }}>
              <Building2 size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0 }}>Accounts Registry</h3>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Total Active Accounts: {filtered.length}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="search-container">
              <Search className="search-icon-inside" size={16} />
              <input
                type="text"
                className="form-control-custom"
                placeholder="Search account no, holder..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button className="btn-blue" onClick={openCreate}>
              <PlusCircle size={16} /> Open New Account
            </button>
          </div>
        </div>

        {loading ? <Spinner /> : filtered.length === 0 ? (
          <div className="empty-box">
            <div className="empty-icon"><Building2 /></div>
            <h4>No accounts found</h4>
            <p>{search ? 'Try adjusting your search criteria.' : 'Click "Open New Account" to register an account.'}</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="banking-table">
              <thead>
                <tr>
                  <th>Account ID</th>
                  <th>Account Number</th>
                  <th>Account Holder</th>
                  <th>Type</th>
                  <th>Balance</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(acc => (
                  <tr key={acc.accountId}>
                    <td style={{ fontWeight: 700, color: '#0f172a' }}>#{acc.accountId}</td>
                    <td style={{ fontWeight: 800, color: '#1e40af', letterSpacing: '0.5px' }}>
                      {acc.accountNumber}
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>
                        {acc.customerName || `Customer #${acc.customerId}`}
                      </div>
                    </td>
                    <td>
                      <span className={`badge-status ${acc.accountType?.toLowerCase()}`}>
                        {acc.accountType}
                      </span>
                    </td>
                    <td style={{ fontWeight: 800, color: '#10b981', fontSize: '15px' }}>
                      ₹{Number(acc.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td>
                      <span className="badge-status active">{acc.accountStatus || 'ACTIVE'}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn-view-sm" onClick={() => openDetails(acc)}>
                          <Eye size={14} /> Details
                        </button>
                        <button className="btn-danger-sm" onClick={() => handleDelete(acc.accountId, acc.accountNumber)}>
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal-backdrop-custom" onClick={() => setShowCreateModal(false)}>
          <div className="modal-dialog-custom" onClick={e => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h3>Open New Bank Account</h3>
              <button className="modal-close-btn" onClick={() => setShowCreateModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body-custom">
                {customers.length === 0 ? (
                  <div className="alert-custom alert-error-custom mb-3">
                    No customers found. Please register a customer first before creating an account.
                  </div>
                ) : (
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label-custom">Select Account Holder (Customer) *</label>
                      <select
                        className={`form-control-custom ${errors.customerId ? 'is-invalid' : ''}`}
                        value={form.customerId}
                        onChange={e => setForm({ ...form, customerId: e.target.value })}
                      >
                        <option value="">-- Choose Customer --</option>
                        {customers.map(c => (
                          <option key={c.customerId} value={c.customerId}>
                            {c.fullName} (#{c.customerId} — {c.email})
                          </option>
                        ))}
                      </select>
                      {errors.customerId && <div className="invalid-feedback-custom">{errors.customerId}</div>}
                    </div>

                    <div className="col-12">
                      <label className="form-label-custom">Account Type *</label>
                      <select
                        className="form-control-custom"
                        value={form.accountType}
                        onChange={e => setForm({ ...form, accountType: e.target.value })}
                      >
                        <option value="Savings">Savings Account</option>
                        <option value="Current">Current Account</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label-custom">Initial Opening Deposit Balance (₹) *</label>
                      <input
                        type="number"
                        step="0.01"
                        className={`form-control-custom ${errors.balance ? 'is-invalid' : ''}`}
                        placeholder="e.g. 5000"
                        value={form.balance}
                        onChange={e => setForm({ ...form, balance: e.target.value })}
                      />
                      {errors.balance && <div className="invalid-feedback-custom">{errors.balance}</div>}
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer-custom">
                <button type="button" className="btn-secondary-custom" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-blue" disabled={saving || customers.length === 0}>
                  {saving ? 'Processing...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedAccount && (
        <div className="modal-backdrop-custom" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-dialog-custom" onClick={e => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h3>Account Record Overview</h3>
              <button className="modal-close-btn" onClick={() => setShowDetailsModal(false)}><X size={18} /></button>
            </div>
            <div className="modal-body-custom">
              <div style={{ textAlign: 'center', padding: '16px 0 24px', borderBottom: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: '#64748b', fontWeight: 700 }}>
                  Account Number
                </div>
                <div style={{ fontSize: '26px', fontWeight: 800, color: '#1e40af', letterSpacing: '1px', marginTop: '4px' }}>
                  {selectedAccount.accountNumber}
                </div>
                <div style={{ marginTop: '8px' }}>
                  <span className={`badge-status ${selectedAccount.accountType?.toLowerCase()}`}>
                    {selectedAccount.accountType} Account
                  </span>
                </div>
              </div>

              <div className="details-grid">
                <div className="detail-item">
                  <div className="label"><User size={12} /> Account Holder</div>
                  <div className="val">{selectedAccount.customerName || `ID: #${selectedAccount.customerId}`}</div>
                </div>
                <div className="detail-item">
                  <div className="label"><Wallet size={12} /> Available Balance</div>
                  <div className="val" style={{ color: '#10b981' }}>
                    ₹{Number(selectedAccount.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="detail-item">
                  <div className="label"><ShieldCheck size={12} /> Account Status</div>
                  <div className="val">{selectedAccount.accountStatus || 'ACTIVE'}</div>
                </div>
                <div className="detail-item">
                  <div className="label"><Calendar size={12} /> Created Date</div>
                  <div className="val">
                    {selectedAccount.createdAt ? new Date(selectedAccount.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer-custom">
              <button className="btn-secondary-custom" onClick={() => setShowDetailsModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
