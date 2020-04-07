import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  userId: { type: String, required: true },
  address: [
    {
      address1: String,
      address2: String,
      state: String,
      city: String,
      country: String,
      zipCode: String,
    },
  ],
  contacts: [
    {
      mobileNo: String,
      telNo: String,
    },
  ],
  birthDate: Date,
}, {
  minimize: false,
  timestamps: true
});

export default mongoose.model('UserDetails', schema);
