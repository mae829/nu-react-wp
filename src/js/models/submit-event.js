export default class SubmitEvent {

	static send(e) {
		(window.dataLayer = window.dataLayer || []).push({
			'event' : e.event,
			'page.submit' : {
				'v'    : e.version,
				'name' : e.name,
				'data' : {
					'keyword' : e.keyword
				},
				'type' : e.type,
				'done' : e.done,
				'result' : {
					'count'   : e.resultCount,
					'error'   : e.resultError,
					'message' : e.resultMessage
				}
			}
		})
	}
}
