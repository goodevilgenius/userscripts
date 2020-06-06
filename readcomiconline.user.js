// -*- tab-width: 4; js-indent-level: 4; -*-
// ==UserScript==
// @name         Read Comic Online Scraper
// @namespace    danielrayjones
// @version      0.0.4
// @description  Scrape comics from readcomiconline.to
// @author       Dan Jones
// @match        https://readcomiconline.to/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://bowercdn.net/c/konami-code-1.3.2/src/jquery.konami.min.js
// @require      https://bowercdn.net/c/jszip-3.1.5/dist/jszip.min.js
// ==/UserScript==

/* global jQuery, JSZip */
/* jshint esversion: 6 */

(function($) {
    'use strict';

    console.log('This does not work');
    return;

    $(window).konami({
        code: [71,69,84],
        cheat: getStuff
    });

    function getStuff() {
        let i = 0;

        let path = location.pathname.split('/');
        let chapter = path.pop();
        while (!chapter && path.length) {
            chapter = path.pop();
        }

        let match;
        if ((match = chapter.match(/^Issue-([0-9]+)/))) {
            chapter = match[1];
        }

        let name = path.pop();

        if (path.pop() !== 'Comic') {
            alert('Not on a comic page');
            return;
        }

        console.log(`Getting ${name} ${chapter}`);

        let imgs = $('#divImage img').toArray();
        console.log(imgs);

        let cbz = new JSZip();

        function downloadCbz() {
            cbz.generateAsync({type: 'blob'})
                .then(blob => {
                    let title = name.replace(/-/g, ' ') + ' ' + chapter;

                    let $el = $('<a>');
                    $(document.body).append($el);
                    $el.attr('href', URL.createObjectURL(blob));
                    $el.attr('download', `${title} (readcomiconline) (Danjones).cbz`);
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
