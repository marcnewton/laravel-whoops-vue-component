require('./app.scss');

(function () {

	window.onload = function() {

		let app, container, instance;

		if(document.getElementById('whoops-app') === null) {

			app = document.createElement('Whoops');
			app.setAttribute('ref','Whoops');

			container = document.createElement('div');
			container.setAttribute('id', 'whoops-app');
			container.appendChild(app);

			document.body.appendChild(container);

		}

		instance = new Vue({
			el: '#whoops-app',
			components: {
				'Whoops': require('./components/errors.vue'),
			},
			history: false
		});

		window.Whoops = instance.$refs.Whoops;
	}

})();