/**
 * Background script
 */

'use strict';

// Declaration for allow the global objects in ESLint
/*global chrome, StampStatusChecker*/

(function() {

	var INTERVAL_MSEC_UPDATE_STATUS = 60000; // 60 sec.


	/**
	 * Update the current status for badge of Chrome's toolbar
	 */
	var updateBadgeStatus = function () {

		// Get the options
		chrome.storage.sync.get(function(options) {

			if (options.jobcanCode == null) {
				return;
			}

			// Update the badge of Chrome's toolbar
			chrome.browserAction.setBadgeText({
				text: ''
			});

			// Initialize the checker
			var status_checker = new StampStatusChecker(options.jobcanCode);

			// Fetch the current working status
			status_checker.fetchCurrentWorkingStartedDate(function (err, start_date) {

				if (err) {

					chrome.browserAction.setTitle({
						title: 'Jobcan Quick Stamp\n[Error] Could not get the status.'
					});

					chrome.browserAction.setBadgeText({
						text: 'ERR'
					});

					chrome.browserAction.setBadgeBackgroundColor({
						color: '#ff0000'
					});

					return;
				}

				// Make a status text
				var badge_color = '#AAAAAA', badge_text = '-', detail_status = 'Free Time';
				if (start_date != null) {

					var now = new Date();

					var past_hours = (now.getTime() - start_date.getTime()) / 1000;
					var past_sec = Math.floor(past_hours % 60); past_hours /= 60;
					var past_minutes = Math.floor(past_hours % 60); past_hours /= 60;
					past_hours = Math.floor(past_hours);

					detail_status = 'Working - ';
					badge_color = '#007cff';

					if (10 <= past_hours) {
						badge_text = past_hours + 'h';
						detail_status += past_hours + ' h ' + past_minutes + ' min';
					} else if (1 <= past_hours) {
						badge_text = (past_hours * 60) + past_minutes + 'm';
						detail_status += past_hours + ' h ' + past_minutes + ' min';
					} else {
						badge_text = past_minutes + 'm';
						detail_status += (past_hours * 60) + past_minutes + ' min';
					}

					detail_status += ' from ' +
						('0' + start_date.getHours()).slice(-2) + ':' + ('0' + start_date.getMinutes()).slice(-2);

				}

				// Update the title of badge
				chrome.browserAction.setTitle({
					title: 'Jobcan Quick Stamp\n' + detail_status
				});

				// Update the badge of Chrome's toolbar
				chrome.browserAction.setBadgeText({
					text: badge_text
				});

				chrome.browserAction.setBadgeBackgroundColor({
					color: badge_color
				});

			});

		});

	};


	// ----

	// Update the badge status
	updateBadgeStatus();
	window.setInterval(updateBadgeStatus, INTERVAL_MSEC_UPDATE_STATUS);

	// Set a listener for communicate with popup.js and options.js
	chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

		if (request.evt == null) return;

		if (request.evt == 'ON_OPTIONS_UPDATED' || request.evt == 'ON_STAMPED') {

			// Update the badge status immediately
			updateBadgeStatus();

			// Done
			sendResponse({evt: request.evt, result: 'OKAY'});

		}

	});



})();
