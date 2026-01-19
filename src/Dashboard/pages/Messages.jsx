import React from 'react';
import { Trash2, MailOpen, X } from 'lucide-react';

const Messages = ({ messages, onDelete }) => {
  return (
    <div className="admin-content-header-area">
      <div className="breadcrumb">Sales & Leads &gt; Messages</div>
      <div className="content-title-row">
        <h2>Customer Inquiries</h2>
      </div>

      <div className="data-card">
        {messages.length === 0 ? (
          <div className="no-data-states">
            <div className="empty-icon-circle"><X size={24} /></div>
            <p>No Messages yet</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-data-tables">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {messages.map(msg => (
                  <tr key={msg.id}>
                    <td>#{msg.id}</td>
                    <td>{msg.name}</td>
                    <td>{msg.email}</td>
                    <td style={{ maxWidth: 300 }}>{msg.message}</td>
                    <td>{new Date(msg.created_at).toLocaleDateString()}</td>
                    <td className="action-cell">
                      <button className="btn-delete-icon" onClick={() => onDelete(msg.id)}>
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

export default Messages;