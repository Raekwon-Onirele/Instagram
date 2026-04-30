const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

// Gerador de User Token
const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: "7d",
  });
};

// Register User e sign in
const register = async (req, res) => {
  const { name, email, password } = req.body;

  // checando se user existe
  const user = await User.findOne({ email });

  if (user) {
    res.status(422).json({ errors: ["Email já existente"] });
    return;
  }

  // Gerar password hash
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);

  // Criar Usuário
  const newUser = await User.create({
    name,
    email,
    password: passwordHash,
  });

  // If se user foi criado com sucesso
  if (!newUser) {
    res.status(422).json({ errors: ["Houve um erro, tente mais tarde!"] });
    return;
  }

  res.status(201).json({
    _id: newUser._id,
    token: generateToken(newUser._id),
  });
};

// Sign User
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  // Checar se usuário existe
  if (!user) {
    res.status(404).json({ errors: ["Usuário não encontrado"] });
    return;
  }

  // Checando se as senhas são iguais
  if (!(await bcrypt.compare(password, user.password))) {
    res.status(422).json({errors: ["Senha inválida"]})
    return
  }

  // Retornando User com token
  res.status(201).json({
    _id: user._id,
    profileImage: user.profileImage,
    token: generateToken(user._id),
  });
};

// Get para o user logado
const getCurrentUser = async(req, res) => {
    const user = req.user

    res.status(200).json(user)
}

// Update User
const update = async (req, res) => {
  res.send("Update")
}

module.exports = {
  register,
  login,
  getCurrentUser,
  update,
};
