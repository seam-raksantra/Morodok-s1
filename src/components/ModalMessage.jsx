import React from 'react';
import { X } from 'lucide-react';
import '../styles/dashboard/modalMessage.css';

const ModalMessage = ({ open, title, message, type = 'info', onClose, onConfirm, cancelText = 'Cancel', confirmText = 'Confirm' }) => {
  if (!open) return null;

  const colors = {
    info: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-message" onClick={e => e.stopPropagation()} style={{ borderTop: `6px solid ${colors[type]}` }}>
        <div className="modal-header">
          <h3>{title || 'Message'}</h3>
          <X className="close-icon" onClick={onClose} />
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          {onConfirm && (
            <button className="btn-primary" onClick={onConfirm}>{confirmText}</button>
          )}
          <button className="btn-secondary" onClick={onClose}>{cancelText}</button>
        </div>
      </div>
    </div>
  );
};

export default ModalMessage;