import { API_ENDPOINTS } from '@/config/paths'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

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
      if (response.status === 401 && typeof window !== 'undefined') {
        localStorage.clear()
        window.location.href = '/login'
      }
      throw new Error(data.message || `API Error: ${response.status}`)
    }

    return data
  } catch (error) {
    console.error('[v0] API Error:', error)
    throw error
  }
}

// Reports
export async function createReport(reportData) {
  return apiCall("/api/reports/create", {
    method: "POST",
    body: JSON.stringify(reportData),
  })
}

export async function getReports(status = 'all') {
  return apiCall(`/api/reports?status=${status}`)
}

export async function getReport(id) {
  return apiCall(`/api/reports/${id}`)
}

export async function updateReportStatus(id, status) {
  return apiCall(`/api/reports/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  })
}

export async function deleteReport(id) {
  return apiCall(`/api/reports/${id}`, {
    method: "DELETE",
  })
}

export async function getMyReports() {
  return apiCall("/api/reports/my")
}

export async function updateMyReportStatus(id, status) {
  return apiCall(`/api/reports/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  })
}


// Auth
export async function loginUser(email, password, userType) {
  return apiCall("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password, userType }),
  })
}

export async function signupUser(userData) {
  return apiCall("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(userData),
  })
}

// User
export async function getUserProfile() {
  return apiCall("/api/users/profile")
}

export { API_ENDPOINTS }
