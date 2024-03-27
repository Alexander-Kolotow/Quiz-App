import Quiz from "../../../db/models/Quiz";
import dbConnect from "../../../db/connect";
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { id } = req.query;
  
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
      case "PATCH":
      try {
        const result = await Quiz.findByIdAndUpdate(id, { $set: req.body }, { new: true });
        if (!result) {
          return res.status(404).json({ message: "Quiz not found" });
        }
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ message: "Error updating quiz", error: error.message });
      }
      break;
    default:
      
      res.setHeader("Allow", ["GET", "PUT", "PATCH"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
