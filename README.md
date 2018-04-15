## About Vue Whoops Debug Component

Vue 2 ajax debug component for Laravel 5.5+, pretty print Whoops style handler for ajax error responses in Laravel, auto handles error exceptions and Die Dump responses from ajax requests in a reactive display.

Features live debug mode for quick iteration through errors and dumps.

On demand or automatic retries of your last ajax request with the previous posted data.

Optional on success callback to resume any normal application function when request is free of errors or dump responses.

[![Video Demo](https://img.youtube.com/vi/n0U5a4S3crQ/0.jpg)](https://youtu.be/n0U5a4S3crQ "Video Demo")

## Installation

	npm install laravel-vue-whoops

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

## Issue Tracking

https://github.com/marcnewton/laravel-whoops-vue-component/issues

