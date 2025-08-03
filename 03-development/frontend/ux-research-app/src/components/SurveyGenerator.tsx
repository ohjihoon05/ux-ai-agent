import React, { useState } from 'react'
import { apiService } from '../services/api'
import type { SurveyGenerationRequest, Survey } from '../types'

interface SurveyGeneratorProps {
  onSurveyGenerated?: (survey: Survey) => void
}

const SurveyGenerator: React.FC<SurveyGeneratorProps> = ({ onSurveyGenerated }) => {
  const [formData, setFormData] = useState<SurveyGenerationRequest>({
    purpose: '',
    targetAudience: '',
    language: 'ko',
    engine: 'claude-code'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generatedSurvey, setGeneratedSurvey] = useState<Survey | null>(null)
  const [engineMeta, setEngineMeta] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.purpose.trim()) {
      setError('설문 목적을 입력해주세요')
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      const response = await apiService.generateSurvey(formData)
      setGeneratedSurvey(response.survey)
      setEngineMeta(response.meta)
      onSurveyGenerated?.(response.survey)
    } catch (err) {
      setError(err instanceof Error ? err.message : '설문 생성에 실패했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof SurveyGenerationRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">AI 설문 생성</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 설문 목적 */}
        <div>
          <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-2">
            설문 목적 *
          </label>
          <textarea
            id="purpose"
            value={formData.purpose}
            onChange={(e) => handleInputChange('purpose', e.target.value)}
            placeholder="예: 웹사이트 사용성 개선을 위한 사용자 만족도 조사"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            required
          />
        </div>

        {/* 대상 사용자 */}
        <div>
          <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 mb-2">
            대상 사용자
          </label>
          <input
            type="text"
            id="targetAudience"
            value={formData.targetAudience}
            onChange={(e) => handleInputChange('targetAudience', e.target.value)}
            placeholder="예: 20-40대 직장인, 온라인 쇼핑 경험자"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* 언어 선택 */}
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
            언어
          </label>
          <select
            id="language"
            value={formData.language}
            onChange={(e) => handleInputChange('language', e.target.value as 'ko' | 'en')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="ko">한국어</option>
            <option value="en">English</option>
          </select>
        </div>

        {/* AI 엔진 선택 */}
        <div>
          <label htmlFor="engine" className="block text-sm font-medium text-gray-700 mb-2">
            AI 엔진
          </label>
          <select
            id="engine"
            value={formData.engine}
            onChange={(e) => handleInputChange('engine', e.target.value as 'claude-code' | 'ollama')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="claude-code">Claude Code (권장)</option>
            <option value="ollama">Ollama</option>
          </select>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* 생성 버튼 */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '설문 생성 중...' : '설문 생성하기'}
        </button>
      </form>

      {/* 생성된 설문 미리보기 */}
      {generatedSurvey && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">생성된 설문</h3>
            {engineMeta && (
              <span className="text-sm text-gray-600">
                {engineMeta.engine} 
                {engineMeta.fallback && ' (자동 전환)'}
              </span>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-800">{generatedSurvey.title}</h4>
              <p className="text-gray-600 mt-1">{generatedSurvey.description}</p>
            </div>
            
            <div className="space-y-3">
              {generatedSurvey.questions.map((question, index) => (
                <div key={question.id} className="p-3 bg-white rounded border">
                  <div className="flex items-start space-x-2">
                    <span className="text-sm font-medium text-gray-500 mt-1">
                      Q{index + 1}.
                    </span>
                    <div className="flex-1">
                      <p className="text-gray-800">{question.text}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>유형: {question.type}</span>
                        {question.required && <span className="text-red-500">필수</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {generatedSurvey.suggestions && generatedSurvey.suggestions.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                <h5 className="text-sm font-medium text-blue-800 mb-2">AI 제안사항</h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  {generatedSurvey.suggestions.map((suggestion, index) => (
                    <li key={index}>• {suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default SurveyGenerator