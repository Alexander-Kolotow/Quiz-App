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
    type: String,
    default: null
  },
  correctOption: {
    type: Number,
    required: true
  },
  answered: {
    type: Boolean,
    default: false
  }
});

const Quiz = mongoose.models.Quiz || mongoose.model('Quiz', quizSchema);

export default Quiz;
