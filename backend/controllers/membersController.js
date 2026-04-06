import Memberships from "../models/memberships.js";
import mongoose from "mongoose";

export const getMembers = async (req, res) => {
  try {
    const { orgId } = req.params;

    const members = await Memberships.find({
      orgId: new mongoose.Types.ObjectId(orgId),
    })
      .select("userId role createdAt")
      .populate("userId", "name email imageUrl");

    const response = members.map((m) => ({
      userId: m.userId._id,
      name: m.userId.name,
      email: m.userId.email,
      imageUrl: m.userId.imageUrl,
      role: m.role,
      createdAt:m.createdAt
    }));
    
    return res.json(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting members", error: error.message });
  }
};
