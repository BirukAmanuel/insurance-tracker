const AssetInsurance = require("../models/asset.model");
const dal = require("../dal/asset.dal");

const getAll = async (req, res) => {
  try {
    const data = await dal.getAllAssetInsurance();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const data = await dal.getAssetInsuranceById(req.params.id);
    if (!data) return res.status(404).json({ message: "Not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const data = req.body;
    const userId = req.user.id; // Extract USER_ID from JWT payload
    console.log(`Creating asset insurance for USER_ID: ${userId}`);

    // Remove USER_ID from data if provided by form
    delete data.USER_ID;

    await dal.createAssetInsurance(data, userId); // Pass userId separately
    res.status(201).json({ message: "Asset Insurance created successfully" });
  } catch (err) {
    console.error('create: Error:', err);
    res.status(500).json({ error: "Error creating asset insurance: " + err.message });
  }
};

const update = async (req, res) => {
  try {
    const data = req.body;
    // Prevent updating USER_ID to preserve original submitter
    delete data.USER_ID;
    await dal.updateAssetInsurance(req.params.id, data);
    res.json({ message: "Asset Insurance updated successfully" });
  } catch (err) {
    console.error('update: Error:', err);
    res.status(500).json({ error: "Error updating asset insurance: " + err.message });
  }
};


const updateStatus = async (req, res) => {
    try {
      const { status } = req.body;
      await dal.updateAssetStatus(req.params.id, status);
      res.json({ message: "Status updated successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };



const remove = async (req, res) => {
  try {
    await dal.deleteAssetInsurance(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getById, create, update, remove ,updateStatus};
