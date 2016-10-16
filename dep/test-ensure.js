/**
 * Created by humorHan on 2016/6/24.
 */
var s = '测试require.ensure单独打成一个文件';
console.log(1);

module.exports = function(a,b){
    console.log(s);
    return a + b;
};