import dbConnect from "../../../db/connect";
import Quiz from "../../../db/models/Quiz";

// Hilfsfunktion zum Mischen der Quiz-Daten
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // ES6 destructuring assignment
  }
  return array;
};

export default async function handler(req, res) {
 
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        let quizzes = await Quiz.find({});
        quizzes = shuffle(quizzes); // Mische die Quizze nach dem Abrufen

        const modifiedQuizzes = quizzes.map(quiz => {
          const quizObject = quiz.toObject();
          delete quizObject.correctOption; // Entfernen der correctOption
          return quizObject;
        });
        res.status(200).json(modifiedQuizzes);
      } catch (error) {
        res.status(500).json({ message: "Fehler beim Abrufen der Quizze", error: error.message });
      }
      break;
    case 'POST':
      try {
        const quiz = new Quiz(req.body);
        const newQuiz = await quiz.save();
        res.status(201).json(newQuiz);
      } catch (error) {
        res.status(400).json({ message: "Fehler beim Erstellen des Quiz", error: error.message });
      }
      break;
    case 'PATCH':
      try {
        const result = await Quiz.updateMany({}, { $set: { answered: false } });
        if (!result) {
          return res.status(404).json({ message: "Quizzes not found" });
        }
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ message: "Error resetting quizzes", error: error.message });
      }
      break;
    default:    
      res.setHeader('Allow', ['GET', 'POST', 'PATCH']);
      res.status(405).end(`Methode ${req.method} nicht erlaubt`);
  }
}
