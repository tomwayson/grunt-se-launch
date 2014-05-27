# grunt-se-launch

A Grunt task to launch a selenium server.

## Usage
Set up configuration options:

```javascript
grunt.initConfig({
	'selenium-launch': {
    options: {
      port: 4445,
      jarDir: 'C:/Selenium/',
      jar: 'selenium-server-standalone-2.41.0.jar'
    }
  }
})
```

Load the task:

```javascript
grunt.loadNpmTasks('grunt-se-launch');
```

Call the task:

```javascript
grunt.registerTask('test', [ 'selenium-launch', 'intern'])
```

Use the settings exported to the environment to connect to the correct instance:

```javascript
var driver = new require("selenium-webdriver").Builder()
	.usingServer(process.env.SELENIUM_HUB)
	.withCapabilities(webdriver.Capabilities.firefox())
	.build()
```

## API

### Grunt Task

**selenium-launch**
Attempt to launch a selenium instance, binding to `process.env.SELENIUM_LAUNCHER_PORT`. The task completes when the server is running and bound. The server is automatically killed when the grunt process exits - no need to take extreme steps to ensure the process isn't left a zombie.

### Environment Variables

**process.env.SELENIUM_LAUNCHER_PORT**
If set when running grunt, defines the preferred port to run Selenium on. After the task has run, has the value of the port selenium bound on.

**process.env.SELENIUM_HUB**
After the task has run, has the string URI for webdriver hub connection. Use this string when connecting clients to selenium.
