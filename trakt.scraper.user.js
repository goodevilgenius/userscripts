// ==UserScript==
// @name         Trakt Scraper
// @namespace    danielrayjones
// @version      0.0.1
// @description  Scrape lists of shows/movies from Trakt and download a JSON file
// @author       Dan Jones
// @match        https://trakt.tv/*
// @grant        none
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// ==/UserScript==

(function() {
    'use strict';

    let watched_shows = JSON.parse(localStorage.watched_shows);
    let watched_movies = JSON.parse(localStorage.watched_movies);

    function processEpisode(that) {
        let $ep = $(that);
        let $series = $ep.find('[itemtype="http://schema.org/TVSeries"]');

        let series = $ep.data('show-id');
        let ep = $ep.data('episode-id');
        //let url = $ep.data('url');
        let url = $ep.children('[itemprop="url"]').attr('content');

        let series_title = $series.children('[itemprop="name"]').attr('content');
        let ep_title = $ep.children('[itemprop="name"]').attr('content');
        let ep_number = $ep.children('[itemprop="episodeNumber"]').attr('content');
        let season_number = $ep.data('season-number');
        //let title = $ep.data('title');
        let title = series_title + " " + season_number + "x" + ep_number + ' "' + ep_title + '"';

        let watched = watched_shows[series].e[ep];

        let this_ep = { title, url, watches: watched ? watched[1] : 0, last_watched: watched ? watched[0] : null};

        return this_ep;
    }

    function processMovie(that) {
        let $mov = $(that);
        let id = $mov.data('movie-id');

        let title = $mov.children('[itemprop="name"]').attr('content');
        let url = $mov.children('[itemprop="url"]').attr('content');
        let watched = watched_movies[id];

        let this_mov = { title, url, watches: watched ? watched[1] : 0, last_watched: watched ? watched[0] : null};

        return this_mov;
    }

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
})();
