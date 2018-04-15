<template>
	<div>
		<div class="whoops-header">
			<div class="tools">
				<span v-html="status" class="status"></span>
				<button v-on:click="retry()" class="retry" :disabled="dump.enabled">Retry</button>
				<button v-on:click="close()" class="exit">Exit</button>
			</div>
			<div class="exception" v-if="whoops.data.exception" v-html="exceptionClass(whoops.data.exception)"></div>
			<div class="message" v-if="whoops.data.message" v-html="'<pre>' + whoops.data.message + '</pre>'"></div>
			<div class="info" v-if="whoops.data.file" v-html="whoops.data.file + ':' + whoops.data.line"></div>
			<div class="exception url" v-if="whoops.config.url" v-html="url(whoops.config.url)"></div>
			<div class="info" v-if="whoops.status" v-html="whoops.status + ' ' + whoops.statusText"></div>
		</div>

		<div class="whoops-panel">

			<div class="whoops-navigate">

				<div v-if="whoops.data.exception" v-on:click="active = 'traces'" v-bind:class="{ active: active === 'traces' }">
					<div class="title">Stacktrace Details</div>
					<div class="summary" v-if="whoops.data.trace[0]" v-html="whoops.data.trace[0].file + ':' + whoops.data.trace[0].line"></div>
				</div>

				<div v-if="whoops.data.exception" v-on:click="active = 'headers'" v-bind:class="{ active: active === 'headers' }">
					<div class="title">Payload &amp; Response Headers</div>
					<div class="summary" v-if="whoops.config.url" v-html="whoops.config.url"></div>
				</div>

				<div v-if="dump.response" v-on:click="active = 'debug'" v-bind:class="{ active: active === 'debug' }">
					<div class="title">Debug Dump</div>
					<div class="summary" v-html="dump.status"></div>
				</div>

			</div>

			<div class="whoops-displays">

				<div class="whoops-debug-options">
					<span class="calls" v-html="calls"></span>
					<span class="status" v-html="dump.status"></span>
					&nbsp; | &nbsp;
					<label for="whoops-tick-rate">Tick Rate</label>
					<input id="whoops-tick-rate" v-model="dump.tick" type="number" value="10" min="5" max="120" step="1" :disabled="dump.enabled" />
					<button v-if="dump.enabled" v-on:click="debug(false)" class="debug-pause">Pause Debug</button>
					<button v-if="!dump.enabled" v-on:click="debug(true)" class="debug-start">Start Debug</button>
				</div>

				<div v-bind:class="{ active: active === 'traces' }" class="whoops-response-stacktrace">
					<h2>Stacktrace Details</h2>
					<div v-for="(row,index) in whoops.data.trace">
						<div class="method">
							<span class="class" v-if="row.class" v-html="exceptionClass(row.class)"></span>
							<span class="type" v-if="row.type" v-html="' ' + row.type  + ' '"></span>
							<span class="function" v-if="row.function" v-html="row.function"></span>
						</div>
						<div class="file" v-if="row.file" v-html="row.file + ':' + row.line"></div>
					</div>
				</div>

				<div v-bind:class="{ active: active === 'headers' }" class="whoops-response-headers">

					<h2>Response Headers</h2>
					<div class="table">
						<div v-for="(value,key) in whoops.headers">
							<div v-html="key"></div>
							<div v-html="value"></div>
						</div>
					</div>

					<h2>Payload Config</h2>
					<div class="table table-top">
						<div v-for="(value,key) in whoops.config">
							<div v-html="key"></div>
							<div><pre v-html="(key === 'data' ? JSON.parse(value) : value)"></pre></div>
						</div>
					</div>

				</div>

				<div v-bind:class="{ active: active === 'debug' }" v-html="dump.response" class="whoops-dump-response"></div>

			</div>

		</div>

	</div>
</template>
<script>
	export default {

		data: function() {

			return {
				whoops: {

					config: {},

					data: {
						exception: null,
						file:null,
						line:0,
						message: '',
						trace: []
					},

					headers: {}

				},

				dump: {
					status: '',
					enabled: false,
					tick: 7,
					response: null,
					interval: null
				},

				status: '',
				active: 'traces',
				calls: 1,
				callback: {}
			};
		},

		mounted() {
			this.debug(false);
		},

		methods: {

			reset() {

				this.debug(false);

				this.whoops = {

					config: {},

					data: {
						exception: null,
							file:null,
							line:0,
							message: '',
							trace: []
					},

					headers: {}

				};

				this.status = '';
				this.calls = 1;

			},

			handle(error,callback) {

				this.reset();
				this.callback = callback;
				this.responded(error);

			},

			responded(error) {

				if(error.response.exception || (error.response.data && error.response.data.exception))
				{
					this.whoops = error.response;
					this.active = 'traces';
					this.status = 'Error Exception Detected!';

					document.body.className += ' whoops';

					return true;
				}

				if(error.response.status >= 500)
				{
					this.dump.response = error.response.data;
					this.active = 'debug';
					this.status = 'Debug Dump Detected!';

					this.whoops.config = error.response.config;

					let app = document.getElementById('app');
					document.body.className += ' whoops';

					return true;
				}

				this.close();
				this.callback();

				return false;
			},

			close() {

				document.body.className = app.className.replace(/ whoops/g,'');

				this.reset();
			},

			retry() {

				let instance = this;

				instance.debug(false);

				instance.status = 'Retrying request..';
				instance.calls++;

				axios[instance.whoops.config.method](instance.whoops.config.url, JSON.parse(instance.whoops.config.data)).then(response => {

					instance.responded(response);

				}).catch(error => {

					instance.responded(error);

				});
			},

			debug(toggle) {

				let instance = this;

				instance.dump.status = toggle ? 'Live debug is running' : 'Live debug is paused';
				instance.dump.enabled = toggle;

				if(toggle) {
					instance.dump.interval = setInterval(function() {
						instance.ping()
					},(1000 * instance.dump.tick));
					return;
				}

				if(instance.dump.interval) {
					clearInterval(instance.dump.interval);
				}
			},

			ping() {

				let instance = this;

				instance.dump.status = 'Retrying...';

				instance.calls++;

				axios[instance.whoops.config.method](instance.whoops.config.url, JSON.parse(instance.whoops.config.data)).then(response => {

					instance.callback(response);

				}).catch(error => {

					if(this.responded(error)) {
						instance.dump.status = 'Responded with exception error';
						return;
					}

					instance.dump.status = 'Debug Dump Found!';
					instance.dump.response = error;

				});

			},

			exceptionClass(input) {

				return '<span>' + input.split('\\').join('</span> \\ <span>') + '</span>';

			},

			url(input) {

				return '<span>' + input.split('/').join('</span> / <span>') + '</span>';

			}
		}
	}
</script>
