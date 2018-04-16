// -*- tab-width: 4; js-indent-level: 4; -*-
// ==UserScript==
// @name         Viewcomic Scraper
// @namespace    danielrayjones
// @version      0.0.3
// @description  Scrape comics from viewcomic.com
// @author       Dan Jones
// @match        http://viewcomic.com/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://raw.githubusercontent.com/tommcfarlin/konami-code/master/src/jquery.konami.min.js
// ==/UserScript==

(function() {
    'use strict';

    $(window).konami({
        code: [71,69,84],
        eventName: 'konami.get'
    });

    $(window).on('konami.get', getStuff);

    function getStuff() {
        let i = 0;

        let path = location.pathname.split('/');
        let end = path.pop();
        while (!end && path.length) {
            end = path.pop();
        }
        let name = end ? end : 'comic';

        let imgs = $('div.pinbin-copy img.picture').toArray();

        function getOne() {
            let img = imgs.shift();
            console.log(img.src);

            let $el = $('<a>');
            $(document.body).append($el);
            $el.attr('href', img.src);
            $el.attr('download', name + '-' + (i < 10 ? '00' : '0' ) + i + '.jpg');
            $el.get(0).click();

            i = i+1;
            setTimeout(getOne, 1000);
        }
        getOne();
    }

})();
