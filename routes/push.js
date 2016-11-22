var express = require('express');
var router = express.Router();
var message = require('../models/message');

var makeMsg = function (req) {

    var msg = new message();

    //主键
    msg.UID = req.body.UID;
    //发送人ID
    msg.SenderID = req.body.SenderID;
    //接收人ID(多人用逗号隔开)
    msg.ReceiverID = req.body.ReceiverID;
    //标题
    msg.Alert = req.body.Alert;
    //内容
    msg.Body = req.body.Body;
    //数据流
    msg.DataStream = req.body.DataStream;
    //条数
    msg.Badge = 1;
    //时间
    msg.Time = req.body.Time;
    //链接
    msg.Url = req.body.Url;

    //是否已读
    msg.IsReaded = req.body.IsReaded;
    //发送类型(私聊，群聊，广播)
    msg.PushType = req.body.PushType;
    //发送完成
    msg.IsPushFinish = req.body.IsPushFinish;

    //项目
    msg.Project = req.body.Project;
    //业务
    msg.Business = req.body.Business;
    //模块
    msg.Module = req.body.Module;
    //组ID
    msg.GroupID = req.body.GroupID;
    //数据ID
    msg.DataID = req.body.DataID;
    //数据类型(文字、图片、文件等)
    msg.DataType = req.body.DataType;

    //发送人名称
    msg.SenderRealName = req.body.SenderRealName;
    //发送人头像
    msg.SenderHeadPortrait = req.body.SenderHeadPortrait;

    return msg;
}


router.post('/', function (req, res, next) {
    var client = req.client;

    var msg = makeMsg(req);

    var receivers = msg.ReceiverID.split(',');
    for (var i in receivers) {
        var receiver = receivers[i];
        client.hgetall(receiver, function (err, data) {
            if (err) {
                console.log('Error:' + err);
                return;
            }
            if (data) {
                console.dir(data);
                msg.ReceiverID = receiver;
                msg.IsPushFinish = true;
                res.emitter.to(receiver).emit("receive", msg);
            }
        });
    }


    res.json({ success: true });
});


module.exports = router;