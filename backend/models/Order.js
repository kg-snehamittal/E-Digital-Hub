const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  cartItems: { type: [mongoose.Schema.Types.Mixed], required: true },
  addressInfo: {
    name: String,
    address: String,
    pincode: String,
    phoneNumber: String
  },
  email: { type: String, required: true },
  userid: { type: String, required: true },
  paymentId: String,
  status: { type: String, default: 'Placed' },
  date: { type: String } // display date, e.g. "Oct 01, 2026"
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
