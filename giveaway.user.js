// ==UserScript==
// @name Amazon Giveaway Listing Visited Remover
// @namespace danielrayjones
// @description Allow removal of visited links on Amazon Giveaway Listing
// @include https://giveawaylisting.com/
// @version 1.3
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// ==/UserScript==

var checked = false;

var hideOne = function(el) {
  $(el).parent('td').parent('tr').css('display', checked ? 'none' : 'table-row');
};

var hideVisited = function(evt) {
  checked = $(this).prop('checked');
  var $links = $('#giveaways a[href*="amzn.to"]');

  $links.each(function() {
    var href = $(this).attr('href');
    if (localStorage.getItem(href)) {
      hideOne(this);
    }
  });
};

$(document).ready(function() {
  $('#giveaways').on('click', 'a[href*="amzn.to"]', function(evt) {

    var href = $(this).attr('href');
    localStorage[href] = "visited";
    hideOne(this);
  });

  $('b:contains("Hide")').after('<label><input type="checkbox" id="hide_visited"/> Visited</label>');
  $('#hide_visited').on('click', hideVisited);
});
