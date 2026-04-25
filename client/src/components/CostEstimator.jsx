import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calculator, Calendar, PlusCircle } from 'lucide-react';

const CostEstimator = ({ selectedModel, apiUrl, rooms, handleRoomToggle }) => {
  const [sqFt, setSqFt] = useState('');
  const [quality, setQuality] = useState('standard');
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedModel) {
      setSqFt(selectedModel.defaultSqFt);
      fetchEstimate(selectedModel.defaultSqFt, 'standard', rooms);
    }
  }, [selectedModel, rooms]);

  const fetchEstimate = async (area, matQuality, currentRooms) => {
    setLoading(true);
    try {
      const res = await axios.post(`${apiUrl}/estimate`, {
        modelId: selectedModel.id,
        squareFootage: Number(area),
        materialQuality: matQuality,
        rooms: currentRooms
      });
      setEstimate(res.data);
    } catch (err) {
      console.error("Error fetching estimate", err);
    }
    setLoading(false);
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    fetchEstimate(sqFt, quality, rooms);
  };

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div>
      <form onSubmit={handleCalculate}>
        <label>Square Footage (Sq Ft)</label>
        <input 
          type="number" 
          value={sqFt} 
          onChange={(e) => setSqFt(e.target.value)} 
          min="500" 
          max="10000"
        />

        <label>Material Quality</label>
        <select value={quality} onChange={(e) => setQuality(e.target.value)}>
          <option value="standard">Standard</option>
          <option value="premium">Premium</option>
          <option value="luxury">Luxury</option>
        </select>

        <label style={{ marginTop: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <PlusCircle size={16} /> Add Rooms / Features
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {['kitchen', 'bathroom', 'bedroom', 'terrace'].map(room => (
            <label key={room} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', margin: 0 }}>
              <input 
                type="checkbox" 
                checked={rooms[room]} 
                onChange={() => handleRoomToggle(room)} 
                style={{ width: 'auto', margin: 0 }}
              />
              <span style={{ textTransform: 'capitalize' }}>{room}</span>
            </label>
          ))}
        </div>

        <button type="submit" style={{ width: '100%' }}>
          <Calculator size={18} /> Recalculate Cost
        </button>
      </form>

      {loading ? (
        <div style={{ textAlign: 'center', margin: '2rem 0' }}><div className="loader"></div></div>
      ) : estimate ? (
        <div className="cost-breakdown">
          <div className="cost-row">
            <span>Base Structure:</span>
            <span>{formatCurrency(estimate.breakdown.baseStructure)}</span>
          </div>
          <div className="cost-row">
            <span>Materials & Labor:</span>
            <span>{formatCurrency(estimate.breakdown.materialsAndLabor)}</span>
          </div>
          <div className="cost-row">
            <span>Additional Rooms:</span>
            <span>{formatCurrency(estimate.breakdown.additionalRooms)}</span>
          </div>
          <div className="cost-row total">
            <span>Estimated Total:</span>
            <span>{formatCurrency(estimate.estimatedCost)}</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', color: 'var(--text-secondary)' }}>
            <Calendar size={16} />
            <span style={{ fontSize: '0.9rem' }}>Estimated Project Timeline: <strong>{estimate.timelineMonths} months</strong></span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CostEstimator;
