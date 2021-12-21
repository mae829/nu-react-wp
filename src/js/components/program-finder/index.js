import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import store from '../../store'

import SearchForm from './searchForm'
import SearchResults from './searchResults'

export default class ProgramFinderController {

	constructor() {
		this.searchForm()
		this.searchResults()
	}

	searchForm() {
		const $searchFormContainer = document.querySelector('.js-program-finder-filters')
		let displayFilters = ''

		if ( $searchFormContainer.dataset.filtersdisplay ) {
			displayFilters = $searchFormContainer.dataset.filtersdisplay.split(' ').join('').split(',');
		}

		if ( $searchFormContainer ) {
			const endpointUrl = nu_react_wp_program_finder.filters

			ReactDOM.render(
				<Provider store={store}>
					<SearchForm endpointUrl={endpointUrl} queryString={window.location.search} displayFilters={displayFilters}/>
				</Provider>,
				$searchFormContainer
			)
		}
	}

	searchResults() {
		const $searchResults = document.querySelector('.js-program-finder-programs')

		if ( $searchResults ) {
			let preFilters = {}
			let newQueryString = ''
			const endpointUrl = nu_react_wp_program_finder.programs
			let queryParams = nu_react_wp_program_finder.query_params

			if ($searchResults.dataset.prefilters){
				preFilters = this.preFilteringSearchForm( JSON.parse($searchResults.dataset.prefilters) )
			}

			if ( Object.keys( preFilters ).length !== 0 ) {
				queryParams.filters = [ ...preFilters.filters ]
				newQueryString = preFilters.queryString
			}

			if ( $searchResults.dataset.presort ) {
				let presortValue = $searchResults.dataset.presort;
				newQueryString += ( newQueryString.length ? '&' : '?' ) + `sort[${presortValue}]=${presortValue}`

				if ( '' === queryParams.sort.key ) {
					queryParams.sort = {
						key: presortValue,
						value: presortValue
					}
				}
			}

			ReactDOM.render(
				<Provider store={store}>
					<SearchResults endpointUrl={endpointUrl} queryParams={queryParams} queryString={ newQueryString.length ? newQueryString : window.location.search } />
				</Provider>,
				$searchResults
			)
		}
	}

	preFilteringSearchForm( preFilters ) {
		try {
			let newPreFilters = {
				filters: [],
				queryStringArray: []
			};

			for ( let key in preFilters ){
				preFilters[ key ].forEach( element => {
					newPreFilters.filters.push({
						key: key,
						value: element
					})
				})

				newPreFilters.queryStringArray.push( `filter[${key}]=` + preFilters[key].join( ',' ) );
			}

			newPreFilters.queryString = '?' + newPreFilters.queryStringArray.join( '&' )

			delete newPreFilters.queryStringArray

			return newPreFilters

		} catch ( error ) {
			console.log( error );
		}
	}
}
