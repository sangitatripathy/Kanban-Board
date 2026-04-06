import crypto from "crypto";
import mongoose from "mongoose";
import Memberships from "../models/memberships.js";
import Invite from "../models/inivites.js";
import Organisation from "../models/organisation.js";
import { sendEmail } from "../utility/sendEmail.js";

export const sendInvite = async (req, res) => {
  try {
    const { email, orgId, role } = req.body;
    const userId = req.user.id;

    const membership = await Memberships.findOne({
      orgId: new mongoose.Types.ObjectId(orgId),
      userId: new mongoose.Types.ObjectId(req.user.id),
    });

    if (!membership || membership.role !== "admin") {
      return res.status(403).json({ message: "Only admin can invite" });
    }

    const existingInvite = await Invite.findOne({
      email,
      orgId,
      status: "pending",
    });

    if (existingInvite) {
      return res.status(400).json({ message: "User alreday exists" });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const invite = await Invite.create({
      email,
      orgId,
      role,
      invitedBy: userId,
      token: hashedToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    const org = await Organisation.findById(orgId);

    const inviteLink = `${process.env.CLIENT_URL}/invite/accept/${rawToken}`;

    await sendEmail({
      email: email,
      subject: "You're invited to join a workspace",
      html: `
        <h2>You're invited to join ${org.orgName}</h2>
        <p>Role: ${role}</p>
        <a href="${inviteLink}">Accept Invite</a>
        <p>This link expires in 24 hours</p>
      `,
    });

    res.status(201).json({
      message: "Invite sent successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const verifyInvite = async (req, res) => {
  try {
    const token = req.params.token;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const invite = await Invite.findOne({ token: hashedToken })
      .populate("orgId", "name")
      .populate("invitedBy", "name");

    if (!invite) {
      return res.status(404).json({ message: "Invalid Invite" });
    }

    if (invite.status != "pending") {
      return res.status(404).json({ message: "Invite already used" });
    }

    if (invite.expiresAt < new Date()) {
      invite.status = "expired";
      await invite.save();
      return res.status(400).json({ msg: "Invite expired" });
    }

    res.json({
      email: invite.email,
      role: invite.role,
      orgName: invite.orgId.name,
      invitedBy: invite.invitedBy.name,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const acceptInvite = async (req, res) => {
  try {
    const { token } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const invite = await Invite.findOne({ token: hashedToken });

    if (!invite) return res.status(404).json({ msg: "Invalid invite" });

    if (invite.status !== "pending") {
      return res.status(400).json({ msg: "Already used" });
    }

    if (invite.expiresAt < new Date()) {
      invite.status = "expired";
      await invite.save();
      return res.status(400).json({ msg: "Expired" });
    }

    const user = await User.findById(req.user.id);

    if (user.email !== invite.email) {
      return res.status(403).json({
        msg: "This invite was sent to another email",
      });
    }

    const existing = await Memberships.findOne({
      userId: user._id,
      orgId: invite.orgId,
    });

    if (existing) {
      return res.status(400).json({ msg: "Already member" });
    }

    await Memberships.create({
      userId: user._id,
      orgId: invite.orgId,
      role: invite.role,
    });

    invite.status = "accepted";
    await invite.save();

    res.json({ msg: "Joined successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrgInvites = async (req, res) => {
  try {
    const { orgId } = req.params;

    const invites = await Invite.find({
      orgId,
      status: "pending",
    });

    res.json(invites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const cancelInvite = async (req, res) => {
  try {
    const { inviteId } = req.params;

    const invite = await Invite.findById(inviteId);

    if (!invite) return res.status(404).json({ msg: "Not found" });

    invite.status = "cancelled";
    await invite.save();

    res.json({ msg: "Invite cancelled" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
