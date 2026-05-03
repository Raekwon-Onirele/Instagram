const Photo = require("../models/Photo")

const User = require("../models/User")

const mongoose = require("mongoose")

// Inserir foto com um usuário relacionado
const insertPhoto = async(req, res) => {
    const { title } = req.body
    const image = req.file.filename

    const reqUser = req.user

    const user = await User.findById(reqUser._id)

    // Criar o photo
    const newPhoto = await Photo.create({
        image, 
        title,
        userId: user._id,
        userName: user.name,
    })

    // Se photo foi criada com sucesso
    if(!newPhoto){
        res.status(422).json({errors: ["Houve um problema, tente mais tarde"]})
    }

    res.status(201).json(newPhoto)
}

module.exports = {
    insertPhoto
}