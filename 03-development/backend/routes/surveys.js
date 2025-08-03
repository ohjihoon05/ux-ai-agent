const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const databaseService = require('../services/databaseService');

// AI 엔진 상태 확인
router.get('/engines/status', async (req, res) => {
  try {
    const status = await aiService.getEngineStatus();
    res.json(status); // 직접 반환 (테스트 호환성을 위해)
  } catch (error) {
    console.error('Engine status check failed:', error);
    res.status(500).json({
      success: false,
      message: 'AI 엔진 상태 확인에 실패했습니다.',
      error: error.message
    });
  }
});

// 지원하는 AI 엔진 목록
router.get('/engines', (req, res) => {
  const engines = aiService.getSupportedEngines();
  res.json(engines); // 직접 반환 (테스트 호환성을 위해)
});

// AI 설문 생성
router.post('/generate', async (req, res) => {
  try {
    const { purpose, targetAudience, language, engine, model } = req.body;

    // 유효성 검사
    if (!purpose || purpose.trim() === '') {
      return res.status(400).json({
        success: false,
        message: '설문 목적을 입력해주세요.'
      });
    }

    // 엔진 검증
    const supportedEngines = aiService.getSupportedEngines();
    if (engine && !supportedEngines.includes(engine)) {
      return res.status(400).json({
        success: false,
        message: `지원하지 않는 AI 엔진입니다. 지원 엔진: ${supportedEngines.join(', ')}`
      });
    }

    // AI 설문 생성 요청
    const request = {
      purpose: purpose.trim(),
      targetAudience: targetAudience || '일반 사용자',
      language: language || 'ko',
      engine: engine,
      model: model
    };

    console.log('Survey generation request:', request);

    const result = await aiService.generateSurvey(request);

    res.json({
      success: result.success,
      survey: result.survey,
      meta: {
        engine: result.engine,
        fallback: result.fallback || false,
        originalEngine: result.originalEngine,
        error: result.error
      }
    });

  } catch (error) {
    console.error('Survey generation failed:', error);
    res.status(500).json({
      success: false,
      message: '설문 생성에 실패했습니다.',
      error: error.message
    });
  }
});

// 설문 템플릿 목록 (추후 확장용)
router.get('/templates', (req, res) => {
  const templates = [
    {
      id: 'user-satisfaction',
      name: '사용자 만족도 조사',
      description: '제품이나 서비스의 사용자 만족도를 측정하는 설문',
      category: 'satisfaction'
    },
    {
      id: 'usability-test',
      name: '사용성 테스트',
      description: 'UI/UX의 사용성을 평가하는 설문',
      category: 'usability'
    },
    {
      id: 'feature-feedback',
      name: '기능 피드백',
      description: '새로운 기능에 대한 사용자 피드백 수집',
      category: 'feedback'
    },
    {
      id: 'market-research',
      name: '시장 조사',
      description: '시장 트렌드와 사용자 니즈 파악',
      category: 'research'
    }
  ];

  res.json({
    success: true,
    data: templates
  });
});

