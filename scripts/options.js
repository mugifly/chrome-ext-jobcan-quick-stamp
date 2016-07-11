/**
 * Script for pages/options.html
 */

'use strict';

// Declaration for allow the global objects in ESLint
/*global chrome*/


$(function() {


	/**
	 * Load the current option values
	 * @return {[type]} [description]
	 */
	var loadOptions = function () {

		chrome.storage.sync.get(function(items) {

			var code = items.jobcanCode || '';
			$('#jobcanCode').val(code);

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

	// Load the current values
	loadOptions();

	// Set a event handler
	$('#optionsForm').submit(function () {
		saveOptions();
		return false;
	});

});
