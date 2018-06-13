// -*- tab-width: 4; js-indent-level: 4; -*-
// ==UserScript==
// @name         Trakt Simplifier
// @namespace    danielrayjones
// @version      0.0.1
// @description  Strip out eps/movies from trakt lists based on a query string
// @author       Dan Jones
// @match        https://trakt.tv/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let searches = window.location.search.substr(1).split('&');
    let query = {};
    searches.forEach(function (search) {
        let split = search.split('=');
        query[split[0]] = split[1];
    });

    if (!('since' in query)) return;

    let since = parseInt(query.since, 10);

    let watched_shows = JSON.parse(localStorage.watched_shows);;
    let watched_movies = JSON.parse(localStorage.watched_movies);

    $('[itemtype="http://schema.org/TVEpisode"], [itemtype="http://schema.org/Movie"]').each(function () {
        let type = $(this).attr('itemtype').replace(/^https?:\/\/schema.org\//, '');

        switch(type) {
        case "TVEpisode":
            processEpisode(this);
            break;
        case "Movie":
            processMovie(this);
            break;
        }
    });

    // Trigger resize
    if ($grid) {
        $grid.data('isotope').layout();
    }

    function processEpisode(that) {
        let $ep = $(that);
        let series = $ep.data('show-id');
        let ep = $ep.data('episode-id');

        let watched = watched_shows[series] ? watched_shows[series].e[ep] : null;

        if (!watched) return;

        if (watched[0] > since) $ep.remove();
    }

    function processMovie(that) {
        let $mov = $(that);
        let id = $mov.data('movie-id');

        let watched = watched_movies[id];

        if (!watched) return;

        if (watched[0] > since) $ep.remove();
    }
})();
