/**
 * Created by humorHan on 2016/6/17.
 */
module.exports = {
	baseUrl: "http://localhost:63342/mfg_newb_webv2/html/demo/",
	//跳转页面，可以处理公用跳转逻辑
	redirectUrl: function(redirectUrl, fromUrl) {
		if (redirectUrl == "login.html") {
			window.location.href = this.baseUrl + redirectUrl;
		} else {
			if (this.getCookie("uname")) {
				window.location.href = this.baseUrl + redirectUrl;
			} else {
				window.location.href = this.baseUrl + "login.html";
			}
		}
	},
	//设置cookie
	setCookie: function(objName, objValue, objHours) {
		var str = objName + "=" + escape(objValue);

		if (objHours > 0) { //为0时不设定过期时间，浏览器关闭时cookie自动消失
			var date = new Date();
			var ms = objHours * 3600 * 1000;
			date.setTime(date.getTime() + ms);
			str += "; expires=" + date.toGMTString() + ";path=/";
		}
		document.cookie = str;
	},
	//获取cookie
	getCookie: function(objName) { //获取指定名称的cookie的值
		var arrStr = document.cookie.split("; ");
		for (var i = 0; i < arrStr.length; i++) {
			var temp = arrStr[i].split("=");
			if (temp[0] == objName) {
				return unescape(temp[1]);
			}
		}
	},
	// html转码
	htmlEncode: function(s) {
		var div = document.createElement('div');
		div.appendChild(document.createTextNode(s));
		return div.innerHTML;
	},
	// html解码
	htmldecode: function(s) {
		var div = document.createElement('div');
		div.innerHTML = s;
		return div.innerText || div.textContent;
	}
}