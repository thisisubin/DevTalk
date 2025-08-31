const { User, Post, Hashtag } = require('../models');

exports.renderProfile = async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: { id: req.user.id },
            include: [
                {
                    model: User,
                    as: 'Followers',
                    attributes: ['id', 'nick'],
                },
                {
                    model: User,
                    as: 'Followings',
                    attributes: ['id', 'nick'],
                },
                {
                    model: Post,
                    as: 'Posts',
                    attributes: ['id', 'content', 'img', 'createdAt'],
                    order: [['createdAt', 'DESC']],
                },
            ],
        });

        console.log('Profile user data:', JSON.stringify(user, null, 2)); // 디버깅용

        res.render('profile', {
            title: '내 정보 - DevTalk',
            user: user
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

exports.renderJoin = (req, res) => {
    res.render('join', { title: '회원가입 - DevTalk' });
};

exports.renderMain = async (req, res, next) => {
    try {
        const posts = await Post.findAll({
            include: {
                model: User,
                attributes: ['id', 'nick'],
            },
            order: [['createdAt', 'DESC']],
        });
        res.render('main', {
            title: 'DevTalk',
            twits: posts,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
}

exports.renderHashtag = async (req, res, next) => {
    const query = req.query.hashtag;
    if (!query) {
        return res.redirect('/');
    }
    try {
        const hashtag = await Hashtag.findOne({ where: { title: query } });
        let posts = [];
        if (hashtag) {
            posts = await hashtag.getPosts({ include: [{ model: User }] });
        }

        return res.render('main', {
            title: `${query} | DevTalk`,
            twits: posts,
        });
    } catch (error) {
        console.error(error);
        return next(error);
    }
};