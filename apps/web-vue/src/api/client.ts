const BASE_URL = import.meta.env.VITE_API_URL

export const client = async <T>(path: string, options: RequestInit): Promise<T> => {
  const token = localStorage.getItem('accessToken')

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error ?? 'Request failed')
  }

  // 204 No Content
  if (response.status === 204) return undefined as T

  return response.json()
}
