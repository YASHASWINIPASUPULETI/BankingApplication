import React, { useEffect, useState } from 'react';
import { ArrowDownLeft, CheckCircle2 } from 'lucide-react';
import { transactionAPI, accountAPI } from '../services/api';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';

export default function Deposit() {
  const [form, setForm] = useState({ accountNumber: '', amount: '', remarks: '' });
  const [accounts, setAccounts] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', msg: '' });
  const [lastReceipt, setLastReceipt] = useState(null);

  useEffect(() => {
    accountAPI.getAll()
      .then(res => setAccounts(res.data || []))
      .catch(() => {})
      .finally(() => setPageLoading(false));
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.accountNumber.trim()) errs.accountNumber = 'Account Number is required';
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
      errs.amount = 'Deposit Amount must be a positive number';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setErrors({});
    setLastReceipt(null);

    try {
      const payload = {
        accountNumber: form.accountNumber.trim(),
        amount: Number(form.amount),
        remarks: form.remarks.trim() || 'Cash Deposit'
      };

      const res = await transactionAPI.deposit(payload);
      const data = res.data;

      setLastReceipt({
        transactionId: data.transactionId,
        accountNumber: form.accountNumber,
        amount: Number(form.amount),
        remarks: data.remarks || 'Cash Deposit',
        date: data.transactionDate || new Date().toISOString()
      });

      setAlert({
        type: 'success',
        msg: `Deposit of ₹${Number(form.amount).toLocaleString('en-IN')} completed successfully for Account ${form.accountNumber}!`
      });

      setForm({ accountNumber: '', amount: '', remarks: '' });
      // Refresh accounts list
      accountAPI.getAll().then(r => setAccounts(r.data || []));
    } catch (err) {
      setAlert({
        type: 'error',
        msg: err.response?.data?.message || 'Deposit failed. Please verify the account number.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return <Spinner />;

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <Alert type={alert.type} message={alert.msg} onClose={() => setAlert({ type: '', msg: '' })} />

      {lastReceipt && (
        <div className="content-card mb-4" style={{ borderLeft: '4px solid #10b981', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <CheckCircle2 size={24} color="#10b981" />
            <h4 style={{ margin: 0, fontWeight: 800, color: '#0f172a' }}>Deposit Receipt</h4>
          </div>
          <div className="details-grid">
            <div className="detail-item">
              <div className="label">Transaction ID</div>
              <div className="val">#{lastReceipt.transactionId}</div>
            </div>
            <div className="detail-item">
              <div className="label">Target Account</div>
              <div className="val" style={{ color: '#1e40af' }}>{lastReceipt.accountNumber}</div>
            </div>
            <div className="detail-item">
              <div className="label">Amount Credited</div>
              <div className="val" style={{ color: '#10b981' }}>
                ₹{lastReceipt.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="detail-item">
              <div className="label">Remarks</div>
              <div className="val">{lastReceipt.remarks}</div>
            </div>
          </div>
        </div>
      )}

      <div className="form-box">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
          <div className="stat-icon-wrapper green" style={{ width: 44, height: 44 }}>
            <ArrowDownLeft size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Process Cash Deposit
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
              Enter target account details to credit funds.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label-custom">Target Account Number *</label>
            {accounts.length > 0 && (
              <select
                className="form-control-custom mb-2"
                value={form.accountNumber}
                onChange={e => setForm({ ...form, accountNumber: e.target.value })}
              >
                <option value="">-- Quick Select Active Account --</option>
                {accounts.map(a => (
                  <option key={a.accountId} value={a.accountNumber}>
                    {a.accountNumber} — {a.customerName} (Bal: ₹{Number(a.balance).toLocaleString('en-IN')})
                  </option>
                ))}
              </select>
            )}
            <input
              type="text"
              className={`form-control-custom ${errors.accountNumber ? 'is-invalid' : ''}`}
              placeholder="Or type 12-digit account number..."
              value={form.accountNumber}
              onChange={e => setForm({ ...form, accountNumber: e.target.value })}
            />
            {errors.accountNumber && <div className="invalid-feedback-custom">{errors.accountNumber}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label-custom">Deposit Amount (₹) *</label>
            <input
              type="number"
              step="0.01"
              className={`form-control-custom ${errors.amount ? 'is-invalid' : ''}`}
              placeholder="e.g. 2500.00"
              value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
            />
            {errors.amount && <div className="invalid-feedback-custom">{errors.amount}</div>}
          </div>

          <div className="mb-4">
            <label className="form-label-custom">Remarks / Narration</label>
            <input
              type="text"
              className="form-control-custom"
              placeholder="e.g. Counter Cash Deposit"
              value={form.remarks}
              onChange={e => setForm({ ...form, remarks: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="btn-blue w-100"
            style={{ padding: '12px', justifyContent: 'center', fontSize: '15px' }}
            disabled={loading}
          >
            {loading ? 'Executing Deposit...' : 'Confirm Cash Deposit'}
          </button>
        </form>
      </div>
    </div>
  );
}
