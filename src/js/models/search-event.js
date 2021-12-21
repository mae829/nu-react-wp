export default class SearchEvent {

	constructor(props) {

		if (props.hasOwnProperty('done')) {
			this.done = props.done;
		} else {
			this.done = true;
		}

		if (props.hasOwnProperty('event')) {
			this.event = props.event;
		} else {
			this.event = 'page.submit';
		}

		if (props.hasOwnProperty('keyword')) {
			this.keyword = props.keyword;
		} else {
			this.keyword = '';
		}

		if (props.hasOwnProperty('name')) {
			this.name = props.name;
		} else {
			this.name = '';
		}

		if (props.hasOwnProperty('resultCount')) {
			this.resultCount = props.resultCount;
		} else {
			this.resultCount = 0;
		}

		if (props.hasOwnProperty('resultError')) {
			this.resultError = props.resultError;
		} else {
			this.resultError = null;
		}

		if (props.hasOwnProperty('resultMessage')) {
			this.resultMessage = props.resultMessage;
		} else {
			this.resultMessage = '';
		}

		if (props.hasOwnProperty('type')) {
			this.type = props.type;
		} else {
			this.type = 'search';
		}

		if (props.hasOwnProperty('version')) {
			this.version = props.version;
		} else {
			this.version = '12';
		}
	}
}
