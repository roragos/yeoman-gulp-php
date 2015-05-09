#YEOMAN COM PHP e GULP
---

###Instalação dos módulos
	$ npm install
	$ bower install

###Local
	$ gulp serve
Testar no link: http://localhost:9000/app/index.php

###Gerar pacote de produção (dist)
	$ gulp

###Compilar apenas CSS para produção
	$ gulp stylesCompile

###Compilar apenas o arquivo scripts.php contendo os JS
	$ gulp jsCompile

###Limpar cache do gulp
	$ gulp clearCache

###Limpar pastas e arquivos durante o desenvolvimento - dist e .tmp
	$ gulp clean

---

###Pacotes
* jQuery
* jQuery UI
* Bootstrap com SASS
* Font-awesome
* Modernizr

###Plugins
* anchorAnimate (http://www.position-absolute.com)
* lazyload (http://www.appelsiini.net/projects/lazyload)
* scrollUp (https://github.com/markgoodyear/scrollup)
* dotdotdot (http://dotdotdot.frebsite.nl)
* Animate.css (http://daneden.me/animate)

###Yeoman e GULP
* [generator-gulp-webapp](https://github.com/yeoman/generator-gulp-webapp)
* [gulp-connect-php](https://github.com/micahblu/gulp-connect-php)