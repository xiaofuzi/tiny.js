var $$ = require('./lib/api');

console.log($$('.title'));
console.log($$('.title').addClass('redColor'));

console.log($$('.title').all().forEach(function(e){
	e.addClass('bule');
}));

$$('.title').each(function(dom){
	console.log(dom);
	dom.addClass('yang');
})