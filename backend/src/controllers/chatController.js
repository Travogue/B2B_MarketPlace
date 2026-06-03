const Chat = require('../models/Chat');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const Notification = require('../models/Notification');

exports.getMyChats = asyncHandler(async (req, res) => {
  const chats = await Chat.find({ participants: req.user._id })
    .populate('participants', 'name avatar role')
    .populate('product', 'name slug images')
    .sort('-lastMessageAt');

  res.status(200).json(new ApiResponse(200, chats));
});

exports.getOrCreateChat = asyncHandler(async (req, res) => {
  const { recipientId, productId, inquiryId } = req.body;

  let chat = await Chat.findOne({
    participants: { $all: [req.user._id, recipientId] },
    ...(productId && { product: productId }),
  }).populate('participants', 'name avatar');

  if (!chat) {
    chat = await Chat.create({
      participants: [req.user._id, recipientId],
      product: productId,
      inquiry: inquiryId,
      messages: [],
    });
    chat = await chat.populate('participants', 'name avatar');
  }

  res.status(200).json(new ApiResponse(200, chat));
});

exports.sendMessage = asyncHandler(async (req, res) => {
  const chat = await Chat.findById(req.params.id);
  if (!chat) throw new ApiError(404, 'Chat not found');

  const isParticipant = chat.participants.some((p) => p.toString() === req.user._id.toString());
  if (!isParticipant) throw new ApiError(403, 'Not authorized');

  const message = {
    sender: req.user._id,
    content: req.body.content,
    attachments: req.body.attachments || [],
  };

  chat.messages.push(message);
  chat.lastMessage = req.body.content;
  chat.lastMessageAt = new Date();
  await chat.save();

  const recipientId = chat.participants.find((p) => p.toString() !== req.user._id.toString());
  await Notification.create({
    recipient: recipientId,
    type: 'chat',
    title: 'New Message',
    message: req.body.content.substring(0, 100),
    link: `/chat/${chat._id}`,
  });

  res.status(200).json(new ApiResponse(200, chat.messages[chat.messages.length - 1], 'Message sent'));
});

exports.getChatMessages = asyncHandler(async (req, res) => {
  const chat = await Chat.findById(req.params.id)
    .populate('messages.sender', 'name avatar');

  if (!chat) throw new ApiError(404, 'Chat not found');

  const isParticipant = chat.participants.some((p) => p.toString() === req.user._id.toString());
  if (!isParticipant) throw new ApiError(403, 'Not authorized');

  res.status(200).json(new ApiResponse(200, chat.messages));
});
