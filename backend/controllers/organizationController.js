import Organisation from "../models/organisation.js";
import Memberships from "../models/memberships.js";
import mongoose from 'mongoose';

export const createOrganization = async (req, res) => {
  try {
    const { orgName } = req.body;
    const userId = req.user.id;

    const org = await Organisation.create({
      name: orgName,
      owner: userId,
    });

    const membership = await Memberships.create({
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

export const getOrganization = async (req, res) => {
  try {
    const userId = req.user.id;
  
    const org = await Organisation.find({owner: new mongoose.Types.ObjectId(userId)})
    
    if(!org){
      return res.status(404).json({message:"Organization doesn't exist"})
    }
    return res.status(200).json({
      org
    })
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting organization", error: error.message });
  }
};

export const getOrganizationById = async(req,res) =>{
   try {
    const { orgId } = req.params;
    const userId = req.user.id;

    const org = await Organisation.findById(orgId);

    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }

    if (org.owner.toString() === userId) {
      return res.status(200).json(org);
    }

    const membership = await Memberships.findOne({
      orgId,
      userId,
    });

    if (!membership) {
      return res.status(403).json({ message: "Access denied" });
    }

    return res.status(200).json(org);

  } catch (error) {
    res.status(500).json({ message: "Error getting organization" });
  }
}