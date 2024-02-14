import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true
  },
  selectedOption: {
    type: Number,
    default: -1
  },
  answered: {
    type: Boolean,
    default: false
  }
});

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;
