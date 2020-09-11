// -*- tab-width: 4; js-indent-level: 4; -*-
// ==UserScript==
// @name         Trakt Scraper
// @namespace    danielrayjones
// @version      0.0.8
// @description  Scrape lists of shows/movies from Trakt and download a JSON file
// @author       Dan Jones
// @match        https://trakt.tv/*
// @grant        none
// @require      https://bowercdn.net/c/konami-code-1.3.2/src/jquery.konami.min.js
// ==/UserScript==

/* global $, compressedCache, localStorage */
/* jshint esversion: 6 */

(function() {
    'use strict';

    $(window).konami({
        code: [71,69,84],
        cheat: getStuff
    });

    String.prototype.lpad = function(padString, length) {
        let str = this;
        while (str.length < length) {
            str = padString + str;
        }
        return str;
    };

    let watched_shows;
    let watched_movies;

    function processEpisode(that) {
        let $ep = $(that);
        let $series = $ep.find('[itemtype="http://schema.org/TVSeries"]');

        let this_ep = $ep.data();

        if ($series.length < 1) {
            $series = $('[itemtype="http://schema.org/TVSeries"]');
        }

        let series = $ep.data('show-id');
        let ep = $ep.data('episode-id');
        let url = $ep.children('[itemprop="url"]').attr('content');

        let series_title = $series.children('[itemprop="name"]').attr('content');

        let $ep_title = $ep.children('[itemprop="name"]');
        if ($ep_title.length < 1) {
            $ep_title = $ep.find('[itemprop="name"]');
        }

        let released = $ep.data('released') || null;
        if (released) {
            released = (new Date(released)).getTime()/1000;
        }

        let ep_title = $ep_title.attr('content');
        let ep_number = $ep.find('[itemprop="episodeNumber"]').attr('content');
        let season_number = $ep.data('season-number');

        if (!season_number) {
            let $title_ep = $ep.find('.main-title-sxe');
            if ($title_ep.length && $title_ep.text()) {
                let match = /([0-9+])x[0-9]+/.exec($title_ep.text());
                if (match) {
                    season_number = match[1];
                }
            }
        }

        if (!season_number) {
            season_number = 0;
        }

        let title = series_title + " " + String(season_number) + "x" + String(ep_number).lpad("0", 2) + ' "' + ep_title + '"';

        let watched = watched_shows[series] ? watched_shows[series].e[ep] : null;

        let $img = $ep.find('[itemprop="image"]');
        if ($img.length > 0) {
            this_ep['image'] = $img.attr('content');
        }

        this_ep['series_id'] = series;
        this_ep['episode_id'] = ep;
        this_ep['title'] = title;
        this_ep['url'] = url;
        this_ep['released'] = released;
        this_ep['watches'] = watched ? watched[1] : 0;
        this_ep['last_watched'] = watched ? watched[0] : null;

        return this_ep;
    }

    function processMovie(that) {
        let $mov = $(that);
        let this_mov = $mov.data();
        let id = $mov.data('movie-id');

        let title = $mov.children('[itemprop="name"]').attr('content');
        let url = $mov.children('[itemprop="url"]').attr('content');
        let watched = watched_movies[id];

        let $img = $mov.find('[itemprop="image"]');
        if ($img.length > 0) {
            this_mov['image'] = $img.attr('content');
        }

        this_mov['id'] = id;
        this_mov['title'] = title;
        this_mov['url'] = url;
        this_mov['watches'] = watched ? watched[1] : 0;
        this_mov['last_watched'] = watched ? watched[0] : null;

        return this_mov;
    }

    function getStuff() {

        if ('compressedCache' in window) {
            watched_shows = compressedCache.get('watched_shows');
            watched_movies = compressedCache.get('watched_movies');
        } else {
            watched_shows = JSON.parse(localStorage.watched_shows);
            watched_movies = JSON.parse(localStorage.watched_movies);
        }

        let $el = $('<a>');
        $(document.body).append($el);

        let items = $('[itemtype="http://schema.org/TVEpisode"], [itemtype="http://schema.org/Movie"]').map(function() {
            let type = $(this).attr('itemtype').replace(/^https?:\/\/schema.org\//, '');

            let data = {};
            switch(type) {
            case "TVEpisode":
                data = processEpisode(this);
                break;
            case "Movie":
                data = processMovie(this);
                break;
            }
            data.type = type;

            return data;
        });

        console.log(items);

        let data_string = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(items.toArray()));
        $el.attr('href', data_string);
        $el.attr('download', 'watched.json');
        $el.get(0).click();
    }

})();
