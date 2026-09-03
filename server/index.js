/**
 * NEXUS ORIGIN SOLUTION - Express.js & MongoDB Backend API Server
 * Full automation engine for Manpower Requests, Candidate Resumes, Cloudinary Uploads, Nodemailer & Google Sheets API.
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'nexus_super_secret_jwt_key_2026';
const GOOGLE_APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL || '';

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// In-Memory Database Store (with MongoDB API interface readiness)
let requirementsDB = [
  {
    id: 'req-101',
    createdAt: new Date().toISOString(),
    companyName: 'Apex Manufacturing Pvt Ltd',
    contactPerson: 'Vikram Malhotra',
    phone: '8102899935',
    email: 'hr@apexmanufacturing.in',
    website: 'https://apexmanufacturing.in',
    industry: 'Manufacturing',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    jobPosition: 'CNC Machine Operators & Welders',
    employeesRequired: 25,
    requiredSkills: 'CNC Programming, VMC operation, 6G TIG Welding',
    experienceRequired: '2-5 Years',
    salaryRange: '₹22,000 - ₹35,000 / month',
    employmentType: 'Contractual Staffing',
    joiningDate: '2026-08-15',
    jobDescription: 'Required 25 certified CNC operators for 3-shift factory operation in Pune industrial zone.',
    jdFileUrl: 'https://cloudinary.com/sample_jd_apex.pdf',
    notes: 'Urgent deployment needed within 48 hours.',
    status: 'In Progress'
  },
  {
    id: 'req-102',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    companyName: 'TechVision Infotech',
    contactPerson: 'Ananya Sharma',
    phone: '8102899935',
    email: 'careers@techvision.com',
    website: 'https://techvision.com',
    industry: 'IT',
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
    jobPosition: 'Web Development & Maintenance Engineers',
    employeesRequired: 8,
    requiredSkills: 'React, Node.js, Website Maintenance, Security Updates, PHP',
    experienceRequired: '3-6 Years',
    salaryRange: '₹60,000 - ₹95,000 / month',
    employmentType: 'Permanent Recruitment',
    joiningDate: '2026-08-20',
    jobDescription: 'Senior full-stack developers for web app creation & 24/7 site maintenance.',
    jdFileUrl: 'https://cloudinary.com/sample_jd_techvision.pdf',
    notes: 'Remote candidates allowed.',
    status: 'Pending'
  }
];

let careersDB = [];

// Nodemailer Transporter Configuration (Optional production setup)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'nexusoriginsolution@gmail.com',
    pass: process.env.SMTP_PASS || 'app_password_placeholder'
  }
});

async function logToGoogleSheet(reqData) {
  if (!GOOGLE_APPS_SCRIPT_URL) return;

  try {
    await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...reqData,
        submittedAt: new Date().toISOString(),
        submittedAtIST: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
      })
    });
  } catch (err) {
    console.log('Google Sheet log error:', err.message);
  }
}

// Helper to send automated emails
async function dispatchEmails(reqData) {
  try {
    // 1. Email to Nexus HR
    const nexusEmailOptions = {
      from: '"Nexus Origin Portal" <nexusoriginsolution@gmail.com>',
      to: 'nexusoriginsolution@gmail.com',
      subject: `🚨 NEW MANPOWER REQUIREMENT: ${reqData.companyName} (${reqData.employeesRequired} Workers)`,
      html: `
        <h2>New Manpower Requirement Received</h2>
        <p><strong>Company:</strong> ${reqData.companyName}</p>
        <p><strong>Contact Person:</strong> ${reqData.contactPerson}</p>
        <p><strong>Phone:</strong> ${reqData.phone}</p>
        <p><strong>Email:</strong> ${reqData.email}</p>
        <p><strong>Position:</strong> ${reqData.jobPosition}</p>
        <p><strong>Workers Required:</strong> ${reqData.employeesRequired}</p>
        <p><strong>City/Location:</strong> ${reqData.city}, ${reqData.state}</p>
        <p><strong>Salary Range:</strong> ${reqData.salaryRange}</p>
        <p><strong>Joining Date:</strong> ${reqData.joiningDate}</p>
      `
    };

    // 2. Confirmation Email to Client
    const clientEmailOptions = {
      from: '"Nexus Origin Solution" <nexusoriginsolution@gmail.com>',
      to: reqData.email,
      subject: 'Thank You for Contacting Nexus Origin Solution',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
          <h2 style="color: #0284c7;">Nexus Origin Solution</h2>
          <p>Dear ${reqData.contactPerson},</p>
          <p>Thank you for submitting your manpower requirement for <strong>${reqData.companyName}</strong>.</p>
          <p>Our recruitment team has successfully received your request for <strong>${reqData.employeesRequired} × ${reqData.jobPosition}</strong>.</p>
          <p>One of our HR specialists will contact you at <strong>${reqData.phone}</strong> within 24 hours.</p>
          <br/>
          <p>Regards,</p>
          <p><strong>Nexus Origin Solution</strong><br/>Helpline: 8102899935</p>
        </div>
      `
    };

    if (process.env.SMTP_USER) {
      await transporter.sendMail(nexusEmailOptions);
      await transporter.sendMail(clientEmailOptions);
    }
  } catch (err) {
    console.log('Email notification log:', err.message);
  }
}

// REST API ENDPOINTS

// 1. Submit New Manpower Requirement
app.post('/api/requirements', async (req, res) => {
  try {
    const data = req.body;
    const newRequirement = {
      id: 'req-' + Date.now(),
      createdAt: new Date().toISOString(),
      companyName: data.companyName || 'N/A',
      contactPerson: data.contactPerson || 'N/A',
      phone: data.phone || '8102899935',
      email: data.email || 'N/A',
      website: data.website || '',
      industry: data.industry || 'General Industry',
      city: data.city || 'N/A',
      state: data.state || 'N/A',
      country: data.country || 'India',
      jobPosition: data.jobPosition || 'General Workforce',
      employeesRequired: Number(data.employeesRequired) || 1,
      requiredSkills: data.requiredSkills || '',
      experienceRequired: data.experienceRequired || '0-2 Years',
      salaryRange: data.salaryRange || 'As per industry standards',
      employmentType: data.employmentType || 'Contractual',
      joiningDate: data.joiningDate || new Date().toISOString().split('T')[0],
      jobDescription: data.jobDescription || '',
      jdFileUrl: data.jdFileUrl || '',
      notes: data.notes || '',
      status: 'Pending'
    };

    requirementsDB.unshift(newRequirement);

    // Save request to Google Sheet with date/time if configured
    await logToGoogleSheet(newRequirement);

    // Trigger Email Dispatch
    await dispatchEmails(newRequirement);

    return res.status(201).json({
      success: true,
      message: 'Requirement submitted successfully! HR will contact you within 24h.',
      data: newRequirement
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Submit Career Candidate Resume
app.post('/api/careers', (req, res) => {
  const application = {
    id: 'app-' + Date.now(),
    createdAt: new Date().toISOString(),
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    appliedRole: req.body.appliedRole,
    resumeUrl: req.body.resumeUrl || ''
  };
  careersDB.unshift(application);
  return res.status(201).json({ success: true, message: 'Application received!', data: application });
});

// 3. Admin Authentication Login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && (password === 'nexus2026' || password === 'admin')) {
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '12h' });
    return res.json({ success: true, token });
  }
  return res.status(401).json({ success: false, message: 'Invalid Admin Credentials' });
});

// 4. Get All Requirements (Admin Endpoint)
app.get('/api/admin/requirements', (req, res) => {
  return res.json({ success: true, data: requirementsDB });
});

// 5. Update Requirement Status
app.patch('/api/admin/requirements/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const item = requirementsDB.find(r => r.id === id);
  if (item) {
    item.status = status;
    return res.json({ success: true, data: item });
  }
  return res.status(404).json({ success: false, message: 'Not found' });
});

// 6. Delete Requirement
app.delete('/api/admin/requirements/:id', (req, res) => {
  const { id } = req.params;
  requirementsDB = requirementsDB.filter(r => r.id !== id);
  return res.json({ success: true, message: 'Requirement deleted' });
});

app.listen(PORT, () => {
  console.log(`🚀 Nexus Origin Solution API Server running on port ${PORT}`);
});
