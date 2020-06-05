// -*- tab-width: 4; js-indent-level: 4; -*-
// ==UserScript==
// @name WhenIWork True Total Worked
// @namespace danielrayjones
// @description Adds the Total hours worked, including today
// @include https://app.wheniwork.com/payroll/
// @version 0.2.1
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// ==/UserScript==

/* global $ */
/* jshint esversion: 6 */

$(document).ready(function() {
  'use strict';

  // Filter out this event from iframes
  if (!this.body.classList.contains("controller-payroll")) {
    return;
  }

  let currentHourSum = 0;

  function updateHours(hours) {
    currentHourSum = hours;

    let weekPlusDayTotal = $('#week-plus-day-total');
    let span = `<span class="hour-type-label">Total with Today</span>${hours}`;

    if (weekPlusDayTotal.length === 0) {
      $('#header-summary-container .stats').append(
        `<div class="hour-type-summary"><div id="week-plus-day-total" class="hour-type-total difference">${span}</div></div>`
      );
    } else {
      weekPlusDayTotal.html(span);
    }

    // In case this ran while the page was loading, let's try again in two seconds.
    return setTimeout(addHours, 2000);
  }

  function addHours() {
    let hourSum = 0;
    $('.times-list .col-worked .text-input[data-total]').each(function () {
      hourSum += parseFloat($(this).text()) || 0;
    });

    // Adjust for floating point errors
    hourSum = Math.round(hourSum*100)/100;

    console.log(`got ${hourSum} hours`);

    // AJAX request hasn't finished yet. Let's wait some more.
    if (currentHourSum === 0 && hourSum === 0) return setTimeout(addHours, 2000);

    if (currentHourSum !== hourSum && hourSum > 0) {
      return updateHours(hourSum);
    }

    return null;
  }

  // The hours don't show up until after an AJAX request completes.
  // Let's wait two seconds for it to finish.
  setTimeout(addHours, 2000);

});
