const axios = require('axios');

class OllamaService {
  constructor() {
    this.baseUrl = 'http://localhost:11434';
    this.defaultModel = 'gemma3:1b'; // 기본 모델, 가장 작고 빠른 모델
  }

  async generateSurvey(purpose, targetAudience = '일반 사용자', language = 'ko', model = null) {
    const selectedModel = model || this.defaultModel;
    const prompt = this.buildSurveyPrompt(purpose, targetAudience, language);
    
    try {
      const response = await this.callOllama(selectedModel, prompt);
      return this.parseSurveyResponse(response);
    } catch (error) {
      console.error('Ollama survey generation failed:', error);
      throw new Error('설문 생성에 실패했습니다.');
    }
  }

  buildSurveyPrompt(purpose, targetAudience, language) {
    const isKorean = language === 'ko';
    
    if (isKorean) {
      return `당신은 설문조사 전문가입니다. 다음 조건에 맞는 설문을 JSON 형식으로 생성해주세요:

목적: ${purpose}
대상: ${targetAudience}

요구사항:
- 5-7개 문항
- 다양한 문항 유형 포함
- 명확한 질문

다음 JSON 형식으로만 응답해주세요:
{
  "title": "설문 제목",
  "description": "설문 설명",
  "questions": [
    {
      "id": "q1", 
      "text": "질문 내용",
      "type": "text",
      "required": true
    }
  ],
  "suggestions": ["제안1"]
}

JSON만 출력하세요.`;
    } else {
      return `Create a survey JSON for: ${purpose}

Target: ${targetAudience}

Format:
{
  "title": "Survey Title",
  "description": "Description",
  "questions": [
    {"id": "q1", "text": "Question", "type": "text", "required": true}
  ],
  "suggestions": ["Suggestion"]
}

JSON only:`;
    }
  }

  async callOllama(model, prompt) {
    try {
      const response = await axios.post(`${this.baseUrl}/api/generate`, {
        model: model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 2048
        }
      }, {
        timeout: 60000, // 60초 타임아웃
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response.data.response;
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Ollama 서버가 실행되지 않았습니다. "ollama serve" 명령어로 서버를 시작해주세요.');
      }
      if (error.response?.status === 404) {
        throw new Error(`모델 "${model}"을 찾을 수 없습니다. "ollama pull ${model}" 명령어로 모델을 설치해주세요.`);
      }
      throw error;
    }
  }

  parseSurveyResponse(response) {
    try {
      // 응답 정리
      let cleanResponse = response.trim();
      
      // 여러 종류의 불필요한 텍스트 제거
      cleanResponse = cleanResponse.replace(/```json\s*/g, '');
      cleanResponse = cleanResponse.replace(/```\s*/g, '');
      cleanResponse = cleanResponse.replace(/JSON만 출력하세요\.?/g, '');
      cleanResponse = cleanResponse.replace(/JSON only:?/g, '');
      cleanResponse = cleanResponse.replace(/Here's the JSON:?/g, '');
      cleanResponse = cleanResponse.replace(/^[^{]*({.*})[^}]*$/s, '$1');
      
      // 터미널 제어 문자 제거
      cleanResponse = cleanResponse.replace(/\x1b\[[0-9;]*[mGKH]/g, '');
      cleanResponse = cleanResponse.replace(/\[\?[0-9]+[hl]/g, '');
      
      // 앞뒤 공백 제거
      cleanResponse = cleanResponse.trim();
      
      // JSON 시작과 끝 찾기 (더 정확하게)
      let jsonStart = cleanResponse.indexOf('{');
      let jsonEnd = -1;
      
      if (jsonStart !== -1) {
        let braceCount = 0;
        for (let i = jsonStart; i < cleanResponse.length; i++) {
          if (cleanResponse[i] === '{') braceCount++;
          if (cleanResponse[i] === '}') {
            braceCount--;
            if (braceCount === 0) {
              jsonEnd = i + 1;
              break;
            }
          }
        }
      }
      
      if (jsonStart !== -1 && jsonEnd > jsonStart) {
        cleanResponse = cleanResponse.substring(jsonStart, jsonEnd);
      }

      console.log('Cleaned Ollama response:', cleanResponse);

      const survey = JSON.parse(cleanResponse);
      
      // 기본값 설정 및 유효성 검사
      if (!survey.title || typeof survey.title !== 'string') {
        survey.title = '새로운 설문';
      }
      if (!survey.description || typeof survey.description !== 'string') {
        survey.description = '설문에 참여해주세요';
      }
      if (!Array.isArray(survey.questions)) {
        survey.questions = [];
      }
      if (!Array.isArray(survey.suggestions)) {
        survey.suggestions = [];
      }

      // 질문 유효성 검사 및 정리
      survey.questions = survey.questions.filter(q => q && typeof q === 'object');
      survey.questions.forEach((question, index) => {
        if (!question.id) {
          question.id = `q${index + 1}`;
        }
        if (!question.text || typeof question.text !== 'string') {
          question.text = `질문 ${index + 1}`;
        }
        if (typeof question.required !== 'boolean') {
          question.required = true;
        }
        if (!question.type || !['text', 'multiple-choice', 'rating', 'boolean'].includes(question.type)) {
          question.type = 'text';
        }
      });

      // 최소 1개 질문 보장
      if (survey.questions.length === 0) {
        survey.questions.push({
          id: 'q1',
          text: '전반적인 만족도를 평가해주세요',
          type: 'rating',
          required: true
        });
      }

      return {
        success: true,
        survey,
        engine: 'ollama'
      };
    } catch (error) {
      console.error('Failed to parse Ollama survey response:', error);
      console.log('Raw response:', response.substring(0, 500) + '...');
      
      return {
        success: false,
        survey: this.getDefaultSurvey(),
        engine: 'ollama',
        error: `JSON 파싱 실패: ${error.message}`
      };
    }
  }

  getDefaultSurvey() {
    return {
      title: '기본 설문',
      description: 'AI 생성에 실패하여 기본 설문을 제공합니다.',
      questions: [
        {
          id: 'q1',
          text: '전반적인 만족도를 평가해주세요',
          type: 'rating',
          required: true
        },
        {
          id: 'q2',
          text: '개선이 필요한 부분이 있다면 자유롭게 적어주세요',
          type: 'text',
          required: false
        }
      ],
      suggestions: ['AI 설문 생성 기능을 다시 시도해보세요']
    };
  }

  async checkOllamaAvailability() {
    try {
      const response = await axios.get(`${this.baseUrl}/api/tags`, { timeout: 5000 });
      return {
        available: true,
        models: response.data.models || []
      };
    } catch (error) {
      return {
        available: false,
        error: error.code === 'ECONNREFUSED' 
          ? 'Ollama 서버가 실행되지 않았습니다.'
          : error.message
      };
    }
  }

  async getAvailableModels() {
    try {
      const response = await axios.get(`${this.baseUrl}/api/tags`);
      return response.data.models.map(model => model.name);
    } catch (error) {
      console.error('Failed to get Ollama models:', error);
      return [];
    }
  }
}

module.exports = new OllamaService();