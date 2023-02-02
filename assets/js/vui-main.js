var timer = 0;
window.onresize = function () {
if (timer > 0) {
clearTimeout(timer);
}
timer = setTimeout(function () {
var __body_width = $("body").width();
console.log(__body_width)
if(__body_width >= 1339){
sidebar_status = true;
$(".menu-btn .material-icons").text("close");
$(".vui-sidebar").animate({left:'0px'},500);
$(".vui-sidebar-back").fadeOut();
}else{
sidebar_status = false;
$(".menu-btn .material-icons").text("menu");
$(".vui-sidebar").animate({left:'-250px'},500);
$(".vui-sidebar-back").fadeOut();
}
}, 200);
};
//sidebar
var sidebar_status = false;
$(".menu-btn").click(() => {
switch(sidebar_status){
case false:
sidebar_status = true;
$(".menu-btn .material-icons").text("close");
$(".vui-sidebar").animate({left:'0px'},500);
$(".vui-sidebar-back").fadeIn();
break;
case true:
sidebar_status = false;
$(".menu-btn .material-icons").text("menu");
$(".vui-sidebar").animate({left:'-250px'},500);
$(".vui-sidebar-back").fadeOut();
break;
}
})
$(".vui-sidebar-back").click(() => {
switch(sidebar_status){
case false:
sidebar_status = true;
$(".menu-btn .material-icons").text("close");
$(".vui-sidebar").animate({left:'0px'},500);
$(".vui-sidebar-back").fadeIn();
break;
case true:
sidebar_status = false;
$(".menu-btn .material-icons").text("menu");
$(".vui-sidebar").animate({left:'-250px'},500);
$(".vui-sidebar-back").fadeOut();
break;
}
})