const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { afterUploadImage, uploadPost } = require('../controllers/post');
const { isLoggedIn } = require('../middlewares');
const { Post } = require('../models');

const router = express.Router();

try {
    fs.readdirSync('uploads');
} catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});

/**
 * @swagger
 * /post/img:
 *   post:
 *     summary: 이미지 업로드
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               img:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: 이미지 업로드 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   example: "/img/filename.jpg"
 */
// POST /post/img
router.post('/img', isLoggedIn, upload.single('img'), afterUploadImage);

/**
 * @swagger
 * /post:
 *   post:
 *     summary: 새 글 작성
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 maxLength: 140
 *                 description: 글 내용
 *                 example: "오늘 날씨가 좋네요 #맑음 #산책"
 *               url:
 *                 type: string
 *                 description: 이미지 URL (선택사항)
 *     responses:
 *       302:
 *         description: 글 작성 성공 후 메인 페이지로 리다이렉트
 */
// POST /post
const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), uploadPost);

// DELETE /post/:id
/**
 * @swagger
 * /post/{id}:
 *   delete:
 *     summary: 글 삭제
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 삭제할 글의 ID
 *     responses:
 *       200:
 *         description: 글 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "삭제되었습니다"
 *       403:
 *         description: 권한 없음
 *       500:
 *         description: 서버 오류
 */
router.delete('/:id', isLoggedIn, async (req, res) => {
    try {
        const post = await Post.findOne({ where: { id: req.params.id } });

        // 권한 확인
        if (post.UserId !== req.user.id) {
            return res.status(403).json({ message: '권한이 없습니다' });
        }

        await post.destroy(); // 글 삭제
        res.json({ message: '삭제되었습니다' });
    } catch (error) {
        res.status(500).json({ message: '서버 오류' });
    }
});

/**
 * @swagger
 * /post/{id}:
 *   put:
 *     summary: 글 수정
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 수정할 글의 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 maxLength: 140
 *                 description: 수정할 글 내용
 *                 example: "수정된 내용입니다 #태그"
 *     responses:
 *       200:
 *         description: 글 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "수정되었습니다"
 *                 post:
 *                   type: object
 *       403:
 *         description: 권한 없음
 *       500:
 *         description: 서버 오류
 */
// PUT /post/:id
router.put('/:id', isLoggedIn, async (req, res) => {
    try {
        const post = await Post.findOne({ where: { id: req.params.id } });

        // 권한 확인
        if (post.UserId !== req.user.id) {
            return res.status(403).json({ message: '권한이 없습니다' });
        }

        // 내용 업데이트
        await post.update({ content: req.body.content });
        res.json({ message: '수정되었습니다', post });
    } catch (error) {
        res.status(500).json({ message: '서버 오류' });
    }
});

module.exports = router;