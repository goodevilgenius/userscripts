// ==UserScript== 
// @name Amazon Giveaway Listing Visited Remover
// @namespace danielrayjones
// @description Allow removal of visited links on Amazon Giveaway Listing
// @include https://giveawaylisting.com/
// ==/UserScript==

var hideVisited = function(evt) {
  console.log(evt);
};

var script = document.createElement("script");
script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js");
script.addEventListener('load', function() {

  window.$jq = jQuery.noConflict();
  $jq(document).ready(function() {
    $jq('#giveaways').on('click', 'a[href*="amzn.to"]', function(evt) {

      var href = $(this).attr('href');
      localStorage[href] = "visited";

    });
    
    $jq('b:contains("Hide")').after('<label><input type="checkbox" id="hide_visited"/> Visited</label>');
    $jq('#hide_visited').on('click', hideVisited);
  });
}, false);
document.body.appendChild(script);
