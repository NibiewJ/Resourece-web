const fs = require("fs");
const path = require("path");
var oldpath_img = null
var newpath_img = null
var oldpath_video = null
var newpath_video = null
const { connectDB, insert, findAll } = require('../database/index.js')

String.prototype.getUid = function () {
    return this.replace(/[^0-9]+/g, '')
}


//将零时的资源文件重命名 并移动到对应的文件夹下
const rename = (oldpath, newpath) => {
    fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        fs.stat(newpath, function (err, stats) {
            if (err) throw err;
            console.log('文件移动成功' + JSON.stringify(stats));
        });
    });
}

// 获取所有的视频表单
const video_all = async(req, res) => { //返回所有的video信息
    const sendRes = (data)=>{
        res.send(data)
    }
    findAll(sendRes) //使用回调函数的形式进行异步的数据发送
}

// 获取根据uid获取单个视频信息
const video_get_id = (req, res) => {
    const { id: videoId } = req.params
    // console.log(req)
    var file = path.resolve(__dirname, `../resources/video/${videoId}.mp4`);
    console.log(file);

    fs.stat(file, function (err, stats) {
        if (err) {
            res.end(err);
        }
        var positions = req.headers.range.replace(/bytes=/, "").split("-");
        var start = parseInt(positions[0], 10);
        var total = stats.size;
        var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
        var chunksize = end - start + 1;

        res.writeHead(206, {
            "Content-Range": "bytes " + start + "-" + end + "/" + total,
            "Accept-Ranges": "bytes",
            "Content-Length": chunksize,
            "Content-Type": "video/mp4",
        });

        var stream = fs
            .createReadStream(file, { start: start, end: end })
            .on("open", function () {
                stream.pipe(res);
            })
            .on("error", function (err) {
                res.end(err);
            });
    });
}

// 根据uid下载视频
const video_get_download = (req, res) => {

}


// 上传视频接口
const video_upload = (req, res) => {
    res.send('upload success!');
    let { uid } = req.body
    uid = uid.getUid()
    const suffix = req.files.file.name.split('.').pop() //获取后缀
    oldpath_video = path.join(__dirname, '..', req.files.file.path)
    newpath_video = path.join(__dirname, '..', 'resources/video', `${uid}.${suffix}`)
}

// 上传图片
const video_upload_img = (req, res) => {
    console.log(req.files);
    res.send('upload success!');
    let { uid } = req.body
    uid = uid.getUid() //获取纯数字的uid
    const suffix = req.files.avatar.name.split('.').pop()//获取后缀

    oldpath_img = path.join(__dirname, '..', req.files.avatar.path)
    newpath_img = path.join(__dirname, '..', 'resources/img', `${uid}.${suffix}`)
}

// 上传视频表单信息
const video_upload_data = (req, res) => {
    res.send('upload success!');
    let data = JSON.parse(Object.keys(req.body)[0])
    console.log('表单数据为' + data);
    // 上传条件判断 不可重复上传 不可重复录入数据库
    if (oldpath_img && newpath_img && oldpath_video && newpath_video) {
        rename(oldpath_video, newpath_video)
        rename(oldpath_img, newpath_img)
        //将零时的资源文件重命名 并移动到对应的文件夹下
        // 保存url 与 uid
        data.imgUrl = newpath_img
        data.videoUrl = newpath_video
        data.imgUid = data.avata[0].uid.getUid()
        data.videoUid = data.video.uid.getUid()
        insert(data)
        // 处理数据
        ldpath_img = newpath_img = oldpath_video = newpath_video = null
    }

    findAll()
}

module.exports = {
    video_all,
    video_get_id,
    video_get_download,
    video_upload,
    video_upload_img,
    video_upload_data
}