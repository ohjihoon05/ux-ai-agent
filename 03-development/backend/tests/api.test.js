/**
 * API 테스트 스크립트
 * Phase 10: API 엔드포인트 기능 검증
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3001';
const API_URL = `${BASE_URL}/api`;

// 테스트 결과 저장
const testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

// 테스트 헬퍼 함수
function logTest(name, success, message = '') {
  const status = success ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} ${name}${message ? `: ${message}` : ''}`);
  
  testResults.tests.push({ name, success, message });
  if (success) testResults.passed++;
  else testResults.failed++;
}

// 서버 연결 테스트
async function testServerConnection() {
  try {
    const response = await axios.get(`${API_URL}/health`);
    logTest('서버 연결', response.status === 200, `응답 시간: ${Date.now() - Date.now()}ms`);
    return true;
  } catch (error) {
    logTest('서버 연결', false, error.message);
    return false;
  }
}

// API 문서 테스트
async function testApiDocs() {
  try {
    const response = await axios.get(API_URL);
    const isValidResponse = response.data && response.data.message;
    logTest('API 문서', isValidResponse, 'API 루트 응답 확인');
  } catch (error) {
    logTest('API 문서', false, error.message);
  }
}

// AI 엔진 상태 테스트
async function testEngineStatus() {
  try {
    const response = await axios.get(`${API_URL}/surveys/engines/status`);
    const hasEngines = response.data && (response.data['claude-code'] || response.data.ollama);
    logTest('AI 엔진 상태', hasEngines, `엔진 수: ${Object.keys(response.data || {}).length}`);
  } catch (error) {
    logTest('AI 엔진 상태', false, error.message);
  }
}

// 지원 엔진 목록 테스트
async function testSupportedEngines() {
  try {
    const response = await axios.get(`${API_URL}/surveys/engines`);
    const hasEngineList = Array.isArray(response.data) && response.data.length > 0;
    logTest('지원 엔진 목록', hasEngineList, `지원 엔진: ${response.data?.join(', ')}`);
  } catch (error) {
    logTest('지원 엔진 목록', false, error.message);
  }
}

// 설문 생성 테스트 (Claude Code)
async function testSurveyGenerationClaude() {
  try {
    const testRequest = {
      purpose: '테스트용 설문입니다',
      targetAudience: 'API 테스트 사용자',
      language: 'ko',
      engine: 'claude-code'
    };

    console.log('\n🔄 Claude Code로 설문 생성 중...');
    const response = await axios.post(`${API_URL}/surveys/generate`, testRequest, {
      timeout: 60000 // 60초 타임아웃
    });

    const isValidSurvey = response.data?.survey?.questions?.length > 0;
    logTest('설문 생성 (Claude Code)', isValidSurvey, 
      `질문 수: ${response.data?.survey?.questions?.length || 0}`);
  } catch (error) {
    logTest('설문 생성 (Claude Code)', false, error.response?.data?.error || error.message);
  }
}

// 설문 생성 테스트 (Ollama)
async function testSurveyGenerationOllama() {
  try {
    const testRequest = {
      purpose: '테스트용 설문입니다',
      targetAudience: 'API 테스트 사용자', 
      language: 'ko',
      engine: 'ollama'
    };

    console.log('\n🔄 Ollama로 설문 생성 중...');
    const response = await axios.post(`${API_URL}/surveys/generate`, testRequest, {
      timeout: 60000 // 60초 타임아웃
    });

    const isValidSurvey = response.data?.survey?.questions?.length > 0;
    logTest('설문 생성 (Ollama)', isValidSurvey, 
      `질문 수: ${response.data?.survey?.questions?.length || 0}`);
  } catch (error) {
    logTest('설문 생성 (Ollama)', false, error.response?.data?.error || error.message);
  }
}

// 에러 처리 테스트
async function testErrorHandling() {
  try {
    // 잘못된 엔진으로 요청
    await axios.post(`${API_URL}/surveys/generate`, {
      purpose: '테스트',
      engine: 'invalid-engine'
    });
    logTest('에러 처리 (잘못된 엔진)', false, '에러가 발생해야 함');
  } catch (error) {
    const hasProperError = error.response?.status === 400;
    logTest('에러 처리 (잘못된 엔진)', hasProperError, `상태코드: ${error.response?.status}`);
  }

  try {
    // 빈 요청
    await axios.post(`${API_URL}/surveys/generate`, {});
    logTest('에러 처리 (빈 요청)', false, '에러가 발생해야 함');
  } catch (error) {
    const hasProperError = error.response?.status === 400;
    logTest('에러 처리 (빈 요청)', hasProperError, `상태코드: ${error.response?.status}`);
  }
}

// 전체 테스트 실행
async function runAllTests() {
  console.log('🧪 UX Research AI - API 테스트 시작\n');
  console.log('=' .repeat(50));

  // 기본 연결 테스트
  console.log('\n📡 기본 연결 테스트');
  const serverConnected = await testServerConnection();
  
  if (!serverConnected) {
    console.log('\n❌ 서버 연결 실패! 서버가 실행 중인지 확인하세요.');
    console.log('서버 시작: npm run dev (backend 폴더)');
    return;
  }

  await testApiDocs();
  
  // AI 엔진 테스트
  console.log('\n🤖 AI 엔진 테스트');
  await testEngineStatus();
  await testSupportedEngines();
  
  // 설문 생성 테스트
  console.log('\n📝 설문 생성 테스트');
  await testSurveyGenerationClaude();
  await testSurveyGenerationOllama();
  
  // 에러 처리 테스트
  console.log('\n🚨 에러 처리 테스트');
  await testErrorHandling();
  
  // 결과 요약
  console.log('\n' + '=' .repeat(50));
  console.log('📊 테스트 결과 요약');
  console.log('=' .repeat(50));
  console.log(`✅ 통과: ${testResults.passed}개`);
  console.log(`❌ 실패: ${testResults.failed}개`);
  console.log(`📈 성공률: ${Math.round((testResults.passed / (testResults.passed + testResults.failed)) * 100)}%`);
  
  if (testResults.failed > 0) {
    console.log('\n❌ 실패한 테스트:');
    testResults.tests
      .filter(test => !test.success)
      .forEach(test => console.log(`  - ${test.name}: ${test.message}`));
  }
  
  console.log('\n🎉 테스트 완료!');
}

// 스크립트 실행
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests, testResults };