import { Brain, FileQuestion, BarChart3 } from 'lucide-react'
import Header from '../components/layout/Header'
import FeatureCard from '../components/ui/FeatureCard'
import Button from '../components/ui/Button'

export default function HomePage() {
  const features = [
    {
      icon: Brain,
      title: 'AI 설문 생성',
      description: '리서치 목적을 입력하면 GPT-4가 자동으로 설문을 생성합니다',
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

        {/* CTA Button */}
        <div className="text-center mt-12">
          <Button size="lg">
            설문 만들기 시작
          </Button>
        </div>
      </main>
    </div>
  )
}