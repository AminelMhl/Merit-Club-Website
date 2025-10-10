import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email address" },
        { status: 404 }
      );
    }

    // Create transporter for email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content with Merit TBS branding
    const mailOptions = {
      from: {
        name: "Merit TBS Club",
        address: process.env.EMAIL_USER || "no-reply@merit-tbs.com",
      },
      to: user.email,
      subject: "🔑 Your Merit TBS Password - Password Reset Request",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset - Merit TBS</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f0f0f; color: #ffffff;">
          <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #fccc06 0%, #ffdc4e 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #000000; font-size: 28px; font-weight: bold;">🏆 Merit TBS Club</h1>
              <p style="margin: 10px 0 0 0; color: #333333; font-size: 16px;">Tunisian Business School</p>
            </div>

            <!-- Main Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #fccc06; margin: 0 0 20px 0; font-size: 24px;">Password Reset Request</h2>
              
              <p style="color: #ffffff; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Hello <strong style="color: #fccc06;">${user.name}</strong>,
              </p>
              
              <p style="color: #cccccc; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                You requested a password reset for your Merit TBS Club account. As requested, here are your current login credentials:
              </p>

              <!-- Password Box -->
              <div style="background: rgba(252, 204, 6, 0.1); border: 2px solid #fccc06; border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center;">
                <p style="color: #fccc06; font-size: 14px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Your Password</p>
                <p style="color: #ffffff; font-size: 20px; font-weight: bold; margin: 0; font-family: 'Courier New', monospace; word-break: break-all;">${
                  user.password
                }</p>
              </div>

              <div style="background: rgba(255, 255, 255, 0.05); border-radius: 10px; padding: 20px; margin: 25px 0;">
                <h3 style="color: #fccc06; margin: 0 0 15px 0; font-size: 18px;">📧 Your Account Details:</h3>
                <p style="color: #ffffff; margin: 5px 0; font-size: 16px;"><strong>Email:</strong> ${
                  user.email
                }</p>
                <p style="color: #ffffff; margin: 5px 0; font-size: 16px;"><strong>Name:</strong> ${
                  user.name
                }</p>
              </div>

              <!-- Security Notice -->
              <div style="background: rgba(255, 69, 0, 0.1); border-left: 4px solid #ff4500; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
                <h3 style="color: #ff6b35; margin: 0 0 10px 0; font-size: 16px;">🔒 Security Recommendation</h3>
                <p style="color: #cccccc; font-size: 14px; line-height: 1.5; margin: 0;">
                  For security reasons, we recommend changing your password after logging in. Visit your profile settings to update your credentials.
                </p>
              </div>

              <!-- Login Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${
                  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"
                }" 
                   style="display: inline-block; background: linear-gradient(135deg, #fccc06 0%, #ffdc4e 100%); color: #000000; text-decoration: none; padding: 15px 30px; border-radius: 10px; font-weight: bold; font-size: 16px; box-shadow: 0 10px 20px rgba(252, 204, 6, 0.3); transition: all 0.3s ease;">
                  🚀 Login to Merit TBS Dashboard
                </a>
              </div>

              <p style="color: #888888; font-size: 14px; line-height: 1.5; margin: 30px 0 0 0;">
                If you didn't request this password reset, please ignore this email or contact our support team immediately.
              </p>
            </div>

            <!-- Footer -->
            <div style="background: #111111; padding: 25px 30px; text-align: center; border-top: 1px solid #333333;">
              <p style="color: #666666; font-size: 12px; margin: 0 0 10px 0;">
                © ${new Date().getFullYear()} Merit TBS Club - Tunisian Business School
              </p>
              <p style="color: #666666; font-size: 12px; margin: 0;">
                This email was sent automatically. Please do not reply to this email.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Merit TBS Club - Password Reset

Hello ${user.name},

You requested a password reset for your Merit TBS Club account.

Your login credentials:
Email: ${user.email}
Password: ${user.password}

For security reasons, we recommend changing your password after logging in.

Login at: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"}

If you didn't request this reset, please ignore this email.

© ${new Date().getFullYear()} Merit TBS Club - Tunisian Business School
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: "Password sent to your email address",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Failed to send password reset email" },
      { status: 500 }
    );
  }
}
