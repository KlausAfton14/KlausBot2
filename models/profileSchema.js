const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userName: { type: String, require: true},
    userID: { type: String, require: true, unique: true},
    coins: { type: Number, default: 1312},
    bank: { type: Number}
})

const model = mongoose.model('ProfileModels', profileSchema);

module.exports = model;
