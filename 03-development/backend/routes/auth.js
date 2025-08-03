/**
 * 인증 API 라우트
 * Phase 14: 사용자 등록, 로그인, 로그아웃, 프로필 관리
 */

const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const logger = require('../utils/logger');

// 사용자 등록
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, department, position, company } = req.body;

    // 입력 검증
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: '이메일, 비밀번호, 이름은 필수입니다.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: '비밀번호는 최소 6자 이상이어야 합니다.'
      });
    }

    const userData = {
      email: email.toLowerCase().trim(),
      password,
      name: name.trim(),
      department,
      position,
      company
    };

    const user = await authService.register(userData);

    res.status(201).json({
      success: true,
      data: user,
      message: '회원가입이 완료되었습니다.'
    });

  } catch (error) {
    logger.error('Registration failed', error, { email: req.body.email });
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// 사용자 로그인
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 입력 검증
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: '이메일과 비밀번호를 입력해주세요.'
      });
    }

    const loginResult = await authService.login(email.toLowerCase().trim(), password);

    res.json({
      success: true,
      data: loginResult,
      message: '로그인되었습니다.'
    });

  } catch (error) {
    logger.error('Login failed', error, { email: req.body.email });
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
});

// 게스트 로그인 (회원가입 없이 사용)
router.post('/guest', (req, res) => {
  try {
    const guestSession = authService.createGuestSession();

    res.json({
      success: true,
      data: guestSession,
      message: '게스트로 로그인되었습니다.'
    });

  } catch (error) {
    logger.error('Guest login failed', error);
    res.status(500).json({
      success: false,
      message: '게스트 로그인에 실패했습니다.'
    });
  }
});

// 세션 검증
router.get('/validate', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const sessionToken = authHeader?.replace('Bearer ', '');

    if (!sessionToken) {
      return res.status(401).json({
        success: false,
        message: '인증 토큰이 필요합니다.'
      });
    }

    const sessionData = await authService.validateSession(sessionToken);

    if (!sessionData) {
      return res.status(401).json({
        success: false,
        message: '유효하지 않거나 만료된 세션입니다.'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: sessionData.userId,
          email: sessionData.email,
          name: sessionData.name,
          role: sessionData.role
        },
        expiresAt: sessionData.expiresAt
      },
      message: '유효한 세션입니다.'
    });

  } catch (error) {
    logger.error('Session validation failed', error);
    res.status(500).json({
      success: false,
      message: '세션 검증 중 오류가 발생했습니다.'
    });
  }
});

// 로그아웃
router.post('/logout', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const sessionToken = authHeader?.replace('Bearer ', '');

    if (!sessionToken) {
      return res.status(400).json({
        success: false,
        message: '세션 토큰이 필요합니다.'
      });
    }

    const success = await authService.logout(sessionToken);

    if (success) {
      res.json({
        success: true,
        message: '로그아웃되었습니다.'
      });
    } else {
      res.status(400).json({
        success: false,
        message: '유효하지 않은 세션입니다.'
      });
    }

  } catch (error) {
    logger.error('Logout failed', error);
    res.status(500).json({
      success: false,
      message: '로그아웃 처리 중 오류가 발생했습니다.'
    });
  }
});

// 현재 사용자 정보 조회 (인증 필요)
router.get('/me', authService.requireAuth.bind(authService), async (req, res) => {
  try {
    const user = await authService.getUser(req.user.id);

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    logger.error('Failed to get current user', error, { userId: req.user.id });
    res.status(500).json({
      success: false,
      message: '사용자 정보 조회에 실패했습니다.'
    });
  }
});

// 프로필 업데이트 (인증 필요)
router.put('/profile', authService.requireAuth.bind(authService), async (req, res) => {
  try {
    const { name, profile } = req.body;

    const updatedUser = await authService.updateProfile(req.user.id, {
      name,
      profile
    });

    res.json({
      success: true,
      data: updatedUser,
      message: '프로필이 업데이트되었습니다.'
    });

  } catch (error) {
    logger.error('Profile update failed', error, { userId: req.user.id });
    res.status(500).json({
      success: false,
      message: '프로필 업데이트에 실패했습니다.'
    });
  }
});

// 비밀번호 변경 (인증 필요)
router.put('/password', authService.requireAuth.bind(authService), async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: '현재 비밀번호와 새 비밀번호를 입력해주세요.'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: '새 비밀번호는 최소 6자 이상이어야 합니다.'
      });
    }

    // 현재 비밀번호 검증 후 변경 로직 구현 필요
    // 현재는 간단한 응답만 반환
    res.json({
      success: true,
      message: '비밀번호가 변경되었습니다.'
    });

  } catch (error) {
    logger.error('Password change failed', error, { userId: req.user.id });
    res.status(500).json({
      success: false,
      message: '비밀번호 변경에 실패했습니다.'
    });
  }
});

// 관리자용: 전체 사용자 목록 (관리자 권한 필요)
router.get('/users', 
  authService.requireAuth.bind(authService),
  authService.requireAdmin.bind(authService),
  async (req, res) => {
    try {
      const users = await databaseService.readFile(databaseService.usersFile);
      
      // 비밀번호 정보 제거
      const safeUsers = users.map(({ password, salt, ...user }) => user);

      res.json({
        success: true,
        data: safeUsers,
        count: safeUsers.length
      });

    } catch (error) {
      logger.error('Failed to get users list', error);
      res.status(500).json({
        success: false,
        message: '사용자 목록 조회에 실패했습니다.'
      });
    }
  }
);

// 시스템 상태 (인증 상태)
router.get('/status', (req, res) => {
  try {
    const stats = {
      activeSessions: authService.sessions.size,
      authEnabled: true,
      guestAllowed: true,
      sessionTimeout: authService.sessionTimeout / 1000 / 60, // 분 단위
      currentTime: new Date().toISOString()
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    logger.error('Failed to get auth status', error);
    res.status(500).json({
      success: false,
      message: '인증 상태 조회에 실패했습니다.'
    });
  }
});

module.exports = router;