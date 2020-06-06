// -*- tab-width: 4; js-indent-level: 4; -*-
// ==UserScript==
// @name         Full Comic Scraper
// @namespace    danielrayjones
// @version      0.0.5
// @description  Scrape comics from fullcomic.pro
// @author       Dan Jones
// @match        http://fullcomic.pro/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://bowercdn.net/c/konami-code-1.3.2/src/jquery.konami.min.js
// @require      https://bowercdn.net/c/jszip-3.1.5/dist/jszip.min.js
// ==/UserScript==

/* global jQuery, JSZip */
/* jshint esversion: 6 */

console.log('will scrape comics');

(function($) {
    'use strict';

    $(window).konami({
        code: [71,69,84],
        cheat: getStuff
    });

    function getStuff() {
        let i = 0;

        let title = $('.title h1').text();

        let regex = /Issue #([0-9]+)/;
        let match;
        if ((match = title.match(regex))) {
            let issue = match[1];
            while (issue.length < 3) {
                issue = '0' + issue;
            }

            title = title.replace(regex, issue);
        }

        console.log(`Getting ${title}`);

        let imgs = $('#imgPages img').toArray();
        console.log(imgs);

        let cbz = new JSZip();

        function downloadCbz() {
            cbz.generateAsync({type: 'blob'})
                .then(blob => {
                    let fileTitle = title.replace(/: /g, ' - ');

                    let $el = $('<a>');
                    $(document.body).append($el);
                    $el.attr('href', URL.createObjectURL(blob));
                    $el.attr('download', `${fileTitle} (fullcomic) (Danjones).cbz`);
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
                let name = title.replace(/[^A-Za-z0-9]+/g, '-');

                cbz.file(name + '-' + (i < 10 ? '00' : '0' ) + i + '.jpg', blob);

                i = i+1;
                setTimeout(getOne, 0);
            });
        }

        getOne();
    }
})(jQuery);
