// ==UserScript==
// @name Auto Cookie Clicker
// @namespace danielrayjones
// @description Plays Cookie Clicker for you
// @include http://orteil.dashnet.org/cookieclicker/
// @version 0.0.2
// ==/UserScript==

let AutoClicker = {stop: false};
unsafeWindow.AutoClicker = AutoClicker;

document.addEventListener('load', function () {
  'use strict';

  let cookie = document.getElementById('bigCookie');
  let shimmers = document.getElementById('shimmers');

  function clickCookie() {
    AutoClicker.cookie.click();
    if (!AutoClicker.stop) {
      setTimeout(clickCookie, 5);
    }
  }

  let shimmerObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (shimmer) {
        console.log('clicking', shimmer);
        shimmer.click();
      });
    })
  });
  shimmerObserver.observe(shimmers, { childList: true});

  AutoClicker.cookie = cookie;
  AutoClicker.shimmers = shimmers;
  AutoClicker.clickCookie = clickCookie;
  AutoClicker.shimmerObserver = shimmerObserver;

  for (let i = 0; i < 20; i++) {
    clickCookie();
  }
});
