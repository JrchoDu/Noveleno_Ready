const MapData = require('../models/Evacuation');

const getAllMapData = async (req, res) => {
  try {
    const mapData = await MapData.findAll();
    res.status(200).json(mapData);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch map data', error: error.message });
  }
};

const createMapData = async (req, res) => {
  console.log('Request body:', req.body); 
  const { coordinates, barangay, title } = req.body;

  // Check for required fields
  if (!coordinates || !coordinates.lat || !coordinates.lng || !barangay || !title) {
    return res.status(400).json({ message: 'Coordinates, barangay and title are required' });
  }

  const { lat, lng } = coordinates;

  try {
    const newMapData = await MapData.create({
      lat,
      lng,
      barangay,
      title,
    });

    res.status(201).json(newMapData);
  } catch (error) {
    res.status(500).json({ message: 'Failed to save map data', error: error.message });
  }
};


const deleteMapData = async (req, res) => {
  const { id } = req.params;

  try {
    const mapData = await MapData.destroy({ where: { id } });

    if (!mapData) {
      return res.status(404).json({ message: 'Map data not found' });
    }

    res.status(200).json({ message: 'Map data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete map data', error: error.message });
  }
};

module.exports = {
  getAllMapData,
  createMapData,
  deleteMapData
};
