import dbConnect from "../../../../db/connect";
import Quiz from "../../../../db/models/Quiz";
import mongoose from 'mongoose';

export default async function handler(req, res) {
    
  if (req.method !== 'POST') {
    return res.status(405).end(`Methode ${req.method} nicht erlaubt`);
  }

  const { quizId, selectedOptionIndex } = req.body;

  // Validierung der Eingaben
  if (!quizId || typeof selectedOptionIndex !== 'number') {
    return res.status(400).json({ message: "Fehlende oder ungültige Eingabedaten" });
  }

  // Überprüfen, ob quizId ein gültiges MongoDB ObjectId ist
  if (!mongoose.Types.ObjectId.isValid(quizId)) {
    return res.status(400).json({ message: "Ungültige quizId" });
  }

  await dbConnect();

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Vergleich der übergebenen Antwort mit der korrekten Antwort
    const isCorrect = quiz.correctOption === selectedOptionIndex;
    res.status(200).json({ isCorrect });
  } catch (error) {
    res.status(500).json({ message: "Error verifying answer", error: error.message });
  }
}
