// -*- tab-width: 4; js-indent-level: 4; -*-
// ==UserScript==
// @name         Comic Extra Scraper
// @namespace    danielrayjones
// @version      0.0.4
// @description  Scrape comics from comicextra.com
// @author       Dan Jones
// @match        https://www.comicextra.com/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://bowercdn.net/c/konami-code-1.3.2/src/jquery.konami.min.js
// @require      https://bowercdn.net/c/jszip-3.1.5/dist/jszip.min.js
// ==/UserScript==

/* global jQuery, JSZip */

console.log('will scrape comics');

(function($) {
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

        if (end !== 'full') {
            alert('Must have the full comic');
            return;
        }

        let chapter = path.pop();
        let match;
        if ((match = chapter.match(/^chapter-([0-9]+)/))) {
            chapter = match[1];
        }

        let name = path.pop();

        console.log(`Getting ${name} ${chapter}`);

        let imgs = $('.chapter-main .chapter_img').toArray();
        console.log(imgs);

        let cbz = new JSZip();

        function downloadCbz() {
            cbz.generateAsync({type: 'blob'})
                .then(blob => {
                    let title = name.replace(/-/g, ' ') + ' ' + chapter;

                    let $el = $('<a>');
                    $(document.body).append($el);
                    $el.attr('href', URL.createObjectURL(blob));
                    $el.attr('download', `${title} (comicextra) (Danjones).cbz`);
                    $el.get(0).click();
                });
        }

        function getOne() {
            if (!imgs || !imgs.length) {
                downloadCbz();
                return;
            }

            let img = imgs.shift();
            console.log(img.src);

            fetch(`//cors-anywhere.herokuapp.com/${img.src}`).then(resp => resp.blob()).then(blob => {
                cbz.file(name + '-' + (i < 10 ? '00' : '0' ) + i + '.jpg', blob);

                i = i+1;
                setTimeout(getOne, 0);
            });
        }

        getOne();
    }
})(jQuery);
