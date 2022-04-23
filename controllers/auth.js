const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const errorHandler = require('../utils/errorHandler');
const User = require('../models/User');
const keys = require('../config/keys');

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  const candidate = await User.findOne({ email });

  if (!candidate) {
    res.status(404).json({ message: 'Нет польозователя с таким email' });
  } else {
    const arePasswordsSame = await bcrypt.compare(password, candidate.password);

    if (!arePasswordsSame) {
      res.status(406).json({ message: 'Неправильный пароль' });
    } else {
      const token = jwt.sign(
        {
          email: candidate.email,
          userId: candidate._id,
        },
        keys.JWT_SECRET,
        { expiresIn: 60 * 60 }
      );

      res.status(200).json({ token: `Bearer ${token}` });
    }
  }
};

module.exports.register = async (req, res) => {
  const { email, password } = req.body;

  const candidate = await User.findOne({ email });

  if (candidate) {
    res.status(409).json({
      message: 'Такой email уже занят',
    });
  } else {
    const salt = await bcrypt.genSalt(10);
    const cryptedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      email,
      password: cryptedPassword,
    });

    try {
      await user.save();
      res.status(201).json(user);
    } catch (err) {
      errorHandler(res, err);
    }
  }
};
