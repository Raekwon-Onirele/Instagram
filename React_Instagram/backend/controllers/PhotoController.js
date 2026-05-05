const Photo = require("../models/Photo");

const User = require("../models/User");

const mongoose = require("mongoose");

// Inserir foto com um usuário relacionado
const insertPhoto = async (req, res) => {
  const { title } = req.body;
  const image = req.file.filename;

  const reqUser = req.user;

  const user = await User.findById(reqUser._id);

  // Criar o photo
  const newPhoto = await Photo.create({
    image,
    title,
    userId: user._id,
    userName: user.name,
  });

  // Se photo foi criada com sucesso
  if (!newPhoto) {
    res.status(422).json({ errors: ["Houve um problema, tente mais tarde"] });
    return;
  }

  res.status(201).json(newPhoto);
};

// Remover a photo
const deletePhoto = async (req, res) => {
  const { id } = req.params;

  const reqUser = req.user;

  try {
    const photo = await Photo.findById(new mongoose.Types.ObjectId(id));

    if (!photo) {
      res.status(404).json({ errors: ["Foto não encontrada"] });
      return;
    }

    // Checagem se o user é o dono da photo para excluí-lá
    if (!photo.userId.equals(reqUser._id)) {
      res
        .status(422)
        .json({ errors: ["Ocorreu um erro tente novamente mais tarde"] });
    }

    await Photo.findByIdAndDelete(photo.id);

    res
      .status(200)
      .json({ id: photo._id, message: "Foto foi excluída com sucesso" });
  } catch (error) {
    res.status(404).json({ errors: ["Foto não encontrada"] });
  }
};

// Get de todas as photos
const getAllPhotos = async(req, res) => {
    const photos = await Photo.find({})
        .sort([["createdAt", -1]])
        .exec()

    return res.status(200).json(photos)
}

// get na photo do user
const getUserPhotos = async(req, res) => {

    const {id} = req.params

    const photos = await Photo.find({userId: id})
    .sort([["createdAt", -1]])
    .exec()

    return res.status(200).json(photos)
}

module.exports = {
  insertPhoto,
  deletePhoto,
  getAllPhotos,
  getUserPhotos,
};
