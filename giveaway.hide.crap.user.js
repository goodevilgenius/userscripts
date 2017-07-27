// ==UserScript==
// @name Amazon Giveaways Crappy Stuff Remover
// @namespace danielrayjones
// @description Remove stuff I don't like from Amazon Giveaway Listing
// @include https://giveawaylisting.com/
// @version 1.0
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// ==/UserScript==

/* global $ */

var hide = function(text) {
  $('#giveaways a:contains("' + text +'")')
    .parent('td').parent('tr').css('display', 'none');
};

$(document).ready(function() {

  hide('LERDU');
  hide('D EXCEED');

});
