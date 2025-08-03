const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

class ClaudeCodeService {
  constructor() {
    this.tempDir = path.join(__dirname, '../temp');
    this.ensureTempDir();
  }

  async ensureTempDir() {
    try {
      await fs.mkdir(this.tempDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create temp directory:', error);
    }
  }

  async generateSurvey(purpose, targetAudience = '일반 사용자', language = 'ko') {
    const prompt = this.buildSurveyPrompt(purpose, targetAudience, language);
    
    try {
      const response = await this.callClaudeCode(prompt);
      return this.parseSurveyResponse(response);
    } catch (error) {
      console.error('Claude Code survey generation failed:', error);
      throw new Error('설문 생성에 실패했습니다.');
    }
  }

  buildSurveyPrompt(purpose, targetAudience, language) {
    return `
당신은 UX 리서치 전문가입니다. 다음 조건에 맞는 설문을 JSON 형식으로 생성해주세요:

목적: ${purpose}
대상: ${targetAudience}
언어: ${language === 'ko' ? '한국어' : '영어'}

요구사항:
1. 5-10개 문항
2. 다양한 문항 유형 (객관식, 주관식, 척도)
3. 논리적인 문항 순서
4. 명확하고 이해하기 쉬운 문구

응답 형식:
{
  "title": "설문 제목",
  "description": "설문 설명",
  "questions": [
    {
      "id": "q1",
      "text": "질문 내용",
      "type": "multiple-choice", // text, multiple-choice, rating, boolean
      "required": true,
      "options": ["옵션1", "옵션2"] // 객관식인 경우만
    }
  ],
  "suggestions": ["개선 제안1", "개선 제안2"]
}

JSON만 응답해주세요.
`;
  }

  async callClaudeCode(prompt) {
    return new Promise((resolve, reject) => {
      // Windows에서 특수문자 처리를 위해 파일 기반으로 실행
      const tempFile = path.join(this.tempDir, `prompt_${Date.now()}.txt`);
      
      fs.writeFile(tempFile, prompt, 'utf8')
        .then(() => {
          exec(`claude < "${tempFile}"`, { 
            maxBuffer: 1024 * 1024, // 1MB buffer
            timeout: 60000, // 60초 타임아웃으로 증가
            encoding: 'utf8'
          }, async (error, stdout, stderr) => {
            // 임시 파일 삭제
            try {
              await fs.unlink(tempFile);
            } catch (cleanupError) {
              console.warn('Failed to cleanup temp file:', cleanupError);
            }

            if (error) {
              console.error('Claude Code execution error:', error);
              reject(error);
              return;
            }

            if (stderr) {
              console.warn('Claude Code stderr:', stderr);
            }

            resolve(stdout.trim());
          });
        })
        .catch(reject);
    });
  }

  parseSurveyResponse(response) {
    try {
      // JSON 응답에서 코드 블록 제거 (```json...``` 형태)
      const cleanResponse = response
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim();

      const survey = JSON.parse(cleanResponse);
      
      // 기본값 설정
      if (!survey.title) survey.title = '새로운 설문';
      if (!survey.description) survey.description = '설문에 참여해주세요';
      if (!Array.isArray(survey.questions)) survey.questions = [];
      if (!Array.isArray(survey.suggestions)) survey.suggestions = [];

      // 질문 ID 자동 생성
      survey.questions.forEach((question, index) => {
        if (!question.id) {
          question.id = `q${index + 1}`;
        }
        if (typeof question.required !== 'boolean') {
          question.required = true;
        }
      });

      return {
        success: true,
        survey,
        engine: 'claude-code'
      };
    } catch (error) {
      console.error('Failed to parse survey response:', error);
      console.log('Raw response:', response);
      
      // 파싱 실패시 기본 설문 반환
      return {
        success: false,
        survey: this.getDefaultSurvey(),
        engine: 'claude-code',
        error: 'JSON 파싱에 실패했습니다. 기본 설문을 반환합니다.'
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

  async checkClaudeCodeAvailability() {
    return new Promise((resolve) => {
      exec('claude --version', (error, stdout) => {
        if (error) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }
}

module.exports = new ClaudeCodeService();