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

module.exports = {
  loginOrCreateUser,
};
