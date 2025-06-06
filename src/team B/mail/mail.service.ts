import { Injectable, InternalServerErrorException } from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'minimilitia1491@gmail.com',
      pass: 'haettvpiejqojvyk',
    },
  });

  async sendAppointmentEmail(visitorEmail: string, date: string, allocatedTime: string, formLink: string) {
<<<<<<< HEAD
    const ndaFormLink = `http://192.168.3.77:8000/nda-form.html?email=${encodeURIComponent(visitorEmail)}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(allocatedTime)}`;
    const safetyVideoLink = `http://192.168.3.77:8000/safety-video.html?email=${encodeURIComponent(visitorEmail)}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(allocatedTime)}`;
=======
    const ndaFormLink = `https://192.168.3.75:3001/nda-form.html?email=${encodeURIComponent(visitorEmail)}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(allocatedTime)}`;
    const safetyVideoLink = `https://192.168.3.75:3001/safety-video.html?email=${encodeURIComponent(visitorEmail)}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(allocatedTime)}`;
>>>>>>> 31ba3ac30fa8754b6e72757f1154dfdea968e156
    const mailOptions = {
      from: `"Endel Digital" <parthvaishnav81@gmail.com>`,
      to: visitorEmail,
      subject: "Your Appointment Details",
      html: `<p>Your appointment is scheduled for <strong>${date}</strong> at <strong>${allocatedTime}</strong>.</p>
             <p>Click <a href="${formLink}">here</a> to complete your details.</p>
             <p>Click <a href="${ndaFormLink}">here</a> to complete the NDA form.</p>
             <p>Click <a href="${safetyVideoLink}">here</a> to watch the safety video and acknowledge the terms.</p>`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email successfully sent to ${visitorEmail} with NDA form link: ${ndaFormLink} and safety video link: ${safetyVideoLink}`);
    } catch (error) {
      console.error(`❌ Failed to send email to ${visitorEmail}:`, error);
      throw new InternalServerErrorException('Failed to send appointment email.');
    }
  }
}