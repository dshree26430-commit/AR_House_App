import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Home, Layers, DollarSign, Activity } from 'lucide-react';
import ModelSelector from './components/ModelSelector';
import ARViewer from './components/ARViewer';
import CostEstimator from './components/CostEstimator';
import Chatbot from './components/Chatbot';
import './index.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Lifted rooms state for Chatbot interaction
  const [rooms, setRooms] = useState({
    kitchen: true,
    bathroom: true,
    bedroom: true,
    terrace: false
  });

  useEffect(() => {
    axios.get(`${API_URL}/models`)
      .then(res => {
        setModels(res.data);
        if (res.data.length > 0) {
          setSelectedModel(res.data[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching models:", err);
        setLoading(false);
      });
  }, []);

  const handleRoomToggle = (room) => {
    setRooms(prev => ({
      ...prev,
      [room]: !prev[room]
    }));
  };

  const handleChatAction = (action) => {
    if (action && action.type === 'set_room') {
      setRooms(prev => ({
        ...prev,
        [action.room]: action.value
      }));
    }
  };

  return (
    <>
      <header>
        <h1><Home size={24} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }}/> ARchitect VR</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="secondary"><Activity size={18} /> Unity Connect</button>
        </div>
      </header>
      
      <main className="main-content">
        <aside className="sidebar">
          <div className="panel">
            <h2><Layers size={20} /> Select View</h2>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}><div className="loader"></div></div>
            ) : (
              <ModelSelector 
                models={models} 
                selectedModel={selectedModel} 
                onSelectModel={setSelectedModel} 
              />
            )}
          </div>
          
          <div className="panel" style={{ flex: 1 }}>
            <h2><DollarSign size={20} /> Revit Cost Estimation</h2>
            {selectedModel ? (
              <CostEstimator 
                selectedModel={selectedModel} 
                apiUrl={API_URL} 
                rooms={rooms}
                handleRoomToggle={handleRoomToggle}
              />
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Select a model to view estimates.</p>
            )}
          </div>
        </aside>

        <section className="viewer-area">
          {selectedModel ? (
            <ARViewer model={selectedModel} />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <p>Loading 3D Viewer...</p>
            </div>
          )}
        </section>
      </main>

      <Chatbot apiUrl={API_URL} onAction={handleChatAction} />
    </>
  );
}

export default App;
