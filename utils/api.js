// Centralized API call handler with integrated paths and error handling
import { API_ENDPOINTS } from '@/config/paths'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

/**
 * Make authenticated API calls with automatic JWT token injection
 * @param {string} endpoint - API endpoint path
 * @param {object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise} Response data
 */
export async function apiCall(endpoint, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    const data = await response.json()

    if (!response.ok) {
      // Handle specific error cases
      if (response.status === 401) {
        // Clear auth on unauthorized
        if (typeof window !== 'undefined') {
          localStorage.removeItem("token")
          localStorage.removeItem("userType")
          localStorage.removeItem("userId")
          window.location.href = '/login'
        }
      }
      throw new Error(data.message || `API Error: ${response.status}`)
    }

    return data
  } catch (error) {
    console.error('[v0] API Error:', error)
    throw error
  }
}

/**
 * Helper function to create reports
 */
export async function createReport(reportData) {
  return apiCall(API_ENDPOINTS.REPORT_CREATE, {
    method: "POST",
    body: JSON.stringify(reportData),
  })
}

/**
 * Helper function to fetch all reports
 */
export async function getReports(status = 'all') {
  return apiCall(`${API_ENDPOINTS.REPORT_LIST}?status=${status}`)
}

/**
 * Helper function to get single report
 */
export async function getReport(id) {
  return apiCall(API_ENDPOINTS.REPORT_GET(id))
}

/**
 * Helper function to update report status
 */
export async function updateReportStatus(id, status) {
  return apiCall(API_ENDPOINTS.REPORT_UPDATE(id), {
    method: "PUT",
    body: JSON.stringify({ status }),
  })
}

/**
 * Helper function to delete report
 */
export async function deleteReport(id) {
  return apiCall(API_ENDPOINTS.REPORT_DELETE(id), {
    method: "DELETE",
  })
}

/**
 * Helper function for login
 */
export async function loginUser(email, password, userType) {
  return apiCall(API_ENDPOINTS.AUTH_LOGIN, {
    method: "POST",
    body: JSON.stringify({ email, password, userType }),
  })
}

/**
 * Helper function for signup
 */
export async function signupUser(userData) {
  return apiCall(API_ENDPOINTS.AUTH_SIGNUP, {
    method: "POST",
    body: JSON.stringify(userData),
  })
}

/**
 * Helper function to get user profile
 */
export async function getUserProfile() {
  return apiCall(API_ENDPOINTS.USER_PROFILE)
}

export { API_ENDPOINTS } from '@/config/paths'

/**
 * Helper function to get reports
 */
export async function getMyReports() {
  const res = await fetch("/api/reports/my");
  if (!res.ok) throw new Error("Failed to fetch reports");
  return res.json();
}

/**
 * Helper function to update reports
 */
export async function updateMyReportStatus(id, status) {
  const res = await fetch(`/api/reports/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update status");
  return res.json();
}