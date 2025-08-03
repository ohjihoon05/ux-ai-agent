import React, { useState } from 'react'
import { Brain, FileQuestion, BarChart3 } from 'lucide-react'
import Header from '../components/layout/Header'
import FeatureCard from '../components/ui/FeatureCard'
import Button from '../components/ui/Button'
import SurveyGenerator from '../components/SurveyGenerator'
import type { Survey } from '../types'

export default function HomePage() {
  const [showGenerator, setShowGenerator] = useState(false)
  const [lastGeneratedSurvey, setLastGeneratedSurvey] = useState<Survey | null>(null)

  const features = [
    {
      icon: Brain,
      title: 'AI 설문 생성',
      description: 'Claude Code와 Ollama AI가 목적에 맞는 설문을 자동 생성합니다',
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100'
    },
    {
      icon: FileQuestion,
      title: '하이브리드 수집',
      description: '내부 직원과 외부 고객의 피드백을 동시에 수집합니다',
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-100'
    },
    {
      icon: BarChart3,
      title: '실시간 분석',
      description: '응답과 동시에 패턴을 분석하고 인사이트를 도출합니다',
      iconColor: 'text-purple-600',
      iconBgColor: 'bg-purple-100'
    }
  ]

  const handleSurveyGenerated = (survey: Survey) => {
    setLastGeneratedSurvey(survey)
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="float">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 text-gradient">
              AI로 설문을 자동 생성하세요
            </h2>
          </div>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            목적만 입력하면 ✨ <span className="text-gradient font-semibold">3초 만에</span> ✨ 
            완벽한 설문이 완성됩니다
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="text-center mb-16">
          <div className="space-x-6">
            <button 
              className="btn-gradient text-lg px-8 py-4"
              onClick={() => setShowGenerator(true)}
            >
              🚀 설문 만들기 시작
            </button>
            {showGenerator && (
              <button 
                className="glass-card text-white px-8 py-4 text-lg font-semibold hover:bg-white/20"
                onClick={() => setShowGenerator(false)}
              >
                ✕ 닫기
              </button>
            )}
          </div>
        </div>

        {/* Survey Generator */}
        {showGenerator && (
          <div className="mb-16">
            <SurveyGenerator onSurveyGenerated={handleSurveyGenerated} />
          </div>
        )}

        {/* Recent Survey Preview */}
        {lastGeneratedSurvey && (
          <div className="mb-16 glass-card p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              ✨ 방금 생성된 설문
              <span className="pulse-glow ml-4 px-3 py-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-full text-sm">
                NEW
              </span>
            </h3>
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-white">{lastGeneratedSurvey.title}</h4>
              <p className="text-white/80 text-lg">{lastGeneratedSurvey.description}</p>
              <div className="flex items-center space-x-4">
                <span className="px-4 py-2 bg-white/20 rounded-full text-white text-sm font-medium">
                  📝 {lastGeneratedSurvey.questions.length}개 문항
                </span>
                <span className="px-4 py-2 bg-white/20 rounded-full text-white text-sm font-medium">
                  🎯 즉시 사용 가능
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {features.map((feature, index) => (
            <div key={index} className="glass-card p-8 text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 ${feature.iconBgColor} rounded-full mb-6 float`}>
                <feature.icon className={`h-8 w-8 ${feature.iconColor}`} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-white/80 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}