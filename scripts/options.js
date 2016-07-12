/**
 * Script for pages/options.html
 */

'use strict';

// Declaration for allow the global objects in ESLint
/*global chrome*/


$(function() {


	/**
	 * Initialize and Load the current option values
	 * @return {[type]} [description]
	 */
	var init = function () {

		chrome.storage.sync.get(function(options) {

			// JobCan Code
			var code = options.jobcanCode || '';
			$('#jobcanCode').val(code);

			// Stored locations
			var stored_locations = options.storedLocations;
			$('#storedLocations').empty();
			stored_locations.forEach(function (loc) {

				var $loc = $('<li/>');

				var $span = $('<span/>');
				$span.text('GroupID: ' + loc.groupId + ' - ' + loc.lat + ', ' + loc.lng);
				$loc.append($span);

				var $delete_btn = $('<a/>');
				$delete_btn.prop('href', 'javascript:void(0)');
				$delete_btn.css('marginLeft', '1rem');
				$delete_btn.text('削除');
				(function ($loc, loc) {
					$delete_btn.click(function () {
						deleteStoredLocation(loc.groupId, loc.lat, loc.lng);
						$loc.fadeOut('500', function () {
							$loc.remove();
						});
					});
				})($loc, loc);
				$loc.append($delete_btn);

				$('#storedLocations').append($loc);

			});

		});

	};


	/**
	 * Delete the stored location
	 */
	var deleteStoredLocation = function (group_id, lat, lng) {

		// Store this group with this location
		chrome.storage.sync.get('storedLocations', function (saved_value) {

			var stored_locations = [];
			if (saved_value != null && saved_value.storedLocations != null) {
				stored_locations = saved_value.storedLocations;
			}

			var delete_index = -1;
			stored_locations.forEach(function (loc, index) {
				if (delete_index == -1 && loc.groupId == group_id && loc.lat == lat && loc.lng == lng) {
					delete_index = index;
				}
			});

			if (delete_index != -1) {
				stored_locations.splice(delete_index, 1);
			}

			chrome.storage.sync.set({
				storedLocations: stored_locations
			}, function() {
				return;
			});

		});

	};


	/**
	 * Save the option fields
	 */
	var saveOptions = function () {

		var $result = $('#result');
		$result.html('');
		$result.removeClass('success');
		$result.removeClass('error');

		var jobcan_code = $('#jobcanCode').val();
		if (jobcan_code == null || jobcan_code.length <= 0) {
			$result.addClass('error');
			$result.html('JobCan code is empty!');
			return;
		}

		chrome.storage.sync.set({
			jobcanCode: jobcan_code
		}, function() {
			$result.addClass('success');
			$result.html('Saved :)');
		});

	};


	// ----

	// Initialize
	init();

	// Set a event handler
	$('#optionsForm').submit(function () {
		saveOptions();
		return false;
	});

});
