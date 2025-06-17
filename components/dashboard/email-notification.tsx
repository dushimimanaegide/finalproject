"use client"

import { useEffect } from "react"
import { CheckCircleIcon, XCircleIcon } from "lucide-react"

interface EmailNotificationProps {
  show: boolean
  success: boolean
  message: string
  onClose: () => void
}

export function EmailNotification({ show, success, message, onClose }: EmailNotificationProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, 5000) // Auto-close after 5 seconds

      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show) return null

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg max-w-sm ${
        success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
      }`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {success ? (
            <CheckCircleIcon className="h-5 w-5 text-green-400" />
          ) : (
            <XCircleIcon className="h-5 w-5 text-red-400" />
          )}
        </div>
        <div className="ml-3">
          <p className={`text-sm font-medium ${success ? "text-green-800" : "text-red-800"}`}>
            {success ? "Email Sent" : "Email Failed"}
          </p>
          <p className={`text-sm ${success ? "text-green-700" : "text-red-700"}`}>{message}</p>
        </div>
        <button
          onClick={onClose}
          className={`ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 ${
            success ? "text-green-500 hover:bg-green-100" : "text-red-500 hover:bg-red-100"
          }`}
        >
          <span className="sr-only">Close</span>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
