const mongoose = require('mongoose');

const AuditionSchema = new mongoose.Schema({
  auditionName: String,
  eventName: String,
  list: [String],
  newList: [String],
  notList: [String]
});

module.exports = mongoose.model('Audition', AuditionSchema, 'auditions');