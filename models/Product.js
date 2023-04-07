import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    id: { type: String, require: true, unique: true },
    title: { type: String, require: true },
    image: { type: String, require: true },
    price: { type: Number, require: true },
    description: { type: String, require: true },
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
