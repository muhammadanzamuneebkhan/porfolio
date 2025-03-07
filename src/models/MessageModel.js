/** @format */
{
  /* <a href="https://wa.me/1234567890?text=Hello%20I%20have%20a%20question!" target="_blank">
   <img src="whatsapp-icon.png" alt="Contact us on WhatsApp">
</a> */
}

import mongoose from 'mongoose';

// Define the schema for the message
const messageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    senderName: {
      type: String,
      required: [true, 'Sender name is required'],
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
    senderPhoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    ProjectFile: {
      public_id: String,
      url: String,
    },
  },
  { timestamps: true }
);
export const messageModel =
  mongoose.models.Message || mongoose.model('Message', messageSchema);
