// -*- tab-width: 4; js-indent-level: 4; -*-
// ==UserScript==
// @name         Viewcomic Scraper
// @namespace    danielrayjones
// @version      0.0.9
// @description  Scrape comics from viewcomic.com
// @author       Dan Jones
// @match        http://viewcomic.com/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://bowercdn.net/c/konami-code-1.3.2/src/jquery.konami.min.js
// @require      https://bowercdn.net/c/jszip-3.1.5/dist/jszip.min.js
// ==/UserScript==

/* global jQuery, JSZip */
/* jshint esversion: 6 */

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
        let name = end ? end : 'comic';

        let imgs = $('div.pinbin-copy img.picture, div.pinbin-copy img.hoverZoomLink').toArray();
        console.log(imgs);

        let cbz = new JSZip();

        function downloadCbz() {
            cbz.generateAsync({type: 'blob'})
                .then(blob => {
                    let title = name.replace(/-/g, ' ').replace(/\b([0-9]{4})\b/, '($1)');

                    let $el = $('<a>');
                    $(document.body).append($el);
                    $el.attr('href', URL.createObjectURL(blob));
                    $el.attr('download', `${title} (viewcomic) (Danjones).cbz`);
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

            fetch(img.src).then(resp => resp.blob()).then(blob => {
                cbz.file(name + '-' + (i < 10 ? '00' : '0' ) + i + '.jpg', blob);

                i = i+1;
                setTimeout(getOne, 0);
            });
        }

        getOne();
    }
})(jQuery);
