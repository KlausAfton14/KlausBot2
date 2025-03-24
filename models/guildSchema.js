const mongoose = require('mongoose');

const guildSchema = new mongoose.Schema({
    guildName: { type: String, require: true},
    guildID: { type: String, require: true, unique: true},
    lang: { type: String, default: 'english'},
    welcomeMessage: { type: String, default: 'Welcome to the server!'},
    welcomeChannelId: { type: String, default: '0'},
    klausHookEnabled: { type: Boolean, default: false}
})

const model = mongoose.model('GuildModels', guildSchema);

module.exports = model;
