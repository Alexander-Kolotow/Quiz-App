import Quiz from "../../../db/models/Quiz";
import dbConnect from "../../../db/connect";

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  // Stelle eine Verbindung zur DB her, wenn noch nicht geschehen
  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const quiz = await Quiz.findById(id);
        if (!quiz) {
          return res.status(404).json({ message: "Quiz not found" });
        }
        res.status(200).json(quiz);
      } catch (error) {
        res.status(500).json({ message: "Error retrieving quiz", error: error.message });
      }
      break;
    case "PUT":
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
      // Aktualisiere den "Allow"-Header, um nur "GET" und "PUT" Methoden zu erlauben
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
