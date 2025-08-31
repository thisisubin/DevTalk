const express = require('express');

const { isLoggedIn } = require('../middlewares');
const { follow } = require('../controllers/user');
const { User } = require('../models');

const router = express.Router();

/**
 * @swagger
 * /user/{id}/follow:
 *   post:
 *     summary: 사용자 팔로우
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 팔로우할 사용자의 ID
 *     responses:
 *       200:
 *         description: 팔로우 성공
 *       500:
 *         description: 서버 오류
 */
// POST /user/:id/follow
router.post('/:id/follow', isLoggedIn, follow);

/**
 * @swagger
 * /user/{id}/following:
 *   delete:
 *     summary: 팔로잉 취소 (언팔로우)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 언팔로우할 사용자의 ID
 *     responses:
 *       200:
 *         description: 언팔로우 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "팔로우를 취소했습니다."
 *       500:
 *         description: 서버 오류
 */
// 언팔로우 (팔로잉 취소)
router.delete('/:id/following', isLoggedIn, async (req, res) => {
    try {
        const user = await User.findOne({ where: { id: req.user.id } });
        await user.removeFollowing(req.params.id);
        res.json({ message: '팔로우를 취소했습니다.' });
    } catch (error) {
        console.error('언팔로우 에러:', error);
        res.status(500).json({ message: '서버 오류' });
    }
});

/**
 * @swagger
 * /user/{id}/follower:
 *   delete:
 *     summary: 팔로워 제거
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 제거할 팔로워의 ID
 *     responses:
 *       200:
 *         description: 팔로워 제거 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "팔로워가 제거되었습니다"
 *       500:
 *         description: 서버 오류
 */
// 팔로워 제거
router.delete('/:id/follower', isLoggedIn, async (req, res) => {
    try {
        const user = await User.findOne({ where: { id: req.user.id } });
        await user.removeFollower(req.params.id);
        res.json({ message: '팔로워가 제거되었습니다' });
    } catch (error) {
        console.error('팔로워 제거 에러:', error);
        res.status(500).json({ message: '서버 오류' });
    }
});

module.exports = router;