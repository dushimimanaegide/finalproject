import type * as React from "react"

interface WelcomeEmailTemplateProps {
  name: string
  email: string
  password: string
  role: string
  isTestMode?: boolean
  originalRecipient?: string
}

export const WelcomeEmailTemplate: React.FC<WelcomeEmailTemplateProps> = ({
  name,
  email,
  password,
  role,
  isTestMode = false,
  originalRecipient,
}) => (
  <div style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.6", color: "#333" }}>
    {isTestMode && (
      <div
        style={{
          backgroundColor: "#fef3c7",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
          border: "1px solid #f59e0b",
        }}
      >
        <h3 style={{ margin: "0 0 10px 0", color: "#92400e" }}>🧪 TEST MODE</h3>
        <p style={{ margin: 0, fontSize: "14px" }}>
          This email was intended for: <strong>{originalRecipient}</strong>
          <br />
          But sent to your test email instead. Verify a domain in Resend to send to actual users.
        </p>
      </div>
    )}

    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <div
        style={{
          backgroundColor: "#2563eb",
          color: "white",
          padding: "20px",
          textAlign: "center",
          borderRadius: "8px 8px 0 0",
        }}
      >
        <h1 style={{ margin: 0 }}>Welcome to RHIE</h1>
        <p style={{ margin: "10px 0 0 0" }}>Rwanda Health Information Enhancement</p>
      </div>

      <div
        style={{
          padding: "30px",
          backgroundColor: "#f9fafb",
          borderRadius: "0 0 8px 8px",
          border: "1px solid #e5e7eb",
        }}
      >
        <h2>Hello {name},</h2>

        <p>
          Your account has been successfully created in the Rwanda Health Information Enhancement system. You have been
          assigned the role of <strong>{role === "ADMIN" ? "Administrator" : "Community Health Worker"}</strong>.
        </p>

        <div
          style={{
            backgroundColor: "#e5e7eb",
            padding: "20px",
            borderRadius: "8px",
            margin: "20px 0",
          }}
        >
          <h3>Your Login Credentials:</h3>
          <p>
            <strong>Email:</strong> {email}
          </p>
          <p>
            <strong>Temporary Password:</strong>
            <code
              style={{
                backgroundColor: "#fff",
                padding: "4px 8px",
                borderRadius: "4px",
                fontFamily: "monospace",
              }}
            >
              {password}
            </code>
          </p>
        </div>

        <div
          style={{
            backgroundColor: "#fef3c7",
            padding: "15px",
            borderRadius: "8px",
            margin: "20px 0",
          }}
        >
          <h4>🔒 Important Security Notice:</h4>
          <ul>
            <li>Please change your password after your first login</li>
            <li>Keep your credentials secure and do not share them</li>
            <li>Contact your administrator if you have any issues</li>
          </ul>
        </div>

        <div style={{ textAlign: "center", margin: "30px 0" }}>
          <a
            href={`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/signin`}
            style={{
              display: "inline-block",
              backgroundColor: "#2563eb",
              color: "white",
              padding: "12px 24px",
              textDecoration: "none",
              borderRadius: "8px",
            }}
          >
            Login to Your Account
          </a>
        </div>
      </div>

      <div
        style={{
          textAlign: "center",
          padding: "20px",
          color: "#6b7280",
          fontSize: "12px",
        }}
      >
        <p>© 2024 Rwanda Health Information Enhancement. All rights reserved.</p>
      </div>
    </div>
  </div>
)
