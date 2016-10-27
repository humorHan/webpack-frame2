# webpack-frame2
强化webpack   弱化gulp<br>
//TODO 把htmlPlugin放在配置文件内通过传参决定html的hash是否添加<br>


### 常见问题一：以引入css为例，出现的相对路径引用的问题。<br>

1.在html中引入css文件会有相对路径问题，解决办法如下：<br>
   把html、css、js、img等静态文件放在src文件夹下（拼凑出../../bundle路径）<br>
2.操作如上，如果html原文件下需要再次分文件夹存放html：办法如下：<br>
   在webpack-config中，更改html模板的filename(fileName不变)，方法是：<br>
                                                       var arr = filePath.split('\/');<br>
                                                       fileName = 'html/' + arr[arr.length - 2] + '/' + fileName + '.html'<br>
3.当然，如果预先知道html是否需要分文件夹且如果分文件夹最多一层的话，可以不用代码去解决如上相对路径引用css的问题（::是否把静态文件放在src文件夹下）<br>




### 常见问题二：less文件和文件名字必须一样<br>
   原因：js中require less文件 webpack认为chunk是js的名字



### 问题三：img需要由gulp更换路径（或者模板文件中不使用img标签，但是尽量还是用gulp处理该问题保证万无一失）
   原因：模板对webpack的支持度不够好，引用的img无法找到。
   
   
   
   
# 综上解决办法归纳： 
    1.js和less文件统一名称
    2.img由gulp更换路径
