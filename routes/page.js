const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const {
  renderProfile, renderJoin, renderMain, renderHashtag,
} = require('../controllers/page');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.followerCount = req.user?.Followers?.length || 0;
  res.locals.followingCount = req.user?.Followings?.length || 0;
  res.locals.followingIdList = req.user?.Followings?.map(f => f.id) || [];
  next();
});

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: 프로필 페이지
 *     tags: [Page]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 프로필 페이지 렌더링
 *       401:
 *         description: 로그인 필요
 */
router.get('/profile', isLoggedIn, renderProfile);

/**
 * @swagger
 * /join:
 *   get:
 *     summary: 회원가입 페이지
 *     tags: [Page]
 *     responses:
 *       200:
 *         description: 회원가입 페이지 렌더링
 */
router.get('/join', isNotLoggedIn, renderJoin);

/**
 * @swagger
 * /:
 *   get:
 *     summary: 메인 페이지
 *     tags: [Page]
 *     responses:
 *       200:
 *         description: 메인 페이지 렌더링 (모든 글 목록)
 */
router.get('/', renderMain);

/**
 * @swagger
 * /hashtag:
 *   get:
 *     summary: 해시태그 검색 결과 페이지
 *     tags: [Page]
 *     parameters:
 *       - in: query
 *         name: hashtag
 *         required: true
 *         schema:
 *           type: string
 *         description: 검색할 해시태그
 *     responses:
 *       200:
 *         description: 해시태그 검색 결과 페이지 렌더링
 *       302:
 *         description: 해시태그가 없으면 메인 페이지로 리다이렉트
 */
router.get('/hashtag', renderHashtag);

module.exports = router;