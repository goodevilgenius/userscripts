// -*- tab-width: 4; js-indent-level: 4; -*-
// ==UserScript==
// @name         Trakt Show Picker
// @namespace    danielrayjones
// @version      0.0.9
// @description  Pick a show from progress page
// @author       Dan Jones
// @match        https://trakt.tv/users/*/progress*
// @grant        none
// @require      https://bowercdn.net/c/konami-code-1.3.2/src/jquery.konami.min.js
// ==/UserScript==

/* global $, compressedCache, localStorage, MutationObserver */
/* jshint esversion: 6 */

(function() {
    'use strict';

    $(window).konami({
        code: [80, 73, 67, 75],
        cheat: pickShow
    });

    function addPickButton() {
        const $leftNav = $('.subnav-wrapper .container .left');
        const $found = $leftNav.find('.pick-episode');
        if (!$found.length) {
            $leftNav.append('<span class="filter-dropdown toggle-simple-progress pick-episode" title="Pick Episode"><span class="icon trakt-icon-wand"></span></span>')
                .find('.pick-episode').on('click', pickShow);
        }
    }
    addPickButton();
    const observer = new MutationObserver(addPickButton);
    observer.observe(document.head.parentElement, {childList: true});

    $('div[data-type="show"]').on('click', function () {
        $(this).removeClass('sortable-ghost');
    });

    let watched_shows;

    function getWeightedIndex(total) {
        const opts = [];
        for ( let idx = 0; idx < total; idx++) {
            for (let idxInst = 0; idxInst < total - idx; idxInst++) {
                opts.push(idx);
            }
        }

        const totalWeights = opts.length;
        const which = Math.floor(Math.random() * totalWeights);

        return opts[which];
    }

    function pickShow() {

        if ('compressedCache' in window) {
            watched_shows = compressedCache.get('watched_shows');
        } else {
            watched_shows = JSON.parse(localStorage.watched_shows);
        }

        let $shows = $('div[data-type="show"]');
        $shows.removeClass('sortable-ghost');
        $shows = filterShows($shows);

        let picked = getWeightedIndex($shows.length);
        let $picked = $shows.eq(picked);

        $shows.addClass('sortable-ghost');
        $picked.removeClass('sortable-ghost').insertAfter($picked.parent().find('.pagination-top'));

    }

    function filterShows($shows) {

        // Milliseconds in two days
        let twoDays = 2 * 24 * 60 * 60 * 1000;
        let twoDaysAgo = (new Date()) - twoDays;

        $shows.each(function (i, show) {

            let showId = Number.parseInt(show.dataset.showId);
            let showInfo = watched_shows[showId];
            if (!showInfo) return;

            let lastWatch = showInfo.ts*1000;
            // Skip ones we've watched in the last two days
            if (lastWatch > twoDaysAgo) {
                show.classList.add('sortable-ghost');
            }
        });

        return $shows.filter(':not(.sortable-ghost)');
    }

})();
