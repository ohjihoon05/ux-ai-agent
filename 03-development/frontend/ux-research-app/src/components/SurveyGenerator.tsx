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
    <div className="max-w-2xl mx-auto glass-card p-6 sm:p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">🤖 AI 설문 생성</h2>
        <p className="text-white/80">목적을 입력하면 맞춤형 설문을 자동으로 만들어드려요</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 설문 목적 */}
        <div>
          <label htmlFor="purpose" className="block text-sm font-semibold text-white mb-3">
            🎯 설문 목적 *
          </label>
          <textarea
            id="purpose"
            value={formData.purpose}
            onChange={(e) => handleInputChange('purpose', e.target.value)}
            placeholder="예: 웹사이트 사용성 개선을 위한 사용자 만족도 조사"
            className="input-glass w-full text-white placeholder-white/60"
            rows={3}
            required
          />
        </div>

        {/* 대상 사용자 */}
        <div>
          <label htmlFor="targetAudience" className="block text-sm font-semibold text-white mb-3">
            👥 대상 사용자
          </label>
          <input
            type="text"
            id="targetAudience"
            value={formData.targetAudience}
            onChange={(e) => handleInputChange('targetAudience', e.target.value)}
            placeholder="예: 20-40대 직장인, 온라인 쇼핑 경험자"
            className="input-glass w-full text-white placeholder-white/60"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 언어 선택 */}
          <div>
            <label htmlFor="language" className="block text-sm font-semibold text-white mb-3">
              🌐 언어
            </label>
            <select
              id="language"
              value={formData.language}
              onChange={(e) => handleInputChange('language', e.target.value as 'ko' | 'en')}
              className="input-glass w-full text-white"
            >
              <option value="ko">🇰🇷 한국어</option>
              <option value="en">🇺🇸 English</option>
            </select>
          </div>

          {/* AI 엔진 선택 */}
          <div>
            <label htmlFor="engine" className="block text-sm font-semibold text-white mb-3">
              🤖 AI 엔진
            </label>
            <select
              id="engine"
              value={formData.engine}
              onChange={(e) => handleInputChange('engine', e.target.value as 'claude-code' | 'ollama')}
              className="input-glass w-full text-white"
            >
              <option value="claude-code">⚡ Claude Code (권장)</option>
              <option value="ollama">🦙 Ollama</option>
            </select>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="glass-card p-4 border border-red-400/50 bg-red-500/20">
            <div className="flex items-center">
              <span className="text-2xl mr-3">⚠️</span>
              <span className="text-white font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* 생성 버튼 */}
        <button
          type="submit"
          disabled={isLoading}
          className={`btn-gradient w-full text-lg font-bold py-4 ${isLoading ? 'pulse-glow' : ''} disabled:opacity-70 disabled:cursor-not-allowed`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              ✨ AI가 설문을 생성하고 있어요...
            </div>
          ) : (
            '🚀 설문 생성하기'
          )}
        </button>
      </form>

      {/* 생성된 설문 미리보기 */}
      {generatedSurvey && (
        <div className="mt-8 glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <h3 className="text-xl font-bold text-white mr-3">🎉 생성 완료!</h3>
              <span className="px-3 py-1 bg-green-400/20 text-green-300 rounded-full text-sm font-medium">
                즉시 사용 가능
              </span>
            </div>
            {engineMeta && (
              <div className="flex items-center">
                <span className="px-3 py-1 bg-white/20 text-white/80 rounded-full text-xs font-medium">
                  {engineMeta.engine === 'claude-code' ? '⚡ Claude Code' : '🦙 Ollama'}
                  {engineMeta.fallback && ' (자동 전환)'}
                </span>
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <div className="text-center p-4 bg-white/10 rounded-xl">
              <h4 className="text-xl font-bold text-white mb-2">{generatedSurvey.title}</h4>
              <p className="text-white/80">{generatedSurvey.description}</p>
            </div>
            
            <div className="space-y-4">
              {generatedSurvey.questions.map((question, index) => (
                <div key={question.id} className="glass-card p-4 border border-white/20">
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-white font-medium text-lg leading-relaxed">{question.text}</p>
                      <div className="flex items-center space-x-4 mt-3">
                        <span className="px-3 py-1 bg-white/20 text-white/90 rounded-full text-xs font-medium">
                          📝 {question.type}
                        </span>
                        {question.required && (
                          <span className="px-3 py-1 bg-red-400/20 text-red-300 rounded-full text-xs font-medium">
                            ⭐ 필수
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {generatedSurvey.suggestions && generatedSurvey.suggestions.length > 0 && (
              <div className="glass-card p-4 border border-blue-400/30 bg-blue-500/20">
                <h5 className="text-lg font-bold text-white mb-4 flex items-center">
                  💡 AI 추천 개선사항
                </h5>
                <ul className="space-y-2">
                  {generatedSurvey.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start text-white/90">
                      <span className="text-blue-300 mr-2 mt-1">▶</span>
                      <span>{suggestion}</span>
                    </li>
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