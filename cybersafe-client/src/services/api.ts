import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 5000,
})

export interface HealthResponse {
  status: string
}

export interface PasswordCheckResponse {
  score: number
  rating: string
  feedback: string[]
}

export interface UrlCheckResponse {
  riskScore: number
  rating: string
  findings: string[]
}

export async function getApiHealth(): Promise<HealthResponse> {
  const response = await api.get<HealthResponse>('/health')
  return response.data
}

export async function checkPassword(password: string): Promise<PasswordCheckResponse> {
  const response = await api.post<PasswordCheckResponse>('/password/check', { password })
  return response.data
}

export async function checkUrl(url: string): Promise<UrlCheckResponse> {
  const response = await api.post<UrlCheckResponse>('/url/check', { url })
  return response.data
}
