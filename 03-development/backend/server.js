require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3001;

// 미들웨어
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',') 
  : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 구조화된 API 로깅
app.use(logger.logApiRequest);

// 라우트
app.use('/api/auth', require('./routes/auth'));
app.use('/api/surveys', require('./routes/surveys'));

// 헬스 체크
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API 루트
app.get('/api', (req, res) => {
  res.json({
    message: 'UX Research AI Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        guest: 'POST /api/auth/guest',
        logout: 'POST /api/auth/logout',
        validate: 'GET /api/auth/validate',
        profile: 'GET|PUT /api/auth/me',
        status: 'GET /api/auth/status'
      },
      surveys: {
        engines: '/api/surveys/engines',
        engineStatus: '/api/surveys/engines/status',
        generate: 'POST /api/surveys/generate',
        templates: '/api/surveys/templates',
        preview: 'POST /api/surveys/preview',
        crud: 'GET|POST|PUT|DELETE /api/surveys/',
        responses: 'GET|POST /api/surveys/:id/responses',
        stats: 'GET /api/surveys/:id/stats'
      }
    }
  });
});

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '요청한 엔드포인트를 찾을 수 없습니다.',
    path: req.path
  });
});

// 구조화된 에러 핸들러
app.use((error, req, res, next) => {
  logger.logError('Unhandled server error', error, {
    url: req.url,
    method: req.method,
    body: req.body
  });

  res.status(500).json({
    success: false,
    message: '서버 내부 오류가 발생했습니다.',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// 서버 시작
app.listen(PORT, () => {
  logger.info('UX Research AI Backend Server Started', {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'INFO'
  });

  console.log('🚀 UX Research AI Backend Server Started');
  console.log(`📍 Server running on http://localhost:${PORT}`);
  console.log(`📍 API Documentation: http://localhost:${PORT}/api`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📝 Log Level: ${process.env.LOG_LEVEL || 'INFO'}`);
  console.log('');
  console.log('Available endpoints:');
  console.log('  GET  /api/health                     - 서버 상태 확인');
  console.log('  POST /api/auth/register              - 회원가입');
  console.log('  POST /api/auth/login                 - 로그인');
  console.log('  POST /api/auth/guest                 - 게스트 로그인');
  console.log('  GET  /api/surveys/engines            - AI 엔진 목록');
  console.log('  GET  /api/surveys/engines/status     - AI 엔진 상태');
  console.log('  POST /api/surveys/generate           - AI 설문 생성');
  console.log('  GET  /api/surveys/                   - 설문 목록');
  console.log('  POST /api/surveys/                   - 설문 저장');
  console.log('');
});