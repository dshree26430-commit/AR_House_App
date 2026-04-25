import React from 'react';
import '@google/model-viewer';

const ARViewer = ({ model }) => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* 
        The model-viewer component provides WebXR markerless AR.
        It falls back to Scene Viewer on Android and Quick Look on iOS.
      */}
      <model-viewer
        src={model.modelUrl}
        poster={model.poster}
        alt={`A 3D model of ${model.name}`}
        shadow-intensity="1"
        camera-controls
        auto-rotate
        ar
        ar-modes="webxr scene-viewer quick-look"
        environment-image="neutral"
      >
        <div slot="poster" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
           <div className="loader"></div>
        </div>
        
        <button slot="ar-button" className="ar-prompt" style={{ 
          backgroundColor: '#fff', 
          color: '#0f172a', 
          borderRadius: '2rem', 
          padding: '0.75rem 1.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          fontWeight: '600'
        }}>
          👋 View in your space
        </button>
      </model-viewer>
      
      <div style={{ position: 'absolute', top: '1rem', left: '1rem', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{model.name}</h2>
        <p style={{ margin: 0, opacity: 0.8 }}>{model.description}</p>
      </div>
    </div>
  );
};

export default ARViewer;
