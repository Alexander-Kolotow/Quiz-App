import dbConnect from "../../../db/connect";
import Quiz from "../../../db/models/Quiz";

export default async function handler(req, res) {
  // Stelle sicher, dass die Datenbankverbindung steht
  await dbConnect();

  if (req.method === 'GET') {
    // Logik zum Abrufen und Senden einer Liste von Quizzen
    try {
      const quizzes = await Quiz.find({}); // Finde alle Quizze in der Datenbank
      res.status(200).json(quizzes); // Sende die gefundenen Quizze als Antwort
    } catch (error) {
      res.status(500).json({ message: "Fehler beim Abrufen der Quizze", error: error.message });
    }
  } else if (req.method === 'POST') {
    // Logik zum Erstellen eines neuen Quiz
    try {
      const quiz = new Quiz(req.body); // Erstelle ein neues Quiz mit den Daten aus req.body
      const newQuiz = await quiz.save(); // Speichere das neue Quiz in der Datenbank
      res.status(201).json(newQuiz); // Sende das neu erstellte Quiz als Antwort
    } catch (error) {
      res.status(500).json({ message: "Fehler beim Erstellen des Quiz", error: error.message });
    }
  } else {
    // Methode nicht unterstützt
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Methode ${req.method} nicht erlaubt`);
  }
}
