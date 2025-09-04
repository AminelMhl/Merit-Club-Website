import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!process.env.EMAIL_USER) {
      return NextResponse.json(
        { error: "Email sender address is not configured" },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "belgacem.salh@gmail.com",
      subject: `Merit Club TBS Contact Form: ${subject}`,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
  <div style="background-color: #000000; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: #fccc06; margin: 0; font-size: 24px;">Merit Club TBS</h1>
    <p style="color: #ffffff; margin: 5px 0 0 0;">New Contact Form Submission</p>
  </div>
  
  <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <h2 style="color: #333333; margin-top: 0; border-bottom: 2px solid #fccc06; padding-bottom: 10px;">Contact Details</h2>
    
    <div style="margin-bottom: 20px;">
      <strong style="color: #fccc06;">Name:</strong>
      <p style="margin: 5px 0; color: #333333; font-size: 16px;">${name}</p>
    </div>
    
    <div style="margin-bottom: 20px;">
      <strong style="color: #fccc06;">Email:</strong>
      <p style="margin: 5px 0; color: #333333; font-size: 16px;">
        <a href="mailto:${email}" style="color: #0066cc; text-decoration: none;">${email}</a>
      </p>
    </div>
    
    <div style="margin-bottom: 20px;">
      <strong style="color: #fccc06;">Subject:</strong>
      <p style="margin: 5px 0; color: #333333; font-size: 16px;">${subject}</p>
    </div>
    
    <div style="margin-bottom: 20px;">
      <strong style="color: #fccc06;">Message:</strong>
      <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #fccc06; margin-top: 10px; border-radius: 4px;">
        <p style="margin: 0; color: #333333; font-size: 16px; line-height: 1.5;">${message.replace(
          /\n/g,
          "<br>"
        )}</p>
      </div>
    </div>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666;">
      <p style="margin: 0;"><strong>Sent via:</strong> Merit Club TBS Website Contact Form</p>
      <p style="margin: 5px 0 0 0;"><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
    </div>
  </div>
  
  <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
    <p>Merit Club TBS - Tunis Business School</p>
  </div>
</div>
      `,
      // Plain text fallback
      text: `
Merit Club TBS - New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

Sent: ${new Date().toLocaleString()}
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
