// src/controllers/academicAdminController.js
import bcrypt from 'bcryptjs';
import { createAcademicAdmin, findAllAcademicAdmins } from '../models/academicAdminModel.js';
import pool from '../config/db.js';

const getAllAcademicAdmins = async (req, res) => {
  try {
    const admins = await findAllAcademicAdmins(pool);
    res.json({
      success: true,
      academicAdmins: admins  // No stats object anymore
    });
  } catch (error) {
    console.error("Get Academic Admins Error →", error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const createNewAcademicAdmin = async (req, res) => {
  try {
    const { 
      fullName, 
      email, 
      mobile, 
      role, 
      academicAdmins,  // this is branch
      password, 
      confirmPassword, 
      twoFactor 
    } = req.body;

    // VALIDATION
    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        error: "Full name, email, password, and confirm password are required"
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: "Passwords do not match"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 8 characters long"
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const adminData = {
      fullName,
      email,
      mobile: mobile || null,
      role: role || 'Academic Admin',
      branch: academicAdmins,
      passwordHash,
      twoFactor: !!twoFactor
    };

    const newAdmin = await createAcademicAdmin(pool, adminData);

    res.status(201).json({
      success: true,
      message: "Academic Admin created successfully",
      admin: newAdmin  // No stats
    });
  } catch (error) {
    console.error("Create Academic Admin Error →", error.message);
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        error: "Email or username already exists"
      });
    }
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export { getAllAcademicAdmins, createNewAcademicAdmin };