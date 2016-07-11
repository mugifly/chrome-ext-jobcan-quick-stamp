/**
 * Background script
 */

'use strict';

// Declaration for allow the global objects in ESLint
/*global chrome, StampStatusChecker*/


$(function () {

	var statusChecker = null;


	/**
	 * Update the current status for badge of Chrome's toolbar
	 */
	var updateStatus = function () {

		// Get the options
		chrome.storage.sync.get(function(options) {

			if (options.jobcanCode == null) {
				return;
			}

			// Initialize the checker
			var status_checker = new StampStatusChecker(options.jobcanCode);

			// Get the current working status
			status_checker.getCurrentWorkingStartedDate(function (err, start_date) {

				if (err) {

					chrome.browserAction.setTitle({
						title: 'jobcan-quick-stamp\n[Error] Could not get the status.'
					});

					chrome.browserAction.setBadgeText({
						text: 'ERR'
					});

					chrome.browserAction.setBadgeBackgroundColor({
						color: '#ff0000'
					});

					return;
				}

				console.log('updateStatus', start_date);

				var badge_color = '#888888', badge_text = 'FREE';
				if (start_date != null) {
					var now = new Date();
					var past_hours = (now.getTime() - start_date.getTime()) / 1000;
					var past_sec = Math.floor(past_hours % 60); past_hours /= 60;
					var past_minutes = Math.floor(past_hours % 60); past_hours /= 60;
					past_hours = Math.floor(past_hours);

					if (10 <= past_hours) {
						badge_text = past_hours + 'h';
					} else if (1 <= past_hours) {
						badge_text = (past_hours * 60) + past_minutes + 'm';
					} else {
						badge_text = past_minutes + 'm';
					}
					badge_color = '#007cff';
				}

				// Update the title of badge
				chrome.browserAction.setTitle({
					title: 'jobcan-quick-stamp\nStatus: ' + badge_text
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

	updateStatus();
	window.setInterval(updateStatus, 6000);

});
