module.exports = function () {
    //主键
    this.SID = "";
    //发送人ID
    this.SenderID = "";
    //接收人ID(多人用逗号隔开)
    this.ReceiverID = "";
    //标题
    this.Alert = "";
    //内容
    this.Body = "";
    //数据流
    this.DataStream = "";
    //条数
    this.Badge = 1;
    //时间
    this.Time = "";
    //链接
    this.Url = "";

    //是否已读
    this.IsReaded = "";
    //发送类型(私聊，群聊，广播)
    this.PushType = "";
    //发送完成
    this.IsPushFinish = "";

    //项目
    this.Project = "";
    //业务
    this.Business = "";
    //模块
    this.Module = "";
    //组ID
    this.GroupID = "";
    //数据ID
    this.DataID = "";
    //数据类型(文字、图片、文件等)
    this.DataType = "";

    //发送人名称
    this.SenderRealName = "";
    //发送人头像
    this.SenderHeadPortrait = "";
};