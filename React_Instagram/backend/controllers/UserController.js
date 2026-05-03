const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

const mongoose = require("mongoose");

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
    res.status(422).json({ errors: ["Senha inválida"] });
    return;
  }

  // Retornando User com token
  res.status(201).json({
    _id: user._id,
    profileImage: user.profileImage,
    token: generateToken(user._id),
  });
};

// Get para o user logado
const getCurrentUser = async (req, res) => {
  const user = req.user;

  res.status(200).json(user);
};

// Update User
const update = async (req, res) => {
  const { name, password, bio } = req.body;

  let profileImage = null;

  if (req.file) {
    profileImage = req.file.filename;
  }

  const reqUser = req.user;

  const user = await User.findById(
    new mongoose.Types.ObjectId(reqUser._id),
  ).select("-password");

  if (name) {
    user.name = name;
  }

  if (password) {
    // Gerar password hash
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    user.password = passwordHash;
  }

  if (profileImage) {
    user.profileImage = profileImage;
  }

  if (bio) {
    user.bio = bio;
  }

  await user.save();

  res.status(200).json(user);
};

// get do user por id
const getUserId = async (req, res) => {

  const { id } = req.params;

  try {
    const user = await User.findById(new mongoose.Types.ObjectId(id)).select(
      "-password",
    );

    // checagem se user existe
    if (!user) {
      res.status(404).json({ errors: ["O usuário não existe"] });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ errors: ["O usuário não existe"] });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  update,
  getUserId,
};
