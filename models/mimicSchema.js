const mongoose = require('mongoose');

const mimicSchema = new mongoose.Schema({
    mimicName: { type: String, require: true},
    avatarURL: { type: String, require: true },
    ownerID: { type: String, require: true },
    isActive: { type:Boolean, require: true }
});
const model = mongoose.model('MimicModels', mimicSchema);

module.exports = model;