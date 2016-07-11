/**
 * Script for pages/popup.html
 */

'use strict';

// Declaration for allow the global objects in ESLint
/*global chrome*/


$(function() {


	/**
	 * Load the option values
	 */
	var loadOptions = function () {

		chrome.storage.sync.get(function(options) {

			var code = options.jobcanCode || null;
			if (code == null) {
				$('#notice').html('<a href="options.html" target="_blank">オプションページ</a>で設定を完了して下さい');
				$('#notice').show();
				$('#jobcanFrame').hide();
				return;
			}

			$('#notice').hide();
			$('#jobcanFrame').show();
			$('#jobcanFrame').attr('src', 'https://ssl.jobcan.jp/m/work/accessrecord?_m=adit&code=' + code);


		});

	};


	// ----

	// Load the option values
	loadOptions();

});
