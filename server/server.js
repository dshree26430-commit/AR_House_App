const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mock data representing Revit exports and house models
const revitData = require('./data/revit_costs.json');

app.get('/api/models', (req, res) => {
  res.json(revitData.models);
});

app.post('/api/estimate', (req, res) => {
  const { modelId, squareFootage, materialQuality, rooms } = req.body;
  const model = revitData.models.find(m => m.id === modelId);
  
  if (!model) {
    return res.status(404).json({ error: 'Model not found' });
  }

  // Basic calculation mimicking Revit estimation logic
  const baseCost = model.baseCost;
  const areaCost = (squareFootage || model.defaultSqFt) * revitData.costPerSqFt[materialQuality || 'standard'];
  
  let additionalRoomsCost = 0;
  if (rooms) {
    if (rooms.kitchen) additionalRoomsCost += revitData.roomCosts.kitchen;
    if (rooms.bathroom) additionalRoomsCost += revitData.roomCosts.bathroom;
    if (rooms.bedroom) additionalRoomsCost += revitData.roomCosts.bedroom;
    if (rooms.terrace) additionalRoomsCost += revitData.roomCosts.terrace;
  }
  
  const totalCost = baseCost + areaCost + additionalRoomsCost;
  const timelineMonths = 2 + Math.ceil(totalCost / 1000000); 

  res.json({
    modelName: model.name,
    estimatedCost: totalCost,
    timelineMonths,
    breakdown: {
      baseStructure: baseCost,
      materialsAndLabor: areaCost,
      additionalRooms: additionalRoomsCost
    }
  });
});

app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  
  let reply = "I'm your virtual assistant. I can update your plan if you ask me to 'add a kitchen' or 'remove the terrace'!";
  let action = null;
  
  const lowerMsg = message.toLowerCase();
  
  // Logic to add rooms
  if (lowerMsg.includes('add') || lowerMsg.includes('want')) {
    if (lowerMsg.includes('kitchen')) {
      reply = "Sure, I have added a kitchen to your estimation.";
      action = { type: 'set_room', room: 'kitchen', value: true };
    } else if (lowerMsg.includes('bathroom')) {
      reply = "Done! A bathroom has been added to the plan.";
      action = { type: 'set_room', room: 'bathroom', value: true };
    } else if (lowerMsg.includes('bedroom')) {
      reply = "I've included an extra bedroom in your cost estimate.";
      action = { type: 'set_room', room: 'bedroom', value: true };
    } else if (lowerMsg.includes('terrace')) {
      reply = "Great choice! Added a terrace to your visualization.";
      action = { type: 'set_room', room: 'terrace', value: true };
    }
  }
  
  // Logic to remove rooms
  if (lowerMsg.includes('remove') || lowerMsg.includes('delete') || lowerMsg.includes('without')) {
    if (lowerMsg.includes('kitchen')) {
      reply = "I have removed the kitchen from the plan.";
      action = { type: 'set_room', room: 'kitchen', value: false };
    } else if (lowerMsg.includes('bathroom')) {
      reply = "Bathroom removed.";
      action = { type: 'set_room', room: 'bathroom', value: false };
    } else if (lowerMsg.includes('bedroom')) {
      reply = "Bedroom removed from the estimate.";
      action = { type: 'set_room', room: 'bedroom', value: false };
    } else if (lowerMsg.includes('terrace')) {
      reply = "Terrace removed.";
      action = { type: 'set_room', room: 'terrace', value: false };
    }
  }

  // General FAQ
  if (!action && (lowerMsg.includes('cost') || lowerMsg.includes('price'))) {
    reply = "Cost estimates are derived from Revit data, considering base structure, square footage, material quality, and any additional rooms you specify.";
  } else if (!action && (lowerMsg.includes('ar') || lowerMsg.includes('view'))) {
    reply = "You can view the house in your physical space by selecting a model and tapping the 'View in AR' button. It uses markerless AR!";
  } else if (!action && (lowerMsg.includes('unity') || lowerMsg.includes('edit'))) {
    reply = "Yes, you can edit these models in Unity and re-export them to .glb format to view them here.";
  }

  res.json({ reply, action });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
