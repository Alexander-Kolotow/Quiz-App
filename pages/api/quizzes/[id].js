import { dbConnect } from "../../../db/connect";

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  const { db } = await dbConnect();

  switch (method) {
    case "GET":
      try {
        const quiz = await db.collection("quizzes").findOne({ _id: id });
        res.status(200).json(quiz);
      } catch (error) {
        res.status(500).json({ message: "Error retrieving quiz" });
      }
      break;
    case "POST":
      try {
        const { name, questions } = req.body;
        const newQuiz = { name, questions };
        const result = await db.collection("quizzes").insertOne(newQuiz);
        res.status(201).json(result.ops[0]);
      } catch (error) {
        res.status(500).json({ message: "Error creating quiz" });
      }
      break;
    case "PUT":
      try {
        const { name, questions } = req.body;
        const updatedQuiz = { name, questions };
        const result = await db
          .collection("quizzes")
          .updateOne({ _id: id }, { $set: updatedQuiz });
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ message: "Error updating quiz" });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
