import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export interface WelcomeEmailData {
  name: string
  email: string
  password: string
  role: string
}

export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate required environment variables
    if (!process.env.RESEND_API_KEY) {
      return { success: false, error: "RESEND_API_KEY is not configured" }
    }

    // Check if we're in testing mode (no verified domain)
    const isTestingMode = !process.env.RESEND_VERIFIED_DOMAIN
    const testingEmail = "egidedushimimana77@gmail.com" // Your verified email

    // In testing mode, only send to your verified email
    const recipientEmail = isTestingMode ? testingEmail : data.email
    const fromEmail = isTestingMode
      ? "onboarding@resend.dev"
      : `RHIE System <noreply@${process.env.RESEND_VERIFIED_DOMAIN}>`

    // Create HTML email content
    const htmlContent = createEmailHTML({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      isTestMode: isTestingMode,
      originalRecipient: data.email,
    })

    const { data: emailData, error } = await resend.emails.send({
      from: fromEmail,
      to: recipientEmail,
      subject: isTestingMode
        ? `[TEST] Welcome Email for ${data.name} (${data.email})`
        : "Welcome to Rwanda Health Information Enhancement - Account Created",
      html: htmlContent,
    })

    if (error) {
      console.error("Resend email error:", error)

      // Provide specific error messages
      if (error.message?.includes("You can only send testing emails")) {
        return {
          success: false,
          error: "Email sent to your test address instead. To send to actual users, please verify a domain in Resend.",
        }
      }

      if (error.message?.includes("validation_error")) {
        return {
          success: false,
          error: "Email validation failed. Please check the recipient email address format.",
        }
      }

      return { success: false, error: error.message || "Failed to send email" }
    }

    console.log("Email sent successfully:", emailData?.id)

    if (isTestingMode) {
      return {
        success: true,
        error: `Email sent to test address (${testingEmail}) instead of ${data.email}. Verify a domain to send to actual users.`,
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Failed to send welcome email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

function createEmailHTML({
  name,
  email,
  password,
  role,
  isTestMode = false,
  originalRecipient,
}: {
  name: string
  email: string
  password: string
  role: string
  isTestMode?: boolean
  originalRecipient?: string
}): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to RHIE</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
      ${
        isTestMode
          ? `
        <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #f59e0b;">
          <h3 style="margin: 0 0 10px 0; color: #92400e;">🧪 TEST MODE</h3>
          <p style="margin: 0; font-size: 14px;">
            This email was intended for: <strong>${originalRecipient}</strong><br>
            But sent to your test email instead. Verify a domain in Resend to send to actual users.
          </p>
        </div>
      `
          : ""
      }

      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">Welcome to RHIE</h1>
          <p style="margin: 10px 0 0 0;">Rwanda Health Information Enhancement</p>
        </div>

        <div style="padding: 30px; background-color: #f9fafb; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
          <h2>Hello ${name},</h2>

          <p>
            Your account has been successfully created in the Rwanda Health Information Enhancement system. 
            You have been assigned the role of <strong>${role === "ADMIN" ? "Administrator" : "Community Health Worker"}</strong>.
          </p>

          <div style="background-color: #e5e7eb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Your Login Credentials:</h3>
            <p><strong>Email:</strong> ${email}</p>
            <p>
              <strong>Temporary Password:</strong>
              <code style="background-color: #fff; padding: 4px 8px; border-radius: 4px; font-family: monospace;">
                ${password}
              </code>
            </p>
          </div>

          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4>🔒 Important Security Notice:</h4>
            <ul>
              <li>Please change your password after your first login</li>
              <li>Keep your credentials secure and do not share them</li>
              <li>Contact your administrator if you have any issues</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${appUrl}/auth/signin" 
               style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
              Login to Your Account
            </a>
          </div>
        </div>

        <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
          <p>© 2024 Rwanda Health Information Enhancement. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
}
