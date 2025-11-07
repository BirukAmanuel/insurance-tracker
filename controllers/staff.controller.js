const StaffInsurance = require("../models/staff.model");
const dal = require("../dal/staff.dal");

const getAll = async (req, res) => {
  try {
    const data = await dal.getAllStaffInsurance();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const data = await dal.getStaffInsuranceById(req.params.id);
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
    console.log(`Creating staff insurance for USER_ID: ${userId}`);

    // Remove USER_ID from data if provided by form
    delete data.USER_ID;

    await dal.createStaffInsurance(data, userId); // Pass userId separately
    res.status(201).json({ message: "Staff Insurance created successfully" });
  } catch (err) {
    console.error('create: Error:', err);
    res.status(500).json({ error: "Error creating staff insurance: " + err.message });
  }
};

const update = async (req, res) => {
  try {
    const data = req.body;
    // Prevent updating USER_ID to preserve original submitter
    delete data.USER_ID;
    await dal.updateStaffInsurance(req.params.id, data);
    res.json({ message: "Staff Insurance updated successfully" });
  } catch (err) {
    console.error('update: Error:', err);
    res.status(500).json({ error: "Error updating staff insurance: " + err.message });
  }
};


const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await dal.updateStaffStatus(req.params.id, status);
    res.json({ message: "Status updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const remove = async (req, res) => {
  try {
    await dal.deleteStaffInsurance(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getById, create, update, remove, updateStatus };
