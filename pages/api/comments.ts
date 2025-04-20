import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import type { MongoClient, Db, Collection, Document } from "mongodb";

// Define the shape of a comment document
interface CommentDoc extends Document {
  name: string;
  message: string;
  rating?: number;
  createdAt: Date;
}

// Define the response shape for GET
interface GetCommentsResponse {
  comments: CommentDoc[];
  averageRating: number;
  totalVoters: number;
}

// Define the request body shape for POST
interface PostCommentBody {
  name: string;
  message: string;
  rating: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    GetCommentsResponse | { message: string; error?: string }
  >
) {
  // Ensure clientPromise is typed as Promise<MongoClient>
  const client: MongoClient = await clientPromise;
  const db: Db = client.db("Dzull");
  const collection: Collection<CommentDoc> = db.collection("comments");

  if (req.method === "POST") {
    const { name, message, rating } = req.body as PostCommentBody;
    if (!name || !message || rating == null) {
      return res
        .status(400)
        .json({
          message: "Missing fields",
          error: "name, message, and rating are required",
        });
    }

    // Insert with timestamp
    await collection.insertOne({
      name,
      message,
      rating,
      createdAt: new Date(),
    });
    return res.status(201).json({ message: "Comment saved" });
  }

  if (req.method === "GET") {
    // Fetch and type the comments array
    const comments: CommentDoc[] = await collection.find({}).toArray();
    const totalVoters: number = comments.length;
    const totalRating: number = comments.reduce(
      (sum: number, c: CommentDoc) => sum + (c.rating || 0),
      0
    );
    const averageRating: number =
      totalVoters > 0 ? totalRating / totalVoters : 0;

    const response: GetCommentsResponse = {
      comments,
      averageRating,
      totalVoters,
    };
    return res.status(200).json(response);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ message: "Method not allowed" });
}
