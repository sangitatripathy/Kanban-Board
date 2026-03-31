import Organisation from "../models/organisation.js";
import Memberships from "../models/memberships.js";

export const createOrganization = async (req, res) => {
  try {
    const { orgName } = req.body;
    const userId = req.user.id;

    const org = Organisation.create({
      name: orgName,
      owner: userId,
    });

    await Memberships.create({
      userId,
      orgId: org._id,
      role: "admin",
    });

    res.status(201).json({
      message: "Organization created",
      org,
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res
      .status(500)
      .json({ message: "Error creating organisation", error: error.message });
  }
};
