const User = require('../models/user');

// Obter detalhes do usu?rio
const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter detalhes do usu?rio', error });
  }
};

module.exports = { getUserDetails };
                                                                                                                                                                                                                                                                                       