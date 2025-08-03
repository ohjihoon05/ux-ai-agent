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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            AI로 설문을 자동으로 생성하세요
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            목적을 입력하면 AI가 최적의 설문 문항을 만들어드립니다
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="text-center mb-12">
          <div className="space-x-4">
            <Button 
              size="lg"
              onClick={() => setShowGenerator(true)}
            >
              설문 만들기 시작
            </Button>
            {showGenerator && (
              <Button 
                variant="secondary"
                size="lg"
                onClick={() => setShowGenerator(false)}
              >
                닫기
              </Button>
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
          <div className="mb-16 p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              ✨ 방금 생성된 설문
            </h3>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">{lastGeneratedSurvey.title}</h4>
              <p className="text-gray-600">{lastGeneratedSurvey.description}</p>
              <p className="text-sm text-gray-500">
                총 {lastGeneratedSurvey.questions.length}개 문항
              </p>
            </div>
          </div>
        )}

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              iconColor={feature.iconColor}
              iconBgColor={feature.iconBgColor}
            />
          ))}
        </div>
      </main>
    </div>
  )
}