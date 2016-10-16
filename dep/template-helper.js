/**
 * Created by humorHan on 2016/5/26.
 */
var art = require('tmodjs-loader/runtime');
var u=require("util/util");

//时间戳转化方法
art.helper('dateFormat', function (date, format) {
    date = new Date(parseInt(date.replace("/Date(", "").replace(")/", ""), 10));
    date = new Date(date);
    var map = {
        "Y": date.getYear(),
        "M": date.getMonth() + 1, //月份
        "d": date.getDate(), //日
        "h": date.getHours(), //小时
        "m": date.getMinutes(), //分
        "s": date.getSeconds(), //秒
        "q": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
        var v = map[t];
        if (v !== undefined) {
            if (all.length > 1) {
                v = '0' + v;
                v = v.substr(v.length - 2);
            }
            return v;
        }
        else if (t === 'y') {
            return (date.getFullYear() + '').substr(4 - all.length);
        }
        return all;
    });
    return format;
});
//获取科目
art.helper('getSubjectName',function(subject){
    return u.getSubjectName(subject);
});
//获取阶段
art.helper('getStageStr',function(stage){
        return u.getStageStr(stage);
});
//转码 正确答案
art.helper('unEscape', function(answer){
    if (!answer){
        return "未作答";
    } else {
        return unescape(answer);
    }
});