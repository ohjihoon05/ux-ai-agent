/**
 * 인증 서비스
 * Phase 14: 간단한 세션 기반 인증 시스템
 */

const crypto = require('crypto');
const databaseService = require('./databaseService');
const logger = require('../utils/logger');

class AuthService {
  constructor() {
    this.sessions = new Map(); // 메모리 기반 세션 저장소 (실제로는 Redis 권장)
    this.sessionTimeout = 24 * 60 * 60 * 1000; // 24시간 (밀리초)
  }

  // 비밀번호 해싱
  hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return { salt, hash };
  }

  // 비밀번호 검증
  verifyPassword(password, salt, hash) {
    const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash === verifyHash;
  }

  // 세션 토큰 생성
  generateSessionToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  // 사용자 등록
  async register(userData) {
    try {
      const { email, password, name } = userData;

      // 이메일 중복 확인
      const existingUsers = await databaseService.readFile(databaseService.usersFile);
      const existingUser = existingUsers.find(user => user.email === email);
      
      if (existingUser) {
        throw new Error('이미 등록된 이메일입니다.');
      }

      // 비밀번호 해싱
      const { salt, hash } = this.hashPassword(password);

      // 사용자 데이터 준비
      const newUser = {
        email,
        name,
        password: hash,
        salt,
        role: 'user', // user, admin
        status: 'active', // active, inactive, pending
        profile: {
          department: userData.department || '',
          position: userData.position || '',
          company: userData.company || '원익IPS'
        }
      };

      // 사용자 저장
      const savedUser = await databaseService.saveUser(newUser);
      
      // 비밀번호 정보 제거 후 반환
      const { password: _, salt: __, ...userWithoutPassword } = savedUser;
      
      logger.info('User registered', { userId: savedUser.id, email });
      return userWithoutPassword;

    } catch (error) {
      logger.error('User registration failed', error, { email: userData.email });
      throw error;
    }
  }

  // 사용자 로그인
  async login(email, password) {
    try {
      const users = await databaseService.readFile(databaseService.usersFile);
      const user = users.find(u => u.email === email);

      if (!user) {
        throw new Error('등록되지 않은 이메일입니다.');
      }

      if (user.status !== 'active') {
        throw new Error('비활성화된 계정입니다.');
      }

      // 비밀번호 검증
      if (!this.verifyPassword(password, user.salt, user.password)) {
        throw new Error('비밀번호가 일치하지 않습니다.');
      }

      // 세션 생성
      const sessionToken = this.generateSessionToken();
      const sessionData = {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        loginAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + this.sessionTimeout).toISOString()
      };

      this.sessions.set(sessionToken, sessionData);

      // 로그인 시간 업데이트 (실제로는 DB 업데이트)
      user.lastLoginAt = new Date().toISOString();

      logger.info('User logged in', { 
        userId: user.id, 
        email,
        sessionToken: sessionToken.substring(0, 8) + '...'
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          profile: user.profile
        },
        sessionToken,
        expiresAt: sessionData.expiresAt
      };

    } catch (error) {
      logger.error('User login failed', error, { email });
      throw error;
    }
  }

  // 세션 검증
  async validateSession(sessionToken) {
    try {
      const sessionData = this.sessions.get(sessionToken);

      if (!sessionData) {
        return null;
      }

      // 세션 만료 확인
      if (new Date() > new Date(sessionData.expiresAt)) {
        this.sessions.delete(sessionToken);
        return null;
      }

      return sessionData;

    } catch (error) {
      logger.error('Session validation failed', error, { sessionToken: sessionToken?.substring(0, 8) });
      return null;
    }
  }

  // 로그아웃
  async logout(sessionToken) {
    try {
      const sessionData = this.sessions.get(sessionToken);
      
      if (sessionData) {
        this.sessions.delete(sessionToken);
        logger.info('User logged out', { 
          userId: sessionData.userId,
          email: sessionData.email 
        });
        return true;
      }

      return false;

    } catch (error) {
      logger.error('Logout failed', error);
      return false;
    }
  }

  // 사용자 정보 조회
  async getUser(userId) {
    try {
      const users = await databaseService.readFile(databaseService.usersFile);
      const user = users.find(u => u.id === userId);

      if (!user) {
        throw new Error('사용자를 찾을 수 없습니다.');
      }

      // 비밀번호 정보 제거
      const { password, salt, ...userWithoutPassword } = user;
      return userWithoutPassword;

    } catch (error) {
      logger.error('Failed to get user', error, { userId });
      throw error;
    }
  }

  // 사용자 프로필 업데이트
  async updateProfile(userId, profileData) {
    try {
      const users = await databaseService.readFile(databaseService.usersFile);
      const userIndex = users.findIndex(u => u.id === userId);

      if (userIndex === -1) {
        throw new Error('사용자를 찾을 수 없습니다.');
      }

      // 프로필 정보 업데이트
      users[userIndex] = {
        ...users[userIndex],
        name: profileData.name || users[userIndex].name,
        profile: {
          ...users[userIndex].profile,
          ...profileData.profile
        },
        updatedAt: new Date().toISOString()
      };

      // 파일 저장
      databaseService.writeFile(databaseService.usersFile, users);

      logger.info('User profile updated', { userId });

      // 비밀번호 정보 제거 후 반환
      const { password, salt, ...userWithoutPassword } = users[userIndex];
      return userWithoutPassword;

    } catch (error) {
      logger.error('Failed to update profile', error, { userId });
      throw error;
    }
  }

  // 전체 세션 정리 (만료된 세션 제거)
  cleanExpiredSessions() {
    const now = new Date();
    let cleanedCount = 0;

    for (const [token, sessionData] of this.sessions.entries()) {
      if (now > new Date(sessionData.expiresAt)) {
        this.sessions.delete(token);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      logger.info('Cleaned expired sessions', { count: cleanedCount });
    }

    return cleanedCount;
  }

  // 인증 상태 확인 미들웨어
  requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    const sessionToken = authHeader?.replace('Bearer ', '');

    if (!sessionToken) {
      return res.status(401).json({
        success: false,
        message: '인증 토큰이 필요합니다.'
      });
    }

    this.validateSession(sessionToken)
      .then(sessionData => {
        if (!sessionData) {
          return res.status(401).json({
            success: false,
            message: '유효하지 않거나 만료된 세션입니다.'
          });
        }

        // 요청 객체에 사용자 정보 추가
        req.user = {
          id: sessionData.userId,
          email: sessionData.email,
          name: sessionData.name,
          role: sessionData.role
        };

        next();
      })
      .catch(error => {
        logger.error('Auth middleware failed', error);
        res.status(500).json({
          success: false,
          message: '인증 처리 중 오류가 발생했습니다.'
        });
      });
  }

  // 관리자 권한 확인 미들웨어
  requireAdmin(req, res, next) {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '관리자 권한이 필요합니다.'
      });
    }
    next();
  }

  // 게스트 사용자 생성 (로그인 없이 사용)
  createGuestSession() {
    const guestToken = this.generateSessionToken();
    const guestData = {
      userId: `guest_${Date.now()}`,
      email: null,
      name: 'Guest User',
      role: 'guest',
      loginAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + (2 * 60 * 60 * 1000)).toISOString() // 2시간
    };

    this.sessions.set(guestToken, guestData);

    return {
      user: guestData,
      sessionToken: guestToken,
      expiresAt: guestData.expiresAt
    };
  }
}

// 세션 정리 스케줄러 (1시간마다)
const authService = new AuthService();
setInterval(() => {
  authService.cleanExpiredSessions();
}, 60 * 60 * 1000);

module.exports = authService;