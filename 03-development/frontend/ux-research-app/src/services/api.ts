import type { ApiResponse, Survey, SurveyGenerationRequest, SurveyGenerationResponse } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

class ApiService {
  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API call failed:', error)
      throw error
    }
  }

  // Survey Generation
  async generateSurvey(request: SurveyGenerationRequest): Promise<SurveyGenerationResponse> {
    const response = await this.fetch<SurveyGenerationResponse>('/surveys/generate', {
      method: 'POST',
      body: JSON.stringify(request),
    })
    return response.data
  }

  // Survey CRUD
  async createSurvey(survey: Omit<Survey, 'id' | 'createdAt' | 'updatedAt'>): Promise<Survey> {
    const response = await this.fetch<Survey>('/surveys', {
      method: 'POST',
      body: JSON.stringify(survey),
    })
    return response.data
  }

  async getSurvey(id: string): Promise<Survey> {
    const response = await this.fetch<Survey>(`/surveys/${id}`)
    return response.data
  }

  async getSurveys(): Promise<Survey[]> {
    const response = await this.fetch<Survey[]>('/surveys')
    return response.data
  }

  async updateSurvey(id: string, updates: Partial<Survey>): Promise<Survey> {
    const response = await this.fetch<Survey>(`/surveys/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
    return response.data
  }

  async deleteSurvey(id: string): Promise<void> {
    await this.fetch(`/surveys/${id}`, {
      method: 'DELETE',
    })
  }
}

export const apiService = new ApiService()
export default apiService