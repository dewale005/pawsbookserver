const Joi = require('joi');
const bcrypt = require('bcryptjs');

module.exports = {
    encryptpassword(plaintext) {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(plaintext, salt)
    },

    comparePassword(plaintext, encryptpassword) {
        return bcrypt.compareSync(plaintext, encryptpassword)
    },

    UserRegistration(body) {
        const schema = Joi.object().keys({
            username: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required()
        });
        const { value, error } = Joi.validate(body, schema);
        if (error && error.details) {
            return { error }
        } else {
            return { value }
        }
    },

    Userlogin(body) {
        const schema = Joi.object().keys({
            username: Joi.string().required(),
            password: Joi.string().required()
        });
        const { value, error } = Joi.validate(body, schema);
        if (error && error.details) {
            return { error }
        } else {
            return { value }
        }
    },

    UserUpdate(body) {
        const schema = Joi.object().keys({
            username: Joi.string(),
            email: Joi.string().email(),
            name: Joi.string(),
            webUrl: Joi.string(),
            bioData: Joi.string(),
            phone: Joi.string(),
            gender: Joi.string(),
        });
        const { value, error } = Joi.validate(body, schema);
        if (error && error.details) {
            return { error }
        } else {
            return { value }
        }
    },

    CreatePost(body) {
        const schema = Joi.object().keys({
            description: Joi.string().optional()
        })
        const { value, error } = Joi.validate(body, schema);
        if (error && error.details) {
            return { error }
        } else {
            return { value }
        }
    },

    CreateComment(body) {
        const schema = Joi.object().keys({
            description: Joi.string().required()
        })
        const { value, error } = Joi.validate(body, schema);
        if (error && error.details) {
            return { error }
        } else {
            return { value }
        }
    }
}