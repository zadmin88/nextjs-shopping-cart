import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    orderItems: [
      {
        name: { type: String, require: true },
        quantity: { type: Number, require: true },
        decription: { type: String, require: true },
        image: { type: String, require: true },
      },
    ],
    shippingAddress: {
      fullName: { type: String, require: true },
      address: { type: String, require: true },
      city: { type: String, require: true },
      postalCode: { type: Number, require: true },
      country: { type: String, require: true },
    },
    paymentMethod: { type: String, require: true },
    itemsPrice: { type: Number, require: true },
    shippingPrice: { type: Number, require: true },
    taxPrice: { type: Number, require: true },
    totalPrice: { type: Number, require: true },
    isPaid: { type: Boolean, require: true },
    isDelivered: { type: Boolean, require: true },
    paymentId: { type: String, require: false },
    paymentStatus: { type: String, require: false },
    paymentEmail: { type: String, require: false },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;
