const express = require('express');
const passport = require('passport');

const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { join, login, logout } = require('../controllers/auth');

const router = express.Router();

/**
 * @swagger
 * /auth/join:
 *   post:
 *     summary: 회원가입
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - nick
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 이메일 주소
 *                 example: "user@example.com"
 *               nick:
 *                 type: string
 *                 maxLength: 15
 *                 description: 닉네임
 *                 example: "사용자"
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 description: 비밀번호
 *     responses:
 *       302:
 *         description: 회원가입 성공 후 메인 페이지로 리다이렉트
 *       400:
 *         description: 잘못된 요청
 */
//POST /auth/join
router.post('/join', isNotLoggedIn, join);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: 로그인
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 이메일 주소
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 description: 비밀번호
 *                 example: "password123"
 *     responses:
 *       302:
 *         description: 로그인 성공 후 메인 페이지로 리다이렉트
 *       401:
 *         description: 인증 실패
 */
//POST /auth/login
router.post('/login', isNotLoggedIn, login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: 로그아웃 (POST)
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: 로그아웃 성공 후 메인 페이지로 리다이렉트
 */
//POST /auth/logout
router.post('/logout', isNotLoggedIn, logout);

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: 로그아웃 (GET)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       302:
 *         description: 로그아웃 성공 후 메인 페이지로 리다이렉트
 */
//GET /auth/logout
router.get('/logout', isLoggedIn, logout);

/**
 * @swagger
 * /auth/kakao:
 *   get:
 *     summary: 카카오 로그인 시작
 *     tags: [Auth]
 *     description: 카카오 OAuth 인증 페이지로 리다이렉트
 *     responses:
 *       302:
 *         description: 카카오 인증 페이지로 리다이렉트
 */
//GET /auth/kakao
router.get('/kakao', passport.authenticate('kakao'));

/**
 * @swagger
 * /auth/kakao/callback:
 *   get:
 *     summary: 카카오 로그인 콜백
 *     tags: [Auth]
 *     description: 카카오 OAuth 인증 완료 후 처리
 *     responses:
 *       302:
 *         description: 인증 성공 시 메인 페이지로, 실패 시 에러 페이지로 리다이렉트
 */
//GET /auth/kakao/callback
router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/?error=카카오로그인 실패',
}), (req, res) => {
    res.redirect('/');
});

module.exports = router;