// controllers/userController.js
const User = require('../models/user');

const loginOrCreateUser = async (req, res) => {
  const { _id } = req.body;

  try {
    let user = await User.findById(_id);

    if (!user) {
      const newUser = new User({
        _id,
        lastLoginDate: new Date().toISOString(),
        serviceUsage: { createQuestionByGPT: 0 },
        album: [],
      });
      await newUser.save();
      res.status(201).json(newUser);
    } else {
      user.lastLoginDate = new Date().toISOString();
      await user.save();
      res.status(200).json(user);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while logging in the user.' });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.status(200).json(user);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while getting the user.' });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.status(200).json(user);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while updating the user.' });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.status(200).json({ message: 'User deleted successfully' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while deleting the user.' });
  }
};

module.exports = {
  loginOrCreateUser,
  getUser,
  updateUser,
  deleteUser,
};

