import { useState, useEffect } from 'react'
import { Brain, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { apiService } from '../../services/api'

interface HeaderProps {
  className?: string
}

export default function Header({ className = '' }: HeaderProps) {
  const [engineStatus, setEngineStatus] = useState<any>(null)
  const [loadingStatus, setLoadingStatus] = useState(true)

  useEffect(() => {
    const checkEngineStatus = async () => {
      try {
        const status = await apiService.getEngineStatus()
        setEngineStatus(status)
      } catch (error) {
        console.error('Failed to fetch engine status:', error)
      } finally {
        setLoadingStatus(false)
      }
    }

    checkEngineStatus()
    const interval = setInterval(checkEngineStatus, 30000) // 30초마다 체크
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (isAvailable: boolean | undefined) => {
    if (loadingStatus) return <AlertCircle className="h-3 w-3 text-gray-400" />
    if (isAvailable) return <CheckCircle className="h-3 w-3 text-green-500" />
    return <XCircle className="h-3 w-3 text-red-500" />
  }

  return (
    <header className={`glass-card mx-4 mt-4 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <h1 className="ml-3 text-xl font-bold text-white">
              UX Research AI
            </h1>
          </div>
          
          <div className="flex items-center space-x-4 sm:space-x-8">
            {/* AI 엔진 상태 */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-3 py-1 bg-white/10 rounded-full">
                {getStatusIcon(engineStatus?.['claude-code']?.available)}
                <span className="hidden sm:inline text-xs text-white/90 font-medium">Claude</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1 bg-white/10 rounded-full">
                {getStatusIcon(engineStatus?.ollama?.available)}
                <span className="hidden sm:inline text-xs text-white/90 font-medium">Ollama</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-2">
              <a href="#" className="text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-xl text-sm font-medium transition-all">
                🆕 새 설문
              </a>
              <a href="#" className="text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-xl text-sm font-medium transition-all">
                📋 내 설문
              </a>
              <a href="#" className="text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-xl text-sm font-medium transition-all">
                📊 분석
              </a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}