import nodemailer from "nodemailer";  
import dotenv from 'dotenv';
import sysLogger, { errorLogger } from "../middleware/logger.js";

dotenv.config({path: `./.env`});
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVICE,
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
});


const taskAssignee = async (email, username, task) => {
  const {title, description, dueDate, priority, status, creator} = task
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Task Assigned: ${title}`,
      text: `Hi ${username},\n\nYou have been assigned a new task titled "${title}" by ${creator.username}. Please log in to view the details.\n\nVisit: http://${process.env.HOST}/dashboard`,

      html: `
        <b>Hi ${username},</b><br><br>

        You have been assigned a new task on <b>Task Management Server</b>!<br><br>

        <b>Task Details:</b><br>
        <ul>
          <li><b>Title:</b> ${title}</li>
          <li><b>Description:</b> ${description}</li>
          <li><b>Due Date:</b> ${dueDate}</li>
          <li><b>Priority:</b> ${priority}</li>
          <li><b>Status:</b> ${status}</li>
          <li><b>Assigned By:</b> ${creator.username}</li>
        </ul>

        Please log in to your dashboard to manage the task:<br>
        <a href="http://${process.env.HOST}/dashboard">http://${process.env.HOST}/dashboard</a><br><br>

        If you have questions, contact support at <a href="mailto:support@example.com">support@example.com</a>.<br><br>

        Best regards,<br>
        <b>Node Server Team</b>
      `
    }); 
    sysLogger.info(`Email sent successfully , ${info.messageId}`);
    return info;
  } catch (error) { 
    errorLogger.error("Failed to send email:", error);
    return error;
  }
};



export const sendMailNotification = {
  taskAssignee
};