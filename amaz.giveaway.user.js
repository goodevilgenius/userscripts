// ==UserScript==
// @name Official Amazon Giveaway Listing Visited Remover
// @namespace danielrayjones
// @description Allow removal of visited links on Amazon Giveaway Listing
// @include https://smile.amazon.com/ga/giveaways*
// @include https://www.amazon.com/ga/giveaways*
// @version 1.7.1
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// ==/UserScript==

var checked = false;
var regex_hide;

var getSmallUrl = function(fullUrl) {
  return fullUrl.split('?')[0];
};

var hideOne = function(el) {
  $(el).parents('div.a-spacing-base').css('display', checked ? 'none' : 'block');
};

var hideVisited = function(evt) {
  checked = $(this).prop('checked');
  var $links = $('.landingPageSpacings a[href*="amazon.com/ga"]');

  var hide = regex_hide ? new RegExp(regex_hide, 'i') : null;

  $links.each(function() {
    var href = getSmallUrl($(this).attr('href'));
    if (localStorage.getItem(href)) {
      hideOne(this);
    }

    var title = $(this).find('.giveawayPrizeNameContainer').text();
    if (hide && hide.test(title)) {
      hideOne(this);
    }
  });
};

$(document).ready(function() {
  $('.landingPageSpacings').on('click', 'a[href*="amazon.com/ga"]', function(evt) {

    var href = getSmallUrl($(this).attr('href'));
    localStorage[href] = "visited";
    hideOne(this);
  });

  regex_hide = localStorage.getItem('regex_hide') || '';

  $('h1:contains("Giveaways")')
    .after('<label><input type="checkbox" id="hide_visited"/> Visited</label>')
    .after(`<input id="hide_regex" value="${regex_hide}"/>`);

  $('#hide_visited').on('click', hideVisited);
  $('#hide_regex').on('change', function() {
    regex_hide = $(this).val();
    localStorage.regex_hide = regex_hide;
  });
});
