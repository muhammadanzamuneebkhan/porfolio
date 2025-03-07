/** @format */

import asyncHandler from 'express-async-handler';
import { createError } from 'http-errors-enhanced';
import { uploadToCloudinary } from '../utils/CloudinaryWrapper.js';
import { SkillModel } from '../models/SkillModel.js';
const createSkill = asyncHandler(async (req, res, next) => {
  const { SkillIcon } = req.files;
  const { title, proficiency } = req.body;
  const userId = req.user.id; // Assuming user authentication middleware sets `req.user`

  if (!title || !proficiency || !SkillIcon) {
    return next(
      createError(400, 'Title, proficiency, and skill icon are required')
    );
  }

  const SkillRes = await uploadToCloudinary(SkillIcon.tempFilePath, 'Skill');
  const existingSkill = await SkillModel.findOne({ title });

  if (existingSkill) {
    return next(createError(400, 'Skill already exists'));
  }

  const newSkill = new SkillModel({
    userId,
    title,
    proficiency,
    SkillIcon: {
      public_id: SkillRes.public_id,
      url: SkillRes.url,
    },
  });

  await newSkill.save();
  res.status(201).json({
    success: true,
    message: 'Skill created successfully',
    skill: newSkill,
  });
});

const getSkills = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  if (!userId) {
    return next(createError(400, 'User not found'));
  }

  const skills = await SkillModel.find({ userId }).sort({ createdAt: -1 }); // Sort by creation date
  res
    .status(200)
    .json({ success: true, message: 'Skill Fetch successfully', skills });
});

const deleteSkill = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(404).json({ success: false, message: 'Skill not found' });
  }

  const deletedSkill = await SkillModel.findByIdAndDelete(id);

  if (!deletedSkill) {
    return res.status(404).json({ success: false, message: 'Skill not found' });
  }

  res
    .status(200)
    .json({ success: true, message: 'Skill deleted successfully' });
});
const updateSkill = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(createError(404, 'Skill not found'));
  }
  const { body, user } = req;
  //   console.log(user);
  //   console.log(body);
  //   console.log(body?.proficiency);
  const { files } = req;
  //   console.log(files);
  const skill = await SkillModel.findById(id);
  if (!skill) {
    return next(createError(404, 'Skill not found'));
  }
  const userSkillData = {
    title: body?.title || user?.title,
    proficiency: body?.proficiency || user?.proficiency,
  };
  if (files && files.SkillIcon) {
    if (skill.SkillIcon?.public_id) {
      await uploadToCloudinary.destroy(skill.SkillIcon.public_id); // Destroy the previous image
    }
    const uploadedSkillIcon = await uploadToCloudinary(
      SkillIcon.tempFilePath,
      'Skill'
    );
    userSkillData.SkillIcon = {
      public_id: uploadedSkillIcon.public_id,
      url: uploadedSkillIcon.url,
    };
  }
  const updatedSkill = await SkillModel.findByIdAndUpdate(id, userSkillData, {
    new: true,
    runValidators: true,
  });
  if (!updatedSkill) {
    return next(createError(404, 'Skill not found'));
  }
  res.status(200).json({
    success: true,
    message: 'Skill updated successfully',
    skill: updatedSkill,
  });
});
const getSkillById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(createError(400, 'Skill ID is required'));
  }

  const skill = await SkillModel.findById(id); // Fetch specific skill by ID
  if (!skill) {
    return next(createError(404, 'Skill not found'));
  }

  res.status(200).json({
    success: true,
    message: 'Skill fetched successfully',
    skill,
  });
});

export { createSkill, getSkills, deleteSkill, updateSkill, getSkillById };
