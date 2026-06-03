const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: { type: String, required: true },
    attachments: [{ url: String, type: String }],
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const chatSchema = new mongoose.Schema(
  {
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ],
    inquiry: { type: mongoose.Schema.Types.ObjectId, ref: 'Inquiry' },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    lastMessage: String,
    lastMessageAt: Date,
    messages: [messageSchema],
  },
  { timestamps: true }
);

chatSchema.index({ participants: 1 });

module.exports = mongoose.model('Chat', chatSchema);
