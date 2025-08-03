// API Response Types
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

// Survey Types
export interface Survey {
  id: string
  title: string
  description: string
  questions: Question[]
  createdAt: string
  updatedAt: string
  status: 'draft' | 'active' | 'closed'
  responses?: SurveyResponse[]
}

export interface Question {
  id: string
  text: string
  type: 'text' | 'multiple-choice' | 'rating' | 'boolean'
  required: boolean
  options?: string[]
}

export interface SurveyResponse {
  id: string
  surveyId: string
  respondentId?: string
  answers: Answer[]
  submittedAt: string
}

export interface Answer {
  questionId: string
  value: string | number | boolean
}

// AI Generation Types
export interface SurveyGenerationRequest {
  purpose: string
  targetAudience?: string
  language?: 'ko' | 'en'
  engine?: 'claude-code' | 'ollama'
  model?: string
}

export interface SurveyGenerationResponse {
  survey: Omit<Survey, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  suggestions?: string[]
}

// AI Engine Types
export interface AIEngine {
  id: string
  name: string
  description: string
  pros: string[]
  cons: string[]
}

export interface AIEngineStatus {
  engines: Record<string, {
    available: boolean
    name: string
    description: string
    models?: string[]
    error?: string
  }>
  recommended: string | null
}

// User Types
export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'researcher' | 'respondent'
  createdAt: string
}

// Analytics Types
export interface SurveyAnalytics {
  surveyId: string
  totalResponses: number
  completionRate: number
  averageCompletionTime: number
  insights: Insight[]
  keywords: string[]
}

export interface Insight {
  type: 'positive' | 'negative' | 'neutral'
  category: string
  description: string
  confidence: number
}