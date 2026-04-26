import Membership from "../models/memberships.js";
import Board from "../models/Board/boards.js";
import Card from "../models/Board/cards.js";
import mongoose from "mongoose";

export const getUserDashboard = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const orgCount = await Membership.countDocuments({
      userId,
    });
    const boards = await Board.find({
      "members.user": userId,
    }).select("_id");

    const boardIds = boards.map((b) => b._id);

    const boardCount = boardIds.length;

    const cards = await Card.find({
      assignees: userId,
      isArchived: false,
    });

    const totalCards = cards.length;

    let high = 0,
      medium = 0,
      low = 0;

    cards.forEach((card) => {
      if (card.priority === "High") high++;
      else if (card.priority === "Medium") medium++;
      else low++;
    });

    const now = new Date();

    const overdue = cards.filter(
      (card) => card.dueDate && new Date(card.dueDate) < now,
    ).length;

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setDate(start.getDate() + 7);
    end.setHours(23, 59, 59, 999);

    const upcomingDeadlines = await Card.find({
      assignees: userId,
      dueDate: { $gte: start, $lte: end },
      isArchived: false,
    })
      .sort({ dueDate: 1 })
      .select("cardName dueDate priority boardId");

    res.json({
      totalCards,
      priority: {
        high,
        medium,
        low,
      },
      overdue,
      orgCount,
      boardCount,
      upcomingDeadlines,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching dashboard",
      error: error.message,
    });
  }
};

export const getUserActivity = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const boards = await Board.find({
      "members.user": userId,
    }).select("_id");

    const boardIds = boards.map((b) => b._id);

    if (boardIds.length === 0) {
      return res.json([]);
    }

    const today = new Date();
    const last30Days = new Date();
    last30Days.setDate(today.getDate() - 29);

    const created = await Card.aggregate([
      {
        $match: {
          boardId: { $in: boardIds },
          createdAt: { $gte: last30Days },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    const updated = await Card.aggregate([
      {
        $match: {
          boardId: { $in: boardIds },
          updatedAt: { $gte: last30Days },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$updatedAt",
            },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    const map = {};

    created.forEach((c) => {
      map[c._id] = { date: c._id, created: c.count, updated: 0 };
    });

    updated.forEach((u) => {
      if (!map[u._id]) {
        map[u._id] = { date: u._id, created: 0, updated: u.count };
      } else {
        map[u._id].updated = u.count;
      }
    });
    const result = [];
    let current = new Date(last30Days);

    while (current <= today) {
      const dateStr = current.toISOString().split("T")[0];

      result.push(map[dateStr] || { date: dateStr, created: 0, updated: 0 });

      current.setDate(current.getDate() + 1);
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user activity",
      error: error.message,
    });
  }
};
