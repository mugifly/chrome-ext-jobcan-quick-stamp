'use strict';

var StampStatusChecker = function (jobcan_code) {

	this.url = 'https://ssl.jobcan.jp/m?code=' + jobcan_code;

};


StampStatusChecker.prototype.getCurrentWorkingStartedDate = function (callback) {

	var self = this;

	$.ajax({
		url: self.url,
		timeout: 5000,
		success: function (data, data_type) {

			var last_stamp_status = self._parseLastStampStatus(data);
			console.log('getCurrentWorkingStartedDate', last_stamp_status);
			if (last_stamp_status == null) {
				callback('Could not get your status');
			} else if (last_stamp_status.text == '入室') {
				callback(null, last_stamp_status.date);
			} else {
				callback(null, null);
			}

		},
		error: function (req, status, err) {

			callback(err, null);

		}
	});

};


StampStatusChecker.prototype._parseLastStampStatus = function(html) {

	var $page = $($.parseHTML(html, document, false));

	var $adits = $page.find('#adits tr');
	if ($adits.length <= 1) return null;

	var $item = $($adits[$adits.length - 2]);
	var $columns = $item.find('td');

	// Get a status text
	var status_text = $($columns[0]).text().replace(new RegExp('[\f\n\r\t\v ]', 'g'), '');

	// Get a date
	var start_date = null;
	var status_time_str = $($columns[1]).text().replace(new RegExp('[\f\n\r\t\v ]', 'g'), '');
	if (status_time_str.match(/(\d+):(\d+)/)) {
		start_date = new Date();
		var h = RegExp.$1, m = RegExp.$2;
		if (24 <= h) {
			start_date.setHours(h-24);
			start_date.setMinutes(m);
			start_date.setSeconds(0);
		} else {
			start_date.setHours(h);
			start_date.setMinutes(m);
			start_date.setSeconds(0);
		}
	}

	// Return
	return {
		text: status_text,
		date: start_date
	};

};
