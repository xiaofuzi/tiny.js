var doc = dom(document);
var win = dom(window);

	var body = dom('<body>');

console.log(doc);
console.log(win);
console.log(body);

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