// 설문 미리보기 (생성된 설문의 HTML 미리보기)
router.post('/preview', (req, res) => {
  try {
    const { survey } = req.body;

    if (!survey || !survey.questions) {
      return res.status(400).json({
        success: false,
        message: '유효하지 않은 설문 데이터입니다.'
      });
    }

    // 간단한 HTML 미리보기 생성
    let html = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${survey.title}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
        .question { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        .required { color: red; }
        input, textarea, select { width: 100%; padding: 8px; margin: 5px 0; }
        .options label { display: block; margin: 5px 0; }
    </style>
</head>
<body>
    <h1>${survey.title}</h1>
    <p>${survey.description}</p>
    <form>
`;

    survey.questions.forEach((question, index) => {
      html += `<div class="question">`;
      html += `<h3>${index + 1}. ${question.text} ${question.required ? '<span class="required">*</span>' : ''}</h3>`;

      switch (question.type) {
        case 'text':
          html += `<textarea name="${question.id}" placeholder="답변을 입력해주세요"></textarea>`;
          break;
        case 'multiple-choice':
          if (question.options) {
            html += `<div class="options">`;
            question.options.forEach((option, optIndex) => {
              html += `<label><input type="radio" name="${question.id}" value="${option}"> ${option}</label>`;
            });
            html += `</div>`;
          }
          break;
        case 'rating':
          html += `<select name="${question.id}">`;
          for (let i = 1; i <= 5; i++) {
            html += `<option value="${i}">${i}점</option>`;
          }
          html += `</select>`;
          break;
        case 'boolean':
          html += `<div class="options">
            <label><input type="radio" name="${question.id}" value="true"> 예</label>
            <label><input type="radio" name="${question.id}" value="false"> 아니오</label>
          </div>`;
          break;
      }
      html += `</div>`;
    });

    html += `
        <button type="submit">제출</button>
    </form>
</body>
</html>`;

    res.json({
      success: true,
      data: {
        html: html,
        url: null // 실제로는 임시 URL 생성 가능
      }
    });

  } catch (error) {
    console.error('Preview generation failed:', error);
    res.status(500).json({
      success: false,
      message: '미리보기 생성에 실패했습니다.',
      error: error.message
    });
  }
});

// === 설문 CRUD API ===

// 설문 목록 조회
router.get('/', async (req, res) => {
  try {
    const { status, userId } = req.query;
    const surveys = await databaseService.getSurveys(userId, status);
    
    res.json({
      success: true,
      data: surveys,
      count: surveys.length
    });
  } catch (error) {
    console.error('Failed to get surveys:', error);
    res.status(500).json({
      success: false,
      message: '설문 목록 조회에 실패했습니다.',
      error: error.message
    });
  }
});

// 설문 상세 조회
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const survey = await databaseService.getSurvey(id);
    
    res.json({
      success: true,
      data: survey
    });
  } catch (error) {
    console.error('Failed to get survey:', error);
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: '설문 조회에 실패했습니다.',
      error: error.message
    });
  }
});

// 설문 저장
router.post('/', async (req, res) => {
  try {
    const surveyData = req.body;
    
    // 필수 필드 검증
    if (!surveyData.title || !surveyData.questions || !Array.isArray(surveyData.questions)) {
      return res.status(400).json({
        success: false,
        message: '설문 제목과 질문이 필요합니다.'
      });
    }

    const savedSurvey = await databaseService.saveSurvey(surveyData);
    
    res.status(201).json({
      success: true,
      data: savedSurvey,
      message: '설문이 성공적으로 저장되었습니다.'
    });
  } catch (error) {
    console.error('Failed to save survey:', error);
    res.status(500).json({
      success: false,
      message: '설문 저장에 실패했습니다.',
      error: error.message
    });
  }
});

// 설문 업데이트
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedSurvey = await databaseService.updateSurvey(id, updateData);
    
    res.json({
      success: true,
      data: updatedSurvey,
      message: '설문이 성공적으로 업데이트되었습니다.'
    });
  } catch (error) {
    console.error('Failed to update survey:', error);
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: '설문 업데이트에 실패했습니다.',
      error: error.message
    });
  }
});

// 설문 삭제
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await databaseService.deleteSurvey(id);
    
    res.json({
      success: true,
      message: '설문이 성공적으로 삭제되었습니다.'
    });
  } catch (error) {
    console.error('Failed to delete survey:', error);
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: '설문 삭제에 실패했습니다.',
      error: error.message
    });
  }
});

// === 설문 응답 API ===

// 설문 응답 제출
router.post('/:id/responses', async (req, res) => {
  try {
    const { id } = req.params;
    const responseData = {
      ...req.body,
      surveyId: id,
      userAgent: req.get('User-Agent'),
      ipAddress: req.ip
    };
    
    const savedResponse = await databaseService.saveResponse(responseData);
    
    res.status(201).json({
      success: true,
      data: savedResponse,
      message: '응답이 성공적으로 제출되었습니다.'
    });
  } catch (error) {
    console.error('Failed to save response:', error);
    res.status(500).json({
      success: false,
      message: '응답 제출에 실패했습니다.',
      error: error.message
    });
  }
});

// 설문 응답 목록 조회
router.get('/:id/responses', async (req, res) => {
  try {
    const { id } = req.params;
    const responses = await databaseService.getResponses(id);
    
    res.json({
      success: true,
      data: responses,
      count: responses.length
    });
  } catch (error) {
    console.error('Failed to get responses:', error);
    res.status(500).json({
      success: false,
      message: '응답 조회에 실패했습니다.',
      error: error.message
    });
  }
});

// 설문 응답 통계
router.get('/:id/stats', async (req, res) => {
  try {
    const { id } = req.params;
    const stats = await databaseService.getResponseStats(id);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Failed to get response stats:', error);
    res.status(500).json({
      success: false,
      message: '통계 조회에 실패했습니다.',
      error: error.message
    });
  }
});

// === 데이터베이스 상태 API ===

// 데이터베이스 상태 확인
router.get('/system/database', async (req, res) => {
  try {
    const status = await databaseService.getStatus();
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('Failed to get database status:', error);
    res.status(500).json({
      success: false,
      message: '데이터베이스 상태 확인에 실패했습니다.',
      error: error.message
    });
  }
});

module.exports = router;