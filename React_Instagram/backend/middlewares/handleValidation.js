const {validationResult} = require("express-validator")

// Sistema de validação para retornar os erros
const validate = (req, res, next) => {
    
    const erros = validationResult(req)

    if(erros.isEmpty()) {
        return next()
    }

    const extractedErros = []

    erros.array().map((err) => extractedErros.push(err.msg))

    return res.status(422).json({
        errors: extractedErros
        
    })
}

module.exports = validate