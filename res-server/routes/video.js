const {
    video_all,
    video_get_id,
    video_get_download
} = require('../controllers/videoController')

const express = require('express') //调用构造函数 新建app
const router = express.Router(); //使用express的router

//根据id获取视频，并提供视频
router.get('/', video_all)
router.get('/:id', video_get_id)
router.get('/:id/download', video_get_download)
// router.get('/:id/point', video_get_point)


/* todo */
// router.get('/:id/recommon', video_get_recommon)





module.exports = router