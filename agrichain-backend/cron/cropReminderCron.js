// agrichain-backend/cron/cropReminderCron.js
const cron = require("node-cron");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const Crop = require("../models/Crop").default || require("../models/Crop");
const User = require("../models/User");

// Setup Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // e.g. "your.email@gmail.com"
    pass: process.env.EMAIL_PASS, // App Password
  },
});

const sendEmail = async (to, subject, text) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log(`[Email Mock] To: ${to} | Subject: ${subject} | Text: ${text}`);
      return;
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
    console.log(`✅ Email sent to ${to} for subject: ${subject}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

const runCropReminders = async () => {
  console.log("⏳ Running Crop Reminder Cron Job...");
  try {
    const crops = await Crop.find({ isCompleted: false }).populate("farmerId", "name email points");

    const now = new Date();
    // Use start of day for accurate day-based calculations
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    for (let crop of crops) {
      if (!crop.farmerId) continue;

      const farmer = crop.farmerId;
      
      // Calculate total days based on duration
      const n = Number(crop.durationNumber || 0);
      const p = crop.durationPeriod;
      let totalDays = 0;
      if (p === "week") totalDays = n * 7;
      else if (p === "month") totalDays = n * 30;
      else if (p === "year") totalDays = n * 365;

      const start = crop.createdAt || (crop._id && crop._id.getTimestamp && crop._id.getTimestamp());
      if (!start || !totalDays) continue;

      // Ensure tracking arrays exist
      if (!crop.sentReminders) crop.sentReminders = [];
      if (!crop.penalizedPeriods) crop.penalizedPeriods = [];

      // Calculate 4 period ends (deadlines)
      const periodLength = totalDays / 4;
      const periodEnds = [];
      for (let i = 0; i < 4; i++) {
        const e = new Date(start.getTime() + Math.round((i + 1) * periodLength) * 24 * 60 * 60 * 1000);
        periodEnds.push(e);
      }

      // Determine the CURRENT period the farmer should be working on.
      // We look at how many periods are already completed by checking progressPhotos.
      const currentIdx = (crop.progressPhotos || []).length;

      if (currentIdx >= 4) {
        crop.isCompleted = true;
        await crop.save();
        continue;
      }

      const currentDeadline = periodEnds[currentIdx];
      // Strip time from deadline for easy comparison
      const deadlineDate = new Date(currentDeadline.getFullYear(), currentDeadline.getMonth(), currentDeadline.getDate());

      const diffTime = deadlineDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

      // Check what emails have been sent for this period
      const sentTypes = crop.sentReminders
        .filter(r => r.periodIndex === currentIdx)
        .map(r => r.type);

      console.log(`[DEBUG] Crop: ${crop.cropName} | Farmer: ${farmer.email} | Deadline: ${deadlineDate.toDateString()} | diffDays: ${diffDays} | Sent Emails: ${sentTypes.join(",")}`);

      // Situation 1: 1 Day Before Deadline
      if (diffDays === 1 && !sentTypes.includes("1_DAY_BEFORE")) {
        await sendEmail(
          farmer.email,
          "Reminder: Update Your Crop Photos Tomorrow!",
          `Hello ${farmer.name},\n\nFriendly reminder that you need to upload your crop photos for phase ${currentIdx + 1} of your ${crop.cropName} crop by TOMORROW.\n\nPlease log in and update your photos to avoid losing points!`
        );
        crop.sentReminders.push({ periodIndex: currentIdx, type: "1_DAY_BEFORE", sentAt: new Date() });
      }

      // Situation 2: On the Deadline Day
      else if (diffDays === 0 && !sentTypes.includes("ON_DEADLINE")) {
        await sendEmail(
          farmer.email,
          "URGENT: Update Your Crop Photos TODAY!",
          `Hello ${farmer.name},\n\nToday is the deadline to upload your crop photos for phase ${currentIdx + 1} of your ${crop.cropName} crop.\n\nPlease log in and update your photos TODAY to earn points and avoid point deductions!`
        );
        crop.sentReminders.push({ periodIndex: currentIdx, type: "ON_DEADLINE", sentAt: new Date() });
      }

      // Situation 3: Missed the Deadline (Penalty)
      else if (diffDays < 0 && !crop.penalizedPeriods.includes(currentIdx)) {
        // Point deduction
        const currentPoints = farmer.points || 0;
        farmer.points = Math.max(0, currentPoints - 10); // Deduct 10 points, don't go below 0
        await farmer.save();

        await sendEmail(
          farmer.email,
          "Alert: You Missed Your Crop Update Deadline",
          `Hello ${farmer.name},\n\nYou missed the deadline for phase ${currentIdx + 1} of your ${crop.cropName} crop.\n\nAs a result, 10 points have been deducted from your account. Please try to stay on schedule for the next phases to earn points!`
        );

        crop.penalizedPeriods.push(currentIdx);
        crop.sentReminders.push({ periodIndex: currentIdx, type: "MISSED", sentAt: new Date() });
      }

      await crop.save();
    }
    console.log("✅ Crop Reminder Cron completed.");
  } catch (err) {
    console.error("❌ Error in Crop Reminder Cron:", err);
  }
};

// default: "0 8 * * *" -> every day at 8 AM
// For testing: "* * * * *" -> every minute
const startCron = () => {
  cron.schedule("* * * * *", () => {
    runCropReminders();
  });
  console.log("🕒 Crop Reminder Cron Job registered! (Runs every minute for testing)");
  // Run it immediately on startup for testing
  runCropReminders();
};

module.exports = { startCron, runCropReminders };
