import React from 'react';
import { Trash2, CheckCircle, X } from 'lucide-react';

const Reviews = ({ reviews, onApprove, onDelete }) => {
  return (
    <div className="admin-content-header-area">
      <div className="breadcrumb">Marketing &gt; Reviews</div>
      <div className="content-title-row">
        <h2>User Reviews</h2>
      </div>

      <div className="data-card">
        {reviews.length === 0 ? (
          <div className="no-data-states">
            <div className="empty-icon-circle"><X size={24} /></div>
            <p>No Reviews yet</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-data-tables">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map(r => (
                  <tr key={r.id}>
                    <td>#{r.id}</td>
                    <td>{r.user_name}</td>
                    <td>{r.rating} ⭐</td>
                    <td style={{ maxWidth: 300 }}>{r.comment}</td>
                    <td>
                      <span className={`status-badge ${r.status}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="action-cell">
                      {r.status !== 'approved' && (
                        <button
                          className="btn-edit-icon"
                          onClick={() => onApprove(r.id)}
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                      <button
                        className="btn-delete-icon"
                        onClick={() => onDelete(r.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;