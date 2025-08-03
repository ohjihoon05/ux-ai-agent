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
    <header className={`bg-white shadow-sm ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Brain className="h-8 w-8 text-blue-600" />
            <h1 className="ml-2 text-xl font-semibold text-gray-900">
              UX Research AI
            </h1>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-6">
            {/* AI 엔진 상태 */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-1">
                {getStatusIcon(engineStatus?.['claude-code']?.available)}
                <span className="hidden sm:inline text-xs text-gray-600">Claude</span>
              </div>
              <div className="flex items-center space-x-1">
                {getStatusIcon(engineStatus?.ollama?.available)}
                <span className="hidden sm:inline text-xs text-gray-600">Ollama</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                새 설문
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                내 설문
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                분석
              </a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}