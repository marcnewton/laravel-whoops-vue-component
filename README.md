## About Vue Whoops Debug Component

A Vue 2 ajax debug component for Laravel 5.5+, pretty print Whoops style handler for ajax error responses in Laravel, auto handle error exceptions and user die dump responses from ajax requests in a pretty print style display.

Features live debug mode, iterate quickly through the debugging process of and ajax error untill the issue is resolved, automatic retries of your ajax request with the posted data, on an eventual success response the debug screen will auto close and your optional callback function will be called.

[![Video Demo](https://img.youtube.com/vi/n0U5a4S3crQ/0.jpg)](https://youtu.be/n0U5a4S3crQ "Video Demo")

## Installation

	npm install laravel-vue-whoops

### Import SCSS

```scss
@import "~laravel-vue-whoops/sass/whoops";
```

### Adding Whoops VUE Component

Add Whoops Vue component to your applications js file after Vue is declared.

```javascript
require('laravel-vue-whoops');
```

Example app.js:

```javascript
window.Vue = require('vue');

require('laravel-vue-whoops');

new Vue({
	el: '#app',
	components: {
		'myComponent': require('./components/myComponent.vue'),
	},
	data: function() {
		return {}
	}
});

```

## How to use

The **Whoops.handle** method takes two parameters.

#### Error
The error handle object parameter.

#### Callback
An optional custom error callback handler fallback.
If the error response is not an exception or dump then your callback should be your custom client facing UX handler, typically this would be your custom handler for laravel validation UX responses or if APP DEBUG is disabled the custom callback would would called.

```javascript
axios.patch(url,data).then(response => {

		// your public success handler here

	}).catch(error => {

		Whoops.handle(error, function() {

		// your public fail handler here
		alert('Hello Guest, Sorry but the server encountered an Internal Server Error during the processing your request!');

	});

});
```
