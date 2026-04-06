import Membership from "../models/memberships.js"
import mongoose from 'mongoose';

export const isAdmin = async (req,res,next) =>{
  const { orgId } = req.body;

  const membership = await Membership.findOne({
    orgId: new mongoose.Types.ObjectId(orgId),
    userId: new mongoose.Types.ObjectId(req.user.id)
  })

  if(!membership || membership.role !== "admin"){
    return res.status(403).json({message:"Not allowed"})
  }
  next()
}