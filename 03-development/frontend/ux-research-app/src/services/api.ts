import type { ApiResponse, Survey, SurveyGenerationRequest, AIEngineStatus, AIEngine } from '../types'

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
        const errorData = await response.json().catch(() => null)
        const errorMessage = errorData?.message || `HTTP error! status: ${response.status}`
        throw new Error(errorMessage)
      }

      return await response.json()
    } catch (error) {
      console.error('API call failed:', error)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.')
      }
      throw error
    }
  }

  // AI Engine Management
  async getAIEngines(): Promise<AIEngine[]> {
    const response = await this.fetch<AIEngine[]>('/surveys/engines')
    return response.data
  }

  async getAIEngineStatus(): Promise<AIEngineStatus> {
    const response = await this.fetch<AIEngineStatus>('/surveys/engines/status')
    return response.data
  }

  // Survey Generation
  async generateSurvey(request: SurveyGenerationRequest): Promise<{
    survey: Survey
    meta: {
      engine: string
      fallback?: boolean
      originalEngine?: string
      error?: string
    }
  }> {
    const response = await this.fetch<any>('/surveys/generate', {
      method: 'POST',
      body: JSON.stringify(request),
    })
    return {
      survey: response.data,
      meta: response.meta || {}
    }
  }

  // Survey Templates
  async getSurveyTemplates(): Promise<any[]> {
    const response = await this.fetch<any[]>('/surveys/templates')
    return response.data
  }

  // Survey Preview
  async generateSurveyPreview(survey: Survey): Promise<{ html: string; url?: string }> {
    const response = await this.fetch<{ html: string; url?: string }>('/surveys/preview', {
      method: 'POST',
      body: JSON.stringify({ survey }),
    })
    return response.data
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; timestamp: string; version: string }> {
    const response = await this.fetch<{ status: string; timestamp: string; version: string }>('/health')
    return response.data
  }

  // Survey CRUD (미래 확장용)
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