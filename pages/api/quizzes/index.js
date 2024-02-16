import dbConnect from "../../../db/connect";
import Quiz from "../../../db/models/Quiz";

export default async function handler(req, res) {
  // Stelle sicher, dass die Datenbankverbindung steht
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const quizzes = await Quiz.find({});
        res.status(200).json(quizzes);
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
    default:
      // Aktualisiere den 'Allow'-Header, um 'GET' und 'POST' zu unterstützen
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Methode ${req.method} nicht erlaubt`);
  }
}
