import { useState, useEffect } from 'react'
import { Survey, SurveyGenerationRequest } from '../types'
import apiService from '../services/api'

export function useSurveys() {
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSurveys()
  }, [])

  const fetchSurveys = async () => {
    try {
      setLoading(true)
      const data = await apiService.getSurveys()
      setSurveys(data)
      setError(null)
    } catch (err) {
      setError('설문을 불러오는데 실패했습니다.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const createSurvey = async (survey: Omit<Survey, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newSurvey = await apiService.createSurvey(survey)
      setSurveys(prev => [...prev, newSurvey])
      return newSurvey
    } catch (err) {
      setError('설문 생성에 실패했습니다.')
      throw err
    }
  }

  const deleteSurvey = async (id: string) => {
    try {
      await apiService.deleteSurvey(id)
      setSurveys(prev => prev.filter(survey => survey.id !== id))
    } catch (err) {
      setError('설문 삭제에 실패했습니다.')
      throw err
    }
  }

  return {
    surveys,
    loading,
    error,
    fetchSurveys,
    createSurvey,
    deleteSurvey,
  }
}

export function useSurveyGeneration() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateSurvey = async (request: SurveyGenerationRequest) => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiService.generateSurvey(request)
      return result
    } catch (err) {
      setError('AI 설문 생성에 실패했습니다.')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    generateSurvey,
    loading,
    error,
  }
}