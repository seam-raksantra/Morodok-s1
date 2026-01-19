import React, { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';

const PromoCodes = ({ promoCodes, onCreate, onDelete }) => {
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    onCreate({ code, discount });
    setCode('');
    setDiscount('');
  };

  return (
    <div className="admin-content-header-area">
      <div className="breadcrumb">Marketing &gt; Promo Codes</div>
      <div className="content-title-row">
        <h2>Promo Codes</h2>
      </div>

      <div className="data-card">
        <form onSubmit={handleSubmit} className="form-inline" style={{ marginBottom: 20 }}>
          <input
            type="text"
            placeholder="Promo Code"
            value={code}
            required
            onChange={e => setCode(e.target.value)}
          />
          <input
            type="number"
            placeholder="Discount %"
            value={discount}
            required
            onChange={e => setDiscount(e.target.value)}
          />
          <button className="btn-primary">
            <Plus size={16} /> Add
          </button>
        </form>

        <div className="table-responsive">
          <table className="admin-data-tables">
            <thead>
              <tr>
                <th>ID</th>
                <th>Code</th>
                <th>Discount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {promoCodes.map(p => (
                <tr key={p.id}>
                  <td>#{p.id}</td>
                  <td>{p.code}</td>
                  <td>{p.discount}%</td>
                  <td className="action-cell">
                    <button className="btn-delete-icon" onClick={() => onDelete(p.id)}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PromoCodes;