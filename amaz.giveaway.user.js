// ==UserScript==
// @name Official Amazon Giveaway Listing Visited Remover
// @namespace danielrayjones
// @description Allow removal of visited links on Amazon Giveaway Listing
// @include https://smile.amazon.com/ga/giveaways*
// @include https://www.amazon.com/ga/giveaways*
// @version 1.6
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// ==/UserScript==

var checked = false;

var getSmallUrl = function(fullUrl) {
  return fullUrl.split('?')[0];
};

var hideOne = function(el) {
  $(el).parents('div.a-spacing-base').css('display', checked ? 'none' : 'block');
};

var hideVisited = function(evt) {
  checked = $(this).prop('checked');
  var $links = $('.landingPageSpacings a[href*="amazon.com/ga"]');

  $links.each(function() {
    var href = getSmallUrl($(this).attr('href'));
    if (localStorage.getItem(href)) {
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

  $('h1:contains("Giveaways")').after('<label><input type="checkbox" id="hide_visited"/> Visited</label>');
  $('#hide_visited').on('click', hideVisited);
});
