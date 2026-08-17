import React, { useEffect, useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Eye,
  Edit2,
  Trash2,
  X,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react';
import { customerAPI, accountAPI } from '../services/api';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';

const emptyForm = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  dateOfBirth: ''
};

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ type: '', msg: '' });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cRes, aRes] = await Promise.all([
        customerAPI.getAll(),
        accountAPI.getAll()
      ]);
      setCustomers(cRes.data || []);
      setFiltered(cRes.data || []);
      setAccounts(aRes.data || []);
    } catch {
      showAlert('error', 'Failed to fetch customer records. Ensure backend is active.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(customers.filter(c =>
      c.fullName?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.includes(q) ||
      c.customerId?.toString().includes(q)
    ));
  }, [search, customers]);

  const showAlert = (type, msg) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert({ type: '', msg: '' }), 4000);
  };

  const openAdd = () => {
    setForm(emptyForm);
    setEditId(null);
    setErrors({});
    setShowFormModal(true);
  };

  const openEdit = (c) => {
    setForm({
      fullName: c.fullName || '',
      email: c.email || '',
      phone: c.phone || '',
      address: c.address || '',
      dateOfBirth: c.dateOfBirth || ''
    });
    setEditId(c.customerId);
    setErrors({});
    setShowFormModal(true);
  };

  const openDetails = (c) => {
    setSelectedCustomer(c);
    setShowDetailsModal(true);
  };

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!form.email.trim()) errs.email = 'Email Address is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email address format';
    if (!form.phone.trim()) errs.phone = 'Phone Number is required';
    if (!form.dateOfBirth) errs.dateOfBirth = 'Date of Birth is required';
    return errs;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setSaving(true);
    try {
      if (editId) {
        await customerAPI.update(editId, form);
        showAlert('success', `Customer "${form.fullName}" updated successfully!`);
      } else {
        await customerAPI.create(form);
        showAlert('success', `Customer "${form.fullName}" created successfully!`);
      }
      setShowFormModal(false);
      fetchData();
    } catch (err) {
      showAlert('error', err.response?.data?.message || 'Failed to save customer');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete customer "${name}" (ID: #${id})?`)) return;
    try {
      await customerAPI.delete(id);
      showAlert('success', `Customer "${name}" deleted.`);
      fetchData();
    } catch (err) {
      showAlert('error', err.response?.data?.message || 'Delete operation failed.');
    }
  };

  // Filter linked accounts for selected customer
  const customerLinkedAccounts = selectedCustomer
    ? accounts.filter(a => a.customerId === selectedCustomer.customerId)
    : [];

  return (
    <div>
      <Alert type={alert.type} message={alert.msg} onClose={() => setAlert({ type: '', msg: '' })} />

      <div className="content-card">
        <div className="card-header-bar flex-wrap gap-3">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="stat-icon-wrapper blue" style={{ width: 38, height: 38, fontSize: 18 }}>
              <Users size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0 }}>Customer Directory</h3>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Total Customers: {filtered.length}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="search-container">
              <Search className="search-icon-inside" size={16} />
              <input
                type="text"
                className="form-control-custom"
                placeholder="Search name, email, phone..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button className="btn-blue" onClick={openAdd}>
              <UserPlus size={16} /> Add Customer
            </button>
          </div>
        </div>

        {loading ? <Spinner /> : filtered.length === 0 ? (
          <div className="empty-box">
            <div className="empty-icon"><Users /></div>
            <h4>No customer records found</h4>
            <p>{search ? 'Try adjusting your search filter.' : 'Click "Add Customer" to register a new customer.'}</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="banking-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Date of Birth</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.customerId}>
                    <td style={{ fontWeight: 700, color: '#0f172a' }}>#{c.customerId}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="avatar-circle">
                          {c.fullName ? c.fullName.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{c.fullName}</div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>{c.address || 'No address specified'}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: '#334155', fontWeight: 500 }}>{c.email}</td>
                    <td style={{ color: '#334155', fontWeight: 500 }}>{c.phone}</td>
                    <td style={{ color: '#64748b', fontSize: '13px' }}>{c.dateOfBirth || '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn-view-sm" onClick={() => openDetails(c)}>
                          <Eye size={14} /> View
                        </button>
                        <button className="btn-edit-sm" onClick={() => openEdit(c)}>
                          <Edit2 size={14} /> Edit
                        </button>
                        <button className="btn-danger-sm" onClick={() => handleDelete(c.customerId, c.fullName)}>
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

      {/* Add / Edit Modal */}
      {showFormModal && (
        <div className="modal-backdrop-custom" onClick={() => setShowFormModal(false)}>
          <div className="modal-dialog-custom" onClick={e => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h3>{editId ? 'Edit Customer Details' : 'Register New Customer'}</h3>
              <button className="modal-close-btn" onClick={() => setShowFormModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body-custom">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label-custom">Full Name *</label>
                    <input
                      type="text"
                      className={`form-control-custom ${errors.fullName ? 'is-invalid' : ''}`}
                      placeholder="e.g. John Doe"
                      value={form.fullName}
                      onChange={e => setForm({ ...form, fullName: e.target.value })}
                    />
                    {errors.fullName && <div className="invalid-feedback-custom">{errors.fullName}</div>}
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label-custom">Email Address *</label>
                    <input
                      type="email"
                      className={`form-control-custom ${errors.email ? 'is-invalid' : ''}`}
                      placeholder="john.doe@example.com"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                    />
                    {errors.email && <div className="invalid-feedback-custom">{errors.email}</div>}
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label-custom">Phone Number *</label>
                    <input
                      type="text"
                      className={`form-control-custom ${errors.phone ? 'is-invalid' : ''}`}
                      placeholder="+91 9876543210"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                    />
                    {errors.phone && <div className="invalid-feedback-custom">{errors.phone}</div>}
                  </div>

                  <div className="col-12">
                    <label className="form-label-custom">Date of Birth *</label>
                    <input
                      type="date"
                      className={`form-control-custom ${errors.dateOfBirth ? 'is-invalid' : ''}`}
                      value={form.dateOfBirth}
                      onChange={e => setForm({ ...form, dateOfBirth: e.target.value })}
                    />
                    {errors.dateOfBirth && <div className="invalid-feedback-custom">{errors.dateOfBirth}</div>}
                  </div>

                  <div className="col-12">
                    <label className="form-label-custom">Full Residential Address</label>
                    <textarea
                      className="form-control-custom"
                      rows={2}
                      placeholder="Street name, City, State, ZIP code"
                      value={form.address}
                      onChange={e => setForm({ ...form, address: e.target.value })}
                      style={{ resize: 'none' }}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer-custom">
                <button type="button" className="btn-secondary-custom" onClick={() => setShowFormModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-blue" disabled={saving}>
                  {saving ? 'Saving...' : editId ? 'Save Changes' : 'Create Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedCustomer && (
        <div className="modal-backdrop-custom" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-dialog-custom" onClick={e => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h3>Customer Profile Details</h3>
              <button className="modal-close-btn" onClick={() => setShowDetailsModal(false)}><X size={18} /></button>
            </div>
            <div className="modal-body-custom">
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div className="avatar-circle" style={{ width: 56, height: 56, fontSize: 22 }}>
                  {selectedCustomer.fullName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontWeight: 800, color: '#0f172a' }}>{selectedCustomer.fullName}</h4>
                  <div style={{ fontSize: '13px', color: '#2563eb', fontWeight: 600 }}>Customer ID: #{selectedCustomer.customerId}</div>
                </div>
              </div>

              <div className="details-grid mb-4">
                <div className="detail-item">
                  <div className="label"><Mail size={12} /> Email</div>
                  <div className="val">{selectedCustomer.email}</div>
                </div>
                <div className="detail-item">
                  <div className="label"><Phone size={12} /> Phone</div>
                  <div className="val">{selectedCustomer.phone}</div>
                </div>
                <div className="detail-item">
                  <div className="label"><Calendar size={12} /> Date of Birth</div>
                  <div className="val">{selectedCustomer.dateOfBirth || 'N/A'}</div>
                </div>
                <div className="detail-item">
                  <div className="label"><MapPin size={12} /> Address</div>
                  <div className="val">{selectedCustomer.address || 'N/A'}</div>
                </div>
              </div>

              <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
                Linked Bank Accounts ({customerLinkedAccounts.length})
              </h4>
              {customerLinkedAccounts.length === 0 ? (
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '10px', fontSize: '13px', color: '#64748b', textAlign: 'center' }}>
                  No active accounts registered for this customer.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {customerLinkedAccounts.map(acc => (
                    <div key={acc.accountId} style={{
                      padding: '12px 16px',
                      background: '#f8fafc',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '14px', color: '#2563eb' }}>{acc.accountNumber}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{acc.accountType} Account</div>
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '15px', color: '#10b981' }}>
                        ₹{Number(acc.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
