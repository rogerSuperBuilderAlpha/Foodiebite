const mongoose = require('mongoose');

const SupportMessageSchema = new mongoose.Schema({
	name: String,
	email: String,
	message: String,
	type: { type: String, enum: ['support', 'export', 'delete'], default: 'support' },
	createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SupportMessage', SupportMessageSchema);
