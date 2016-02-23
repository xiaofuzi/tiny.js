var doc = dom(document);
var win = dom(window);

var body = dom('<body>');
var titles = dom('.title');
console.log(dom);
console.log(body);
// console.log(titles);

// console.log(doc);
// console.log(win);
// console.log(body);

// console.log($$('.title'));
// console.log($$('.title').addClass('redColor'));

// console.log($$('.title').all().forEach(function(e){
// 	e.addClass('bule');
// }));

// $$('.title').each(function(dom){
// 	console.log(dom);
// 	dom.addClass('yang');
// })
// var dom = dom('.title');
// dom.css({'width': '200px', 'height': '100px', 'padding': '10px', 'border-width': '10px'});
// console.log('outerHeight', dom.outerHeight());
// console.log('Height', dom.height());
// console.log('innerHeight', dom.innerHeight());
// console.log('position', dom.position());
// console.log('viewportPostion', dom.viewportPostion());
// console.log('scrollTop', dom.scrollTop());
// console.log('css', dom.css());

//event test
var ul = dom('ul');
var li = dom('li');
var input = dom('input');
var button = dom('button');

ul.click(function(e) {
    console.log('ul', e);
});


li.click(function(e) {
    console.log('li', e);
})
ul.click();
li.click();

// ul.mouseover(function(e){
// 	console.log('ul mousehover:', e);
// })
// ul.mouseout(function(e){
// 	console.log('ul mouseout:', e);
// })

// ul.mouseup(function(e){
// 	console.log('ul mouseup:', e);
// })
// ul.mousedown(function(e){
// 	console.log('ul mousedown:', e);
// })

// ul.dblclick(function(e){
// 	console.log('ul dblclick:', e);
// })

button.submit(function(e){
	console.log(e);
	e.preventDefault();
	console.log('button submit:', e);
})

input.select(function(e){
	console.log('li select:', e);
})

var a = dom('a');
a.click(function(e){
	e.preventDefault();
})

