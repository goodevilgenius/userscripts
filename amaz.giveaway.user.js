// ==UserScript==
// @name Official Amazon Giveaway Listing Visited Remover
// @namespace danielrayjones
// @description Allow removal of visited links on Amazon Giveaway Listing
// @include https://smile.amazon.com/ga/giveaways*
// @include https://www.amazon.com/ga/giveaways*
// @version 1.9.1
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// ==/UserScript==

/* global jQuery */

(function ($) {
  'use strict';

  var checked = false;
  var regex_hide;

  var getSmallUrl = function(fullUrl) {
    return fullUrl.split('?')[0];
  };

  var hideOne = function(el) {
    $(el).parents('.listing-item').css('display', checked ? 'none' : 'block');
  };

  var hideVisited = function(evt) {
    checked = $(this).prop('checked');
    var $links = $('.listing-info-container a[href*="/ga"]');

    var hide = regex_hide ? new RegExp(regex_hide, 'i') : null;

    $links.each(function() {
      var href = getSmallUrl($(this).attr('href'));
      if (localStorage.getItem(href)) {
        hideOne(this);
      }

      var title = $(this).find('.prize-title').text();
      if (hide && title && hide.test(title)) {
        hideOne(this);
      }
    });
  };

  $(document).ready(function() {
    $('.listing-info-container').on('click', 'a[href*="/ga"]', function(evt) {
      var href = getSmallUrl($(this).attr('href'));
      localStorage[href] = "visited";
      hideOne(this);
    });

    $('.listing-info-container a[href*="/ga"]').attr('target', '_blank');

    regex_hide = localStorage.getItem('regex_hide') || '';

    $('#giveaway-numbers-container')
      .append('<label><input type="checkbox" id="hide_visited"/> Visited</label>')
      .append(`<input id="hide_regex" value="${regex_hide}"/>`);

    $('#hide_visited').on('click', hideVisited);
    $('#hide_regex').on('change', function() {
      regex_hide = $(this).val();
      localStorage.regex_hide = regex_hide;
    });
  });

})(jQuery);
