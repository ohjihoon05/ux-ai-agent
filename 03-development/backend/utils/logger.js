/**
 * 로깅 시스템
 * Phase 11: 구조화된 로깅 및 에러 추적
 */

const fs = require('fs');
const path = require('path');

// 로그 디렉토리 생성
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// 로그 레벨 정의
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

// 현재 로그 레벨 (환경변수에서 가져오기)
const currentLogLevel = LOG_LEVELS[process.env.LOG_LEVEL?.toUpperCase() || 'INFO'];

// 날짜 포맷팅
function formatDate(date = new Date()) {
  return date.toISOString().replace('T', ' ').substring(0, 19);
}

// 로그 파일명 생성
function getLogFileName(type = 'app') {
  const today = new Date().toISOString().split('T')[0];
  return path.join(logDir, `${type}-${today}.log`);
}

// 콘솔 색상
const colors = {
  ERROR: '\x1b[31m', // 빨간색
  WARN: '\x1b[33m',  // 노란색
  INFO: '\x1b[36m',  // 청록색
  DEBUG: '\x1b[32m', // 녹색
  RESET: '\x1b[0m'
};

// 기본 로그 함수
function writeLog(level, message, extra = null) {
  const timestamp = formatDate();
  const logLevel = level.toUpperCase();
  
  // 로그 레벨 체크
  if (LOG_LEVELS[logLevel] > currentLogLevel) {
    return;
  }

  // 로그 메시지 포맷
  let logMessage = `[${timestamp}] [${logLevel}] ${message}`;
  
  if (extra) {
    if (extra instanceof Error) {
      logMessage += `\nError: ${extra.message}\nStack: ${extra.stack}`;
    } else if (typeof extra === 'object') {
      logMessage += `\nData: ${JSON.stringify(extra, null, 2)}`;
    } else {
      logMessage += `\nExtra: ${extra}`;
    }
  }

  // 콘솔 출력 (색상 적용)
  const colorCode = colors[logLevel] || colors.RESET;
  console.log(`${colorCode}${logMessage}${colors.RESET}`);

  // 파일 출력
  const logFile = getLogFileName();
  fs.appendFileSync(logFile, logMessage + '\n', 'utf8');
}

// API 요청 로깅
function logApiRequest(req, res, next) {
  const start = Date.now();
  const { method, url, body, query, headers } = req;
  
  // 요청 로그
  info(`API Request: ${method} ${url}`, {
    query,
    body: method === 'POST' ? body : undefined,
    userAgent: headers['user-agent'],
    ip: req.ip
  });

  // 응답 로그
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    
    if (statusCode >= 400) {
      error(`API Response: ${method} ${url} - ${statusCode} (${duration}ms)`, {
        statusCode,
        duration,
        response: data?.substring ? data.substring(0, 500) : data
      });
    } else {
      info(`API Response: ${method} ${url} - ${statusCode} (${duration}ms)`, {
        statusCode,
        duration
      });
    }
    
    originalSend.call(this, data);
  };

  next();
}

// AI 엔진 로깅
function logAiRequest(engine, request, response, error = null) {
  const logData = {
    engine,
    request: {
      purpose: request.purpose?.substring(0, 100),
      targetAudience: request.targetAudience,
      language: request.language
    },
    success: !error,
    questionsGenerated: response?.questions?.length || 0,
    responseTime: response?.responseTime || 0
  };

  if (error) {
    logData.error = error.message;
    warn(`AI Request Failed: ${engine}`, logData);
  } else {
    info(`AI Request Success: ${engine}`, logData);
  }

  // AI 전용 로그 파일에도 기록
  const aiLogFile = getLogFileName('ai');
  const aiLogMessage = `[${formatDate()}] ${JSON.stringify(logData)}\n`;
  fs.appendFileSync(aiLogFile, aiLogMessage, 'utf8');
}

// 에러 로깅 (스택 트레이스 포함)
function logError(message, error, context = {}) {
  const errorData = {
    message: error?.message,
    stack: error?.stack,
    context
  };

  error(`ERROR: ${message}`, errorData);

  // 에러 전용 로그 파일
  const errorLogFile = getLogFileName('error');
  const errorLogMessage = `[${formatDate()}] ${message}\n${JSON.stringify(errorData, null, 2)}\n${'='.repeat(80)}\n`;
  fs.appendFileSync(errorLogFile, errorLogMessage, 'utf8');
}

// 성능 모니터링
function logPerformance(operation, duration, metadata = {}) {
  const perfData = {
    operation,
    duration,
    ...metadata
  };

  if (duration > 5000) { // 5초 이상은 경고
    warn(`Performance Warning: ${operation} took ${duration}ms`, perfData);
  } else {
    debug(`Performance: ${operation} took ${duration}ms`, perfData);
  }

  // 성능 전용 로그 파일
  const perfLogFile = getLogFileName('performance');
  const perfLogMessage = `[${formatDate()}] ${JSON.stringify(perfData)}\n`;
  fs.appendFileSync(perfLogFile, perfLogMessage, 'utf8');
}

// 로그 레벨별 함수들
const error = (message, extra) => writeLog('ERROR', message, extra);
const warn = (message, extra) => writeLog('WARN', message, extra);
const info = (message, extra) => writeLog('INFO', message, extra);
const debug = (message, extra) => writeLog('DEBUG', message, extra);

// 로그 파일 정리 (7일 이상 된 파일 삭제)
function cleanupOldLogs() {
  try {
    const files = fs.readdirSync(logDir);
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);

    files.forEach(file => {
      const filePath = path.join(logDir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.mtime.getTime() < sevenDaysAgo) {
        fs.unlinkSync(filePath);
        info(`Deleted old log file: ${file}`);
      }
    });
  } catch (err) {
    error('Failed to cleanup old logs', err);
  }
}

// 서버 시작시 이전 로그 정리
setTimeout(cleanupOldLogs, 5000);

module.exports = {
  error,
  warn,
  info,
  debug,
  logApiRequest,
  logAiRequest,
  logError,
  logPerformance,
  cleanupOldLogs
};