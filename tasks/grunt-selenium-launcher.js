/* global process, module */
var spawn = require('child_process').spawn,
	EventEmitter = require('events').EventEmitter,
	util = require('util');

module.exports = function(grunt) {
	var selenium = null;

	var End = function() {
		if (selenium && selenium.kill) {
			selenium.kill();
		}
	};

	// NO FULLY AUTOMATED TESTS FOR THIS
	// There is a semi-auto test via `grunt testExit`, but requires user confirmation.
	process.on('exit', End);

	grunt.registerTask('selenium-launch', 'Start a selenium remote.', function() {
		var done = this.async();
		var options = this.options();

		var cb = function(err, sel) {
			if (err) {
				// semi-auto test via `grunt testInduceFailure`
				grunt.log.error('There was a problem launching selenium.');
				grunt.log.debug(err);
				done(false);
			} else {
				selenium = sel;
				process.env.SELENIUM_LAUNCHER_PORT = selenium.port;
				process.env.SELENIUM_HUB = 'http://localhost:' + process.env.SELENIUM_LAUNCHER_PORT + '/wd/hub';
				done();
			}
		};

		function run(cb) {
			console.log('Starting Selenium on port ' + options.port);
			var child = spawn('java', [
				'-jar', options.jarDir + options.jar,
				'-port', options.port
			]);
			child.host = '127.0.0.1';
			child.port = options.port;
			var badExit = function() {
				cb(new Error('Could not start Selenium.'));
			};
			child.stdout.on('data', function(data) {
				var sentinal = 'Started org.openqa.jetty.jetty.Server';
				if (data.toString().indexOf(sentinal) != -1) {
					child.removeListener('exit', badExit);
					cb(null, child);
				}
			});
			child.on('exit', badExit);
		}

		function FakeProcess(port) {
			EventEmitter.call(this);
			this.host = '127.0.0.1';
			this.port = port;
		}
		util.inherits(FakeProcess, EventEmitter);
		FakeProcess.prototype.kill = function() {
			this.emit('exit');
		};

		if (process.env.SELENIUM_LAUNCHER_PORT) {
			return process.nextTick(
				cb.bind(null, null, new FakeProcess(process.env.SELENIUM_LAUNCHER_PORT)));
		}
		run(cb);
	});
};