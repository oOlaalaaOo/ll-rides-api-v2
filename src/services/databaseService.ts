import mongoose from 'mongoose';

const connect = () => {
  mongoose.connect('mongodb://localhost:27017/ll-rides-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export default {
  connect,
};
