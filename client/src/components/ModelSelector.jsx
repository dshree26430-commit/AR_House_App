import React from 'react';

const ModelSelector = ({ models, selectedModel, onSelectModel }) => {
  return (
    <div className="model-gallery">
      {models.map(model => (
        <div 
          key={model.id}
          className={`model-card ${selectedModel?.id === model.id ? 'active' : ''}`}
          onClick={() => onSelectModel(model)}
        >
          <img src={model.poster} alt={model.name} />
          <p>{model.name}</p>
        </div>
      ))}
    </div>
  );
};

export default ModelSelector;
