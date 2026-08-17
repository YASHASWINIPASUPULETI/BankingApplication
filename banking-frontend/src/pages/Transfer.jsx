import React, { useEffect, useState } from 'react';
import { ArrowRightLeft, CheckCircle2 } from 'lucide-react';
import { transactionAPI, accountAPI } from '../services/api';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';

export default function Transfer() {
  const [form, setForm] = useState({
    senderAccountNumber: '',
    receiverAccountNumber: '',
    amount: '',
    remarks: ''
  });
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
    if (!form.senderAccountNumber.trim()) errs.senderAccountNumber = 'Sender Account is required';
    if (!form.receiverAccountNumber.trim()) errs.receiverAccountNumber = 'Receiver Account is required';

    if (form.senderAccountNumber.trim() === form.receiverAccountNumber.trim() && form.senderAccountNumber.trim() !== '') {
      errs.receiverAccountNumber = 'Sender and Receiver accounts cannot be identical';
    }

    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
      errs.amount = 'Transfer Amount must be a positive number';
    }

    const senderAcc = accounts.find(a => a.accountNumber === form.senderAccountNumber.trim());
    if (senderAcc && Number(form.amount) > Number(senderAcc.balance)) {
      errs.amount = `Sender account has insufficient balance (Available: ₹${Number(senderAcc.balance).toLocaleString('en-IN')})`;
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
        senderAccountNumber: form.senderAccountNumber.trim(),
        receiverAccountNumber: form.receiverAccountNumber.trim(),
        amount: Number(form.amount),
        remarks: form.remarks.trim() || 'Fund Transfer'
      };

      const res = await transactionAPI.transfer(payload);
      const data = res.data;

      setLastReceipt({
        transactionId: data.transactionId,
        senderAccountNumber: form.senderAccountNumber,
        receiverAccountNumber: form.receiverAccountNumber,
        amount: Number(form.amount),
        remarks: data.remarks || 'Fund Transfer',
        date: data.transactionDate || new Date().toISOString()
      });

      setAlert({
        type: 'success',
        msg: `Transfer of ₹${Number(form.amount).toLocaleString('en-IN')} from ${form.senderAccountNumber} to ${form.receiverAccountNumber} completed successfully!`
      });

      setForm({ senderAccountNumber: '', receiverAccountNumber: '', amount: '', remarks: '' });
      accountAPI.getAll().then(r => setAccounts(r.data || []));
    } catch (err) {
      setAlert({
        type: 'error',
        msg: err.response?.data?.message || 'Transfer failed. Verify account details and balances.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return <Spinner />;

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <Alert type={alert.type} message={alert.msg} onClose={() => setAlert({ type: '', msg: '' })} />

      {lastReceipt && (
        <div className="content-card mb-4" style={{ borderLeft: '4px solid #2563eb', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <CheckCircle2 size={24} color="#2563eb" />
            <h4 style={{ margin: 0, fontWeight: 800, color: '#0f172a' }}>Transfer Receipt</h4>
          </div>
          <div className="details-grid">
            <div className="detail-item">
              <div className="label">Transaction ID</div>
              <div className="val">#{lastReceipt.transactionId}</div>
            </div>
            <div className="detail-item">
              <div className="label">Amount Transferred</div>
              <div className="val" style={{ color: '#2563eb' }}>
                ₹{lastReceipt.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="detail-item">
              <div className="label">Sender Account</div>
              <div className="val">{lastReceipt.senderAccountNumber}</div>
            </div>
            <div className="detail-item">
              <div className="label">Receiver Account</div>
              <div className="val">{lastReceipt.receiverAccountNumber}</div>
            </div>
          </div>
        </div>
      )}

      <div className="form-box">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
          <div className="stat-icon-wrapper blue" style={{ width: 44, height: 44 }}>
            <ArrowRightLeft size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Fund Transfer Between Accounts
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
              Transfer money atomically between active bank accounts.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row g-3 mb-3">
            <div className="col-12 col-md-6">
              <label className="form-label-custom">Sender Account Number *</label>
              {accounts.length > 0 && (
                <select
                  className="form-control-custom mb-2"
                  value={form.senderAccountNumber}
                  onChange={e => setForm({ ...form, senderAccountNumber: e.target.value })}
                >
                  <option value="">-- Select Sender Account --</option>
                  {accounts.map(a => (
                    <option key={a.accountId} value={a.accountNumber}>
                      {a.accountNumber} ({a.customerName} - Bal: ₹{Number(a.balance).toLocaleString('en-IN')})
                    </option>
                  ))}
                </select>
              )}
              <input
                type="text"
                className={`form-control-custom ${errors.senderAccountNumber ? 'is-invalid' : ''}`}
                placeholder="Sender Account No..."
                value={form.senderAccountNumber}
                onChange={e => setForm({ ...form, senderAccountNumber: e.target.value })}
              />
              {errors.senderAccountNumber && <div className="invalid-feedback-custom">{errors.senderAccountNumber}</div>}
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label-custom">Receiver Account Number *</label>
              {accounts.length > 0 && (
                <select
                  className="form-control-custom mb-2"
                  value={form.receiverAccountNumber}
                  onChange={e => setForm({ ...form, receiverAccountNumber: e.target.value })}
                >
                  <option value="">-- Select Receiver Account --</option>
                  {accounts.map(a => (
                    <option key={a.accountId} value={a.accountNumber}>
                      {a.accountNumber} ({a.customerName})
                    </option>
                  ))}
                </select>
              )}
              <input
                type="text"
                className={`form-control-custom ${errors.receiverAccountNumber ? 'is-invalid' : ''}`}
                placeholder="Receiver Account No..."
                value={form.receiverAccountNumber}
                onChange={e => setForm({ ...form, receiverAccountNumber: e.target.value })}
              />
              {errors.receiverAccountNumber && <div className="invalid-feedback-custom">{errors.receiverAccountNumber}</div>}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label-custom">Transfer Amount (₹) *</label>
            <input
              type="number"
              step="0.01"
              className={`form-control-custom ${errors.amount ? 'is-invalid' : ''}`}
              placeholder="e.g. 5000.00"
              value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
            />
            {errors.amount && <div className="invalid-feedback-custom">{errors.amount}</div>}
          </div>

          <div className="mb-4">
            <label className="form-label-custom">Remarks / Payment Reference</label>
            <input
              type="text"
              className="form-control-custom"
              placeholder="e.g. Vendor Payment / Monthly Allowance"
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
            {loading ? 'Processing Transfer...' : 'Execute Fund Transfer'}
          </button>
        </form>
      </div>
    </div>
  );
}
