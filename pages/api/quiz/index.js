import dbConnect from "../../../db/connect";
import Quiz from "../../../db/models/Quiz";


export default async function handler(req, res) {

  // Stelle sicher, dass die Datenbankverbindung steht
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const quizzes = await Quiz.find({});
      res.status(200).json(quizzes);
    } catch (error) {
      res.status(500).json({ message: "Fehler beim Abrufen der Quizze", error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const quiz = new Quiz(req.body);
      const newQuiz = await quiz.save();
      res.status(201).json(newQuiz);
    } catch (error) {
      res.status(500).json({ message: "Fehler beim Erstellen des Quiz", error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Methode ${req.method} nicht erlaubt`);
  }
}
