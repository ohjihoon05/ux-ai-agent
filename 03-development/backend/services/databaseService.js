/**
 * 데이터베이스 서비스 (로컬 JSON 파일 기반)
 * Phase 12: 간단한 로컬 데이터 저장 시스템
 */

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

class DatabaseService {
  constructor() {
    this.dataDir = path.join(__dirname, '../data');
    this.surveysFile = path.join(this.dataDir, 'surveys.json');
    this.responsesFile = path.join(this.dataDir, 'responses.json');
    this.usersFile = path.join(this.dataDir, 'users.json');

    this.ensureDataDirectory();
    this.initializeFiles();
  }

  // 데이터 디렉토리 생성
  ensureDataDirectory() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
      logger.info('Created data directory', { path: this.dataDir });
    }
  }

  // 데이터 파일 초기화
  initializeFiles() {
    const files = [
      { path: this.surveysFile, defaultData: [] },
      { path: this.responsesFile, defaultData: [] },
      { path: this.usersFile, defaultData: [] }
    ];

    files.forEach(({ path, defaultData }) => {
      if (!fs.existsSync(path)) {
        fs.writeFileSync(path, JSON.stringify(defaultData, null, 2));
        logger.info('Initialized data file', { file: path.split('/').pop() });
      }
    });
  }

  // 파일에서 데이터 읽기
  readFile(filePath) {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      logger.error('Failed to read data file', error, { file: filePath });
      return [];
    }
  }

  // 파일에 데이터 쓰기
  writeFile(filePath, data) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      logger.error('Failed to write data file', error, { file: filePath });
      return false;
    }
  }

  // === 설문 관련 메서드 ===

  // 설문 저장
  async saveSurvey(surveyData) {
    try {
      const surveys = this.readFile(this.surveysFile);
      
      const survey = {
        id: uuidv4(),
        title: surveyData.title,
        description: surveyData.description,
        questions: surveyData.questions,
        metadata: {
          purpose: surveyData.purpose,
          targetAudience: surveyData.targetAudience,
          language: surveyData.language,
          aiEngine: surveyData.aiEngine,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'draft' // draft, active, closed
        },
        settings: {
          allowAnonymous: true,
          collectEmail: false,
          showProgress: true,
          randomizeQuestions: false
        }
      };

      surveys.push(survey);
      
      if (this.writeFile(this.surveysFile, surveys)) {
        logger.info('Survey saved', { surveyId: survey.id, title: survey.title });
        return survey;
      } else {
        throw new Error('Failed to save survey to file');
      }
    } catch (error) {
      logger.error('Failed to save survey', error, surveyData);
      throw error;
    }
  }

  // 설문 목록 가져오기
  async getSurveys(userId = null, status = null) {
    try {
      let surveys = this.readFile(this.surveysFile);

      // 상태별 필터링
      if (status) {
        surveys = surveys.filter(survey => survey.metadata.status === status);
      }

      // 사용자별 필터링 (추후 인증 구현시)
      if (userId) {
        surveys = surveys.filter(survey => survey.metadata.createdBy === userId);
      }

      // 최신순 정렬
      surveys.sort((a, b) => new Date(b.metadata.createdAt) - new Date(a.metadata.createdAt));

      return surveys;
    } catch (error) {
      logger.error('Failed to get surveys', error);
      return [];
    }
  }

  // 설문 상세 조회
  async getSurvey(surveyId) {
    try {
      const surveys = this.readFile(this.surveysFile);
      const survey = surveys.find(s => s.id === surveyId);

      if (!survey) {
        throw new Error(`Survey not found: ${surveyId}`);
      }

      return survey;
    } catch (error) {
      logger.error('Failed to get survey', error, { surveyId });
      throw error;
    }
  }

  // 설문 업데이트
  async updateSurvey(surveyId, updateData) {
    try {
      const surveys = this.readFile(this.surveysFile);
      const surveyIndex = surveys.findIndex(s => s.id === surveyId);

      if (surveyIndex === -1) {
        throw new Error(`Survey not found: ${surveyId}`);
      }

      // 업데이트 데이터 병합
      surveys[surveyIndex] = {
        ...surveys[surveyIndex],
        ...updateData,
        metadata: {
          ...surveys[surveyIndex].metadata,
          ...updateData.metadata,
          updatedAt: new Date().toISOString()
        }
      };

      if (this.writeFile(this.surveysFile, surveys)) {
        logger.info('Survey updated', { surveyId });
        return surveys[surveyIndex];
      } else {
        throw new Error('Failed to update survey file');
      }
    } catch (error) {
      logger.error('Failed to update survey', error, { surveyId });
      throw error;
    }
  }

  // 설문 삭제
  async deleteSurvey(surveyId) {
    try {
      const surveys = this.readFile(this.surveysFile);
      const filteredSurveys = surveys.filter(s => s.id !== surveyId);

      if (surveys.length === filteredSurveys.length) {
        throw new Error(`Survey not found: ${surveyId}`);
      }

      if (this.writeFile(this.surveysFile, filteredSurveys)) {
        logger.info('Survey deleted', { surveyId });
        return true;
      } else {
        throw new Error('Failed to delete survey from file');
      }
    } catch (error) {
      logger.error('Failed to delete survey', error, { surveyId });
      throw error;
    }
  }

  // === 응답 관련 메서드 ===

  // 설문 응답 저장
  async saveResponse(responseData) {
    try {
      const responses = this.readFile(this.responsesFile);
      
      const response = {
        id: uuidv4(),
        surveyId: responseData.surveyId,
        answers: responseData.answers,
        metadata: {
          submittedAt: new Date().toISOString(),
          userAgent: responseData.userAgent,
          ipAddress: responseData.ipAddress,
          completionTime: responseData.completionTime, // 응답 소요 시간 (초)
          source: responseData.source || 'web' // web, mobile, api
        }
      };

      responses.push(response);
      
      if (this.writeFile(this.responsesFile, responses)) {
        logger.info('Response saved', { 
          responseId: response.id, 
          surveyId: response.surveyId 
        });
        return response;
      } else {
        throw new Error('Failed to save response to file');
      }
    } catch (error) {
      logger.error('Failed to save response', error, responseData);
      throw error;
    }
  }

  // 설문 응답 목록 가져오기
  async getResponses(surveyId) {
    try {
      const responses = this.readFile(this.responsesFile);
      const surveyResponses = responses.filter(r => r.surveyId === surveyId);

      // 최신순 정렬
      surveyResponses.sort((a, b) => 
        new Date(b.metadata.submittedAt) - new Date(a.metadata.submittedAt)
      );

      return surveyResponses;
    } catch (error) {
      logger.error('Failed to get responses', error, { surveyId });
      return [];
    }
  }

  // 응답 통계 가져오기
  async getResponseStats(surveyId) {
    try {
      const responses = await this.getResponses(surveyId);
      
      const stats = {
        totalResponses: responses.length,
        completionRate: 0, // 추후 계산
        averageCompletionTime: 0,
        lastResponseAt: null,
        dailyStats: {}
      };

      if (responses.length > 0) {
        // 평균 완료 시간 계산
        const totalTime = responses.reduce((sum, r) => 
          sum + (r.metadata.completionTime || 0), 0
        );
        stats.averageCompletionTime = Math.round(totalTime / responses.length);

        // 마지막 응답 시간
        stats.lastResponseAt = responses[0].metadata.submittedAt;

        // 일별 응답 수 계산
        responses.forEach(response => {
          const date = response.metadata.submittedAt.split('T')[0];
          stats.dailyStats[date] = (stats.dailyStats[date] || 0) + 1;
        });
      }

      return stats;
    } catch (error) {
      logger.error('Failed to get response stats', error, { surveyId });
      return { totalResponses: 0 };
    }
  }

  // === 사용자 관련 메서드 (추후 확장용) ===

  async saveUser(userData) {
    try {
      const users = this.readFile(this.usersFile);
      
      const user = {
        id: uuidv4(),
        ...userData,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };

      users.push(user);
      
      if (this.writeFile(this.usersFile, users)) {
        logger.info('User saved', { userId: user.id, email: user.email });
        return user;
      } else {
        throw new Error('Failed to save user to file');
      }
    } catch (error) {
      logger.error('Failed to save user', error, userData);
      throw error;
    }
  }

  // 데이터베이스 상태 확인
  async getStatus() {
    try {
      const surveys = this.readFile(this.surveysFile);
      const responses = this.readFile(this.responsesFile);
      const users = this.readFile(this.usersFile);

      return {
        status: 'connected',
        type: 'local-json',
        statistics: {
          surveys: surveys.length,
          responses: responses.length,
          users: users.length
        },
        dataDirectory: this.dataDir,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Failed to get database status', error);
      return {
        status: 'error',
        type: 'local-json',
        error: error.message
      };
    }
  }
}

// 싱글톤 인스턴스 생성
const databaseService = new DatabaseService();

module.exports = databaseService;