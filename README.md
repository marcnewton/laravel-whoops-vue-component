## About Vue Whoops Debug Component

A Vue 2 ajax debug component for Laravel 5.5+, pretty print Whoops style handler for ajax error responses in Laravel, auto handle error exceptions and user die dump responses from ajax requests in a pretty print style display.

Features live debug mode, iterate quickly through the debugging process of and ajax error untill the issue is resolved, automatic retries of your ajax request with the posted data, on an eventual success response the debug screen will auto close and your optional callback function will be called.

## Installation

### Apps Layout blade

Asuming that your project has retained the use of the original **layouts/app.blade.php** layout template, Add the following inside of the APP div tag as follows:

```php
	<div id="app">
		@if(env('APP_DEBUG'))
			<Whoops ref="Whoops"></Whoops>
		@endif
	</div>
```

### Import SCSS

```scss
	@import "app/whoops";
```


### Adding Whoops VUE Componenet

```javascript
	var app = new Vue({
		el: '#app',
		components: {
			'Whoops': require('./components/whoops/errors.vue')
		}
	});
```

## How to use

The **Whoops.handle** method takes two pramaters.

	**error**
		The error handle object

	**callback**
		An optional callback handler fallback.
		If the error response is not an exception or dump then your callback should be your custom client facing UX handler, typically this would be your custom handler for laravel validation UX responses

```javascript
	axios.patch(url,data).then(response => {

			// your success action here

		}).catch(error => {

		instance.$refs.Whoops.handle(error, function() {

			// your public facing fail action here
			alert('Hello Guest, Sorry but the server encountered an Internal Server Error during the processing your request!');

		});

	});
```
