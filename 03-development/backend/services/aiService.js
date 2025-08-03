const claudeCodeService = require('./claudeCodeService');
const ollamaService = require('./ollamaService');
const logger = require('../utils/logger');

class AIService {
  constructor() {
    this.engines = {
      'claude-code': claudeCodeService,
      'ollama': ollamaService
    };
    this.defaultEngine = 'claude-code';
  }

  async generateSurvey(request) {
    const { purpose, targetAudience, language, engine, model } = request;
    
    // AI 엔진 선택
    const selectedEngine = engine || await this.selectBestAvailableEngine();
    const aiService = this.engines[selectedEngine];
    
    if (!aiService) {
      throw new Error(`지원하지 않는 AI 엔진입니다: ${selectedEngine}`);
    }

    try {
      console.log(`Using ${selectedEngine} for survey generation...`);
      
      // 엔진별 파라미터 전달
      if (selectedEngine === 'ollama') {
        return await aiService.generateSurvey(purpose, targetAudience, language, model);
      } else {
        return await aiService.generateSurvey(purpose, targetAudience, language);
      }
    } catch (error) {
      console.error(`${selectedEngine} failed:`, error.message);
      
      // 폴백 처리: 다른 엔진 시도
      const fallbackEngine = selectedEngine === 'claude-code' ? 'ollama' : 'claude-code';
      const fallbackService = this.engines[fallbackEngine];
      
      try {
        console.log(`Trying fallback engine: ${fallbackEngine}`);
        const result = await fallbackService.generateSurvey(purpose, targetAudience, language);
        result.fallback = true;
        result.originalEngine = selectedEngine;
        return result;
      } catch (fallbackError) {
        console.error(`Fallback ${fallbackEngine} also failed:`, fallbackError.message);
        
        // 모든 엔진 실패시 기본 설문 반환
        return {
          success: false,
          survey: this.getEmergencyDefaultSurvey(purpose),
          engine: 'default',
          error: '모든 AI 엔진이 실패했습니다. 기본 설문을 제공합니다.'
        };
      }
    }
  }

  async selectBestAvailableEngine() {
    // Claude Code 우선 확인
    const claudeAvailable = await claudeCodeService.checkClaudeCodeAvailability();
    if (claudeAvailable) {
      console.log('Claude Code is available');
      return 'claude-code';
    }

    // Ollama 확인
    const ollamaStatus = await ollamaService.checkOllamaAvailability();
    if (ollamaStatus.available) {
      console.log('Ollama is available');
      return 'ollama';
    }

    console.warn('No AI engines available, using default');
    return 'claude-code'; // 기본값으로 시도
  }

  async getEngineStatus() {
    const status = {
      engines: {},
      recommended: null
    };

    // Claude Code 상태 확인
    try {
      const claudeAvailable = await claudeCodeService.checkClaudeCodeAvailability();
      status.engines['claude-code'] = {
        available: claudeAvailable,
        name: 'Claude Code',
        description: '로컬 Claude CLI 도구'
      };
    } catch (error) {
      status.engines['claude-code'] = {
        available: false,
        error: error.message
      };
    }

    // Ollama 상태 확인
    try {
      const ollamaStatus = await ollamaService.checkOllamaAvailability();
      status.engines['ollama'] = {
        available: ollamaStatus.available,
        name: 'Ollama',
        description: '로컬 LLM 서버',
        models: ollamaStatus.available ? await ollamaService.getAvailableModels() : [],
        error: ollamaStatus.error
      };
    } catch (error) {
      status.engines['ollama'] = {
        available: false,
        error: error.message
      };
    }

    // 추천 엔진 결정
    if (status.engines['claude-code'].available) {
      status.recommended = 'claude-code';
    } else if (status.engines['ollama'].available) {
      status.recommended = 'ollama';
    }

    return status;
  }

  getEmergencyDefaultSurvey(purpose = '사용자 피드백 수집') {
    return {
      title: `${purpose} 설문`,
      description: 'AI 생성이 불가능하여 기본 설문을 제공합니다.',
      questions: [
        {
          id: 'q1',
          text: '전반적인 만족도는 어떠신가요?',
          type: 'rating',
          required: true
        },
        {
          id: 'q2',
          text: '가장 좋았던 점은 무엇인가요?',
          type: 'text',
          required: false
        },
        {
          id: 'q3',
          text: '개선이 필요한 부분은 무엇인가요?',
          type: 'text',
          required: false
        },
        {
          id: 'q4',
          text: '다른 사람에게 추천하시겠습니까?',
          type: 'boolean',
          required: true
        }
      ],
      suggestions: [
        'AI 엔진 설정을 확인해주세요',
        'Claude Code 또는 Ollama가 정상 작동하는지 확인해주세요'
      ]
    };
  }

  getSupportedEngines() {
    return [
      {
        id: 'claude-code',
        name: 'Claude Code',
        description: '로컬 Claude CLI 도구 (추천)',
        pros: ['빠른 응답', '안정적', '별도 설정 불필요'],
        cons: ['온라인 연결 필요']
      },
      {
        id: 'ollama',
        name: 'Ollama',
        description: '로컬 LLM 서버',
        pros: ['완전 오프라인', '다양한 모델', '무료'],
        cons: ['초기 설정 필요', '시스템 리소스 사용']
      }
    ];
  }
}

module.exports = new AIService();