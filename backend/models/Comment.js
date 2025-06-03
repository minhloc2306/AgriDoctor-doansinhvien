const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const feedbackSchema = new Schema({
  user:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
  disease: { type: Schema.Types.ObjectId, ref: 'Disease', required: true },
  content: { type: String, required: true },
  approved:{ type: Boolean, default: false },  // Chỉ hiện khi admin duyệt
  createdAt:{ type: Date, default: Date.now }
});
module.exports = mongoose.model('Feedback', feedbackSchema);
