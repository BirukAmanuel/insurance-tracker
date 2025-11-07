const dal = require("../dal/project.dal");

const getAll = async (req, res) => {
  try {
    const data = await dal.getAllProjectInsurance(req.user.workUnit);
    res.json(data);
  } catch (err) {
    console.error('getAll: Error:', err);
    res.status(500).json({ error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const data = await dal.getProjectInsuranceById(req.params.id, req.user.workUnit);
    if (!data) return res.status(404).json({ message: "Not found or unauthorized" });
    res.json(data);
  } catch (err) {
    console.error('getById: Error:', err);
    res.status(500).json({ error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const data = req.body;
    const userId = req.user.id;
    const workUnit = req.user.workUnit;
    console.log(`Creating project insurance for USER_ID: ${userId}, WORK_UNIT: ${workUnit}`);

    delete data.USER_ID;
    delete data.WORK_UNIT;

    await dal.createProjectInsurance(data, userId, workUnit);
    res.status(201).json({ message: "Project Insurance created successfully" });
  } catch (err) {
    console.error('create: Error:', err);
    res.status(500).json({ error: "Error creating project insurance: " + err.message });
  }
};

const update = async (req, res) => {
  try {
    const data = req.body;
    const workUnit = req.user.workUnit;
    delete data.USER_ID;
    delete data.WORK_UNIT;
    await dal.updateProjectInsurance(req.params.id, data, workUnit);
    res.json({ message: "Project Insurance updated successfully" });
  } catch (err) {
    console.error('update: Error:', err);
    res.status(500).json({ error: "Error updating project insurance: " + err.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const workUnit = req.user.workUnit;
    if (!status) return res.status(400).json({ message: "Status is required" });

    await dal.updateProjectInsuranceStatus(req.params.id, status, workUnit);
    res.json({ message: "Status updated successfully" });
  } catch (err) {
    console.error('updateStatus: Error:', err);
    res.status(500).json({ error: "Error updating status: " + err.message });
  }
};

const remove = async (req, res) => {
  try {
    await dal.deleteProjectInsurance(req.params.id, req.user.workUnit);
    res.json({ message: "Project Insurance deleted successfully" });
  } catch (err) {
    console.error('remove: Error:', err);
    res.status(500).json({ error: "Error deleting project insurance: " + err.message });
  }
};

module.exports = { getAll, getById, create, update, updateStatus, remove };