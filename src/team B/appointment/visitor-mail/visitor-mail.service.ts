




import { Injectable, InternalServerErrorException } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import * as QRCode from "qrcode";
import { createCanvas } from "canvas";
import * as fs from "fs";
import * as path from "path";
import { Appointment } from "../appointment.entity";

@Injectable()
export class VisitorMailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'minimilitia1491@gmail.com',
        pass: 'haettvpiejqojvyk', // Ensure this is an App Password
      },
    });
  }

  async sendVisitorQRCode(appointment: Appointment): Promise<void> {
    try {
      const name = appointment.firstname + " " + (appointment.lastname || "");
      const email = appointment.email || "No Email Provided";
      const phone = appointment.contactnumber || "No Phone Provided";
      const date = appointment.date || "No Date Provided";
      const time = appointment.time || "No Time Provided";
      const nationalId = appointment.nationalid || "No National ID Provided";
      // Use process.cwd() to align with controller's path handling
      const photoPath = appointment.photo ? path.join(process.cwd(), appointment.photo) : null;
      const driverPhotoPath = appointment.driverphoto ? path.join(process.cwd(), appointment.driverphoto) : null;
      const gender = appointment.gender || "No Gender Provided";
      const visit = appointment.visit || "No Visit Purpose Provided";
      const personname = appointment.personname || "No Person Name Provided";
      const department = appointment.department || "No Department Provided";
      const durationtime = appointment.durationtime || "No Duration Provided";
      const durationunit = appointment.durationunit || "No Unit Provided";
      const visitortype = appointment.visitortype || "No Visitor Type Provided";
      const vehicletype = appointment.vehicletype || "No Vehicle Type Provided";
      const vehiclenumber = appointment.vehiclenumber || "No Vehicle Number Provided";
      const drivername = appointment.drivername || "No Driver Name Provided";
      const drivermobile = appointment.drivermobile || "No Driver Mobile Provided";
      const drivernationalid = appointment.drivernationalid || "No Driver National ID Provided";
      const driverphoto = appointment.driverphoto ? "Driver Photo Provided" : "No Driver Photo Provided";
      const notes = appointment.notes || "No Notes Provided";

      // QR Code Data
      const qrData = `
🟦══════════════════════════════🟦
        🎫 *VISITOR PASS*        
🟦══════════════════════════════🟦
👤 *Name:*            ${name}          
✉️ *Email:*           ${email}        
📞 *Phone:*           ${phone}        
📅 *Date:*            ${date}        
⏰ *Time:*            ${time}        
🆔 *National ID:*     ${nationalId}    
🚻 *Gender:*          ${gender}        
🎯 *Purpose of Visit:* ${visit}        
👥 *Person to Meet:*  ${personname}    
🏢 *Department:*      ${department}    
⏳ *Duration:*        ${durationtime} ${durationunit}    
🧑‍💼 *Visitor Type:*   ${visitortype}    
🚗 *Vehicle Type:*    ${vehicletype}    
🔢 *Vehicle Number:*  ${vehiclenumber} 
👨‍✈️ *Driver Name:*    ${drivername}    
📱 *Driver Mobile:*   ${drivermobile}  
🆔 *Driver National ID:* ${drivernationalid} 
📸 *Driver Photo:*    ${driverphoto}   
📝 *Notes:*           ${notes}        
🟦══════════════════════════════🟦
✅ *Show this pass at entry*  
📍 *Thank you for visiting!*  
🟦══════════════════════════════🟦
`;

      // Create a canvas for the Visitor Pass with a beautiful card design
      const canvas = createCanvas(400, 600);
      const ctx = canvas.getContext("2d");

      // Card background with gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, 600);
      gradient.addColorStop(0, "#4FC3F7"); // Light Blue
      gradient.addColorStop(1, "#81D4FA"); // Lighter Blue
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Border
      ctx.strokeStyle = "#0288D1";
      ctx.lineWidth = 5;
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

      // Header with elegant styling
      ctx.fillStyle = "white";
      ctx.font = "bold 28px 'Arial'";
      ctx.textAlign = "center";
      ctx.fillText("🎫 Visitor Pass 🎫", canvas.width / 2, 60);

      // Generate QR Code
      const qrCanvas = createCanvas(250, 250);
      await QRCode.toCanvas(qrCanvas, qrData, { margin: 1, color: { dark: "#01579B" } });

      // Place QR code with shadow effect
      ctx.shadowBlur = 10;
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.drawImage(qrCanvas, 75, 100, 250, 250);
      ctx.shadowBlur = 0;

      // Instruction text with elegant font
      ctx.fillStyle = "#01579B";
      ctx.font = "italic 18px 'Arial'";
      ctx.fillText("Show this QR at the entrance", canvas.width / 2, 550);

      // Decorative elements
      ctx.beginPath();
      ctx.arc(50, 50, 20, 0, Math.PI * 2);
      ctx.fillStyle = "#FFCA28";
      ctx.fill();
      ctx.closePath();

      ctx.beginPath();
      ctx.arc(350, 50, 20, 0, Math.PI * 2);
      ctx.fillStyle = "#FFCA28";
      ctx.fill();
      ctx.closePath();

      // Save final QR image
      const qrCodeFilePath = path.join(__dirname, `visitor-${appointment.id}.png`);
      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(qrCodeFilePath, buffer);

      // Additional recipients
      const additionalRecipients = [
        "endeldigital025@gmail.com",
        "parthvaishnav81@gmail.com",
      ];

      // Combine recipient list
      const allRecipients = [appointment.email, ...additionalRecipients].filter(Boolean);

      // Email HTML with a beautiful card-like design
      const emailHtml = `
        <p>Hello,</p>
        <p>A visitor has completed their appointment details. Below are the details in a stylish card:</p>
        <div style="max-width: 600px; background: linear-gradient(to bottom, #4FC3F7, #81D4FA); border: 5px solid #0288D1; border-radius: 15px; padding: 20px; color: #01579B; font-family: Arial, sans-serif;">
          <h2 style="text-align: center; font-size: 28px; margin-bottom: 20px;">🎫 Visitor Pass Details 🎫</h2>
          <div style="background: white; border-radius: 10px; padding: 15px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>National ID:</strong> ${nationalId}</p>
            <p><strong>Gender:</strong> ${gender}</p>
            <p><strong>Purpose of Visit:</strong> ${visit}</p>
            <p><strong>Person to Meet:</strong> ${personname}</p>
            <p><strong>Department:</strong> ${department}</p>
            <p><strong>Duration:</strong> ${durationtime} ${durationunit}</p>
            <p><strong>Visitor Type:</strong> ${visitortype}</p>
            <p><strong>Vehicle Type:</strong> ${vehicletype}</p>
            <p><strong>Vehicle Number:</strong> ${vehiclenumber}</p>
            <p><strong>Driver Name:</strong> ${drivername}</p>
            <p><strong>Driver Mobile:</strong> ${drivermobile}</p>
            <p><strong>Driver National ID:</strong> ${drivernationalid}</p>
            <p><strong>Notes:</strong> ${notes}</p>
            ${photoPath && fs.existsSync(photoPath) ? `<p><strong> Visitor Photo:</strong><br><img src="cid:visitor-photo-${appointment.id}" alt="Visitor Photo" style="max-width: 200px; height: auto; border-radius: 10px; border: 2px solid #0288D1;" /></p>` : '<p><strong>Photo:</strong> No Photo Provided</p>'}
            ${driverPhotoPath && fs.existsSync(driverPhotoPath) ? `<p><strong>Driver Photo:</strong><br><img src="cid:driver-photo-${appointment.id}" alt="Driver Photo" style="max-width: 200px; height: auto; border-radius: 10px; border: 2px solid #0288D1;" /></p>` : '<p><strong>Driver Photo:</strong> No Driver Photo Provided</p>'}
          </div>
          <p style="text-align: center; margin-top: 20px;">Attached is the QR code for this visitor.</p>
        </div>
        <p style="text-align: center; color: #01579B; font-style: italic;">Best Regards,<br>Your Company</p>
      `;

      // Email attachments
      const attachments: nodemailer.SendMailOptions['attachments'] = [
        {
          filename: `Visitor_QR_${appointment.id}.png`,
          path: qrCodeFilePath,
          contentType: "image/png",
        },
      ];

      // Add visitor photo attachment if it exists
      if (photoPath && fs.existsSync(photoPath)) {
        attachments.push({
          filename: `Visitor_Photo_${appointment.id}.png`,
          path: photoPath,
          cid: `visitor-photo-${appointment.id}`, // CID for embedding in HTML
        });
        console.log(`Attached visitor photo from ${photoPath} with CID: visitor-photo-${appointment.id}`);
      }

      // Add driver photo attachment if it exists
      if (driverPhotoPath && fs.existsSync(driverPhotoPath)) {
        attachments.push({
          filename: `Driver_Photo_${appointment.id}.png`,
          path: driverPhotoPath,
          cid: `driver-photo-${appointment.id}`, // CID for embedding in HTML
        });
        console.log(`Attached driver photo from ${driverPhotoPath} with CID: driver-photo-${appointment.id}`);
      }

      // Email configuration
      const mailOptions = {
        from: "minimilitia1491@gmail.com",
        to: allRecipients,
        subject: "Visitor QR Code - Appointment Details",
        html: emailHtml,
        attachments,
      };

      // Log mail options for debugging
      console.log("Mail options:", JSON.stringify(mailOptions, null, 2));

      // Send email
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`QR code email successfully sent to ${allRecipients.join(', ')} with Message ID: ${info.messageId}`);

      // Delete the temporary QR file after sending
      fs.unlinkSync(qrCodeFilePath);
    } catch (error) {
      console.error("Failed to send QR code email:", error);
      throw new InternalServerErrorException('Failed to send QR code email: ' + error.message);
    }
  }
}