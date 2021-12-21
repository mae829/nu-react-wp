import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import store from '../../store'

import DynamicSearch from './dynamic-search'

export default class DynamicSearchController {

	constructor() {
		this.renderSearch()
	}

	renderSearch() {
		const $searchContainer = document.getElementById('js-dynamic-search')

		if($searchContainer !== null) {
			ReactDOM.render(
				<Provider store={store}>
					<DynamicSearch />
				</Provider>,
				$searchContainer
			)
		}
	}
}
