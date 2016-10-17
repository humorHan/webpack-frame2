# webpack-frame2
强化webpack   弱化gulp


以引入css为例，出现的相对路径引用的问题。

1.在html中引入css文件会有相对路径问题，解决办法如下：
   把html、css、js、img等静态文件放在src文件夹下（拼凑出../../bundle路径）
2.操作如上，如果html原文件下需要再次分文件夹存放html：办法如下：
   在webpack-config中，更改html模板的filename(fileName不变)，方法是：
                                                       var arr = filePath.split('\/');
                                                       fileName = 'html/' + arr[arr.length - 2] + '/' + fileName + '.html'
3.当然，如果预先知道html是否需要分文件夹且如果分文件夹最多一层的话，可以不用代码去解决如上相对路径引用css的问题（::是否把静态文件放在src文件夹下）


//TODO 把htmlPlugin放在配置文件内通过传参决定html的hash是否添加

