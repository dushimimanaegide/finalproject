import { Resend } from "resend"
import { WelcomeEmailTemplate } from "@/components/emails/welcome-email-template"
import React from "react"

const resend = new Resend(process.env.RESEND_API_KEY)

export interface WelcomeEmailData {
  name: string
  email: string
  password: string
  role: string
}

export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if we're in testing mode (no verified domain)
    const isTestingMode = !process.env.RESEND_VERIFIED_DOMAIN
    const testingEmail = "egidedushimimana77@gmail.com" // Your verified email

    // In testing mode, only send to your verified email
    const recipientEmail = isTestingMode ? testingEmail : data.email
    const fromEmail = isTestingMode
      ? "RHIE System <onboarding@resend.dev>"
      : `RHIE System <noreply@${process.env.RESEND_VERIFIED_DOMAIN}>`

    const { data: emailData, error } = await resend.emails.send({
      from: fromEmail,
      to: [recipientEmail],
      subject: isTestingMode
        ? `[TEST] Welcome Email for ${data.name} (${data.email})`
        : "Welcome to Rwanda Health Information Enhancement - Account Created",
      react: React.createElement(WelcomeEmailTemplate, {
        name: data.name,
        email: data.email, // Keep original email in template
        password: data.password,
        role: data.role,
        isTestMode: isTestingMode,
        originalRecipient: data.email,
      }),
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

      return { success: false, error: error.message }
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
