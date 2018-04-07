## About Ajax Whoops Debug

Ajax debug for Laravel 5.5+ is a VUE Componenet pretty print Whoops handler for ajax error responses, auto handle information form error exceptions and user die dump responses to ajax requests.

Features live debug mode, iterate quickly through the debugging process of and ajax error untill the issue is resolved, automatic retries of your ajax request with the posted data, on an eventual success response the debug screen will auto close and your optional callback function will be called.

## Installation

### Apps Layout blade

Asuming that your project has retained the use of the original layouts/app.blade.php layout file, You should add the following inside of the APP div tag as follows:

```php
	@if(env('APP_DEBUG'))
		<Whoops ref="Whoops"></Whoops>
	@endif
```

### Import SCSS


### Add VUE Componenet


## How to use
