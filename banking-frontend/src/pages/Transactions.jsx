import React, { useEffect, useState } from 'react';
import { History, Search, Eye, X, Filter, Calendar } from 'lucide-react';
import { transactionAPI } from '../services/api';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const [selectedTxn, setSelectedTxn] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [alert, setAlert] = useState({ type: '', msg: '' });

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await transactionAPI.getAll();
      const sorted = (res.data || []).reverse();
      setTransactions(sorted);
      setFiltered(sorted);
    } catch {
      setAlert({ type: 'error', msg: 'Failed to load transaction audit logs. Is backend running?' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(transactions.filter(t => {
      const matchesSearch =
        t.transactionId?.toString().includes(q) ||
        t.senderAccountNumber?.toLowerCase().includes(q) ||
        t.receiverAccountNumber?.toLowerCase().includes(q) ||
        t.remarks?.toLowerCase().includes(q);

      const matchesType = typeFilter === 'ALL' || t.transactionType?.toUpperCase() === typeFilter;
      return matchesSearch && matchesType;
    }));
  }, [search, typeFilter, transactions]);

  const openDetails = (t) => {
    setSelectedTxn(t);
    setShowDetailsModal(true);
  };

  return (
    <div>
      <Alert type={alert.type} message={alert.msg} onClose={() => setAlert({ type: '', msg: '' })} />

      <div className="content-card">
        <div className="card-header-bar flex-wrap gap-3">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="stat-icon-wrapper purple" style={{ width: 38, height: 38, fontSize: 18 }}>
              <History size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0 }}>Transaction Ledger Logs</h3>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Total Logs: {filtered.length}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={16} color="#64748b" />
              <select
                className="form-control-custom"
                style={{ width: 150, padding: '9px 12px' }}
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
              >
                <option value="ALL">All Types</option>
                <option value="DEPOSIT">Deposits</option>
                <option value="WITHDRAW">Withdrawals</option>
                <option value="TRANSFER">Transfers</option>
              </select>
            </div>

            <div className="search-container">
              <Search className="search-icon-inside" size={16} />
              <input
                type="text"
                className="form-control-custom"
                placeholder="Search ID, account, remarks..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading ? <Spinner /> : filtered.length === 0 ? (
          <div className="empty-box">
            <div className="empty-icon"><History /></div>
            <h4>No transactions match your search</h4>
            <p>{search || typeFilter !== 'ALL' ? 'Try adjusting your filter criteria.' : 'Transactions will appear here once executed.'}</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="banking-table">
              <thead>
                <tr>
                  <th>Txn ID</th>
                  <th>Transaction Type</th>
                  <th>Amount</th>
                  <th>Sender Account</th>
                  <th>Receiver Account</th>
                  <th>Remarks</th>
                  <th>Date & Time</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => (
                  <tr key={t.transactionId}>
                    <td style={{ fontWeight: 700, color: '#0f172a' }}>#{t.transactionId}</td>
                    <td>
                      <span className={`badge-status ${t.transactionType?.toLowerCase()}`}>
                        {t.transactionType}
                      </span>
                    </td>
                    <td style={{
                      fontWeight: 800,
                      fontSize: '15px',
                      color: t.transactionType === 'DEPOSIT' ? '#10b981' : t.transactionType === 'WITHDRAW' ? '#ef4444' : '#1e40af'
                    }}>
                      ₹{Number(t.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ fontWeight: 600, color: t.senderAccountNumber ? '#1e40af' : '#94a3b8' }}>
                      {t.senderAccountNumber || '—'}
                    </td>
                    <td style={{ fontWeight: 600, color: t.receiverAccountNumber ? '#1e40af' : '#94a3b8' }}>
                      {t.receiverAccountNumber || '—'}
                    </td>
                    <td style={{ color: '#64748b', fontSize: '13px' }}>{t.remarks || '—'}</td>
                    <td style={{ color: '#94a3b8', fontSize: '12px' }}>
                      {t.transactionDate ? new Date(t.transactionDate).toLocaleString('en-IN') : '—'}
                    </td>
                    <td>
                      <button className="btn-view-sm" onClick={() => openDetails(t)}>
                        <Eye size={14} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedTxn && (
        <div className="modal-backdrop-custom" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-dialog-custom" onClick={e => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h3>Transaction Detail Summary</h3>
              <button className="modal-close-btn" onClick={() => setShowDetailsModal(false)}><X size={18} /></button>
            </div>
            <div className="modal-body-custom">
              <div style={{ textAlign: 'center', padding: '16px 0 24px', borderBottom: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: '#64748b', fontWeight: 700 }}>
                  Transaction ID
                </div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                  #{selectedTxn.transactionId}
                </div>
                <div style={{ marginTop: '8px' }}>
                  <span className={`badge-status ${selectedTxn.transactionType?.toLowerCase()}`}>
                    {selectedTxn.transactionType}
                  </span>
                </div>
              </div>

              <div className="details-grid mb-4">
                <div className="detail-item">
                  <div className="label">Amount</div>
                  <div className="val" style={{
                    color: selectedTxn.transactionType === 'DEPOSIT' ? '#10b981' : selectedTxn.transactionType === 'WITHDRAW' ? '#ef4444' : '#1e40af'
                  }}>
                    ₹{Number(selectedTxn.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="detail-item">
                  <div className="label"><Calendar size={12} /> Timestamp</div>
                  <div className="val" style={{ fontSize: '13px' }}>
                    {selectedTxn.transactionDate ? new Date(selectedTxn.transactionDate).toLocaleString('en-IN') : 'N/A'}
                  </div>
                </div>
                <div className="detail-item">
                  <div className="label">Sender Account</div>
                  <div className="val">{selectedTxn.senderAccountNumber || 'N/A (Cash / Deposit)'}</div>
                </div>
                <div className="detail-item">
                  <div className="label">Receiver Account</div>
                  <div className="val">{selectedTxn.receiverAccountNumber || 'N/A (Cash / Withdrawal)'}</div>
                </div>
              </div>

              <div className="detail-item" style={{ gridColumn: 'span 2' }}>
                <div className="label">Narration / Remarks</div>
                <div className="val">{selectedTxn.remarks || 'No remarks entered'}</div>
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
