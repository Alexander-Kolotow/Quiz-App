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
    case 'PUT':
      // Extrahiere die ID aus der Anfrage
      const { id } = req.query;
      try {
        const result = await Quiz.findByIdAndUpdate(id, req.body, { new: true });
        if (!result) {
          return res.status(404).json({ message: "Quiz not found" });
        }
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ message: "Error updating quiz", error: error.message });
      }
      break;
    default:
      // Aktualisiere den 'Allow'-Header, um nur 'GET' und 'PUT' zu unterstützen
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(`Methode ${req.method} nicht erlaubt`);
  }
}
