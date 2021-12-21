import { combineReducers } from 'redux'

function programs(state = { programs: [], totalPrograms: 0, filters: [], searchTerm: '', sort: { id: 0, key: '', value: '', label: '' }, status: 'initialized' }, action) {
	let filters = []

	switch (action.type) {

		case 'GET_PROGRAMS':
			/**
			 * NOTE:
			 *
			 * We are manually setting the pushState value here instead of
			 * using React Router. This was done purposefully because
			 * the default React routing would conflict with WordPress so
			 * we've done a little manual intervention to make it appear
			 * smooth.
			 *
			 * - Alex Delgado
			 */
			if (state.status !== 'initialized') {
				const url = new URL(action.payload)

				history.pushState({ id: Date.now() }, '', window.location.pathname + url.search)
			}

			return Object.assign({}, state, {
				status: 'loading'
			})

		case 'GOT_PROGRAMS':
			return Object.assign({}, state, {
				status: 'loaded',
				programs: action.payload.results,
				totalPrograms: action.payload.totalPrograms,
				lastUpdated: action.receivedAt
			})

		case 'ADD_PROGRAMS_FILTER':
			return Object.assign({}, state, {
				filters: [
					...state.filters,
					action.payload
				]
			})

		case 'REMOVE_PROGRAMS_FILTER':
			filters = state.filters.filter((filter) => ! (filter.key == action.payload.key && filter.value == action.payload.value))
			return { ...state, filters: filters }

		case 'SET_PROGRAMS_FILTERS':
			return Object.assign({}, state, {
				filters: action.payload
			})

		case 'CLEAR_PROGRAM_FILTERS':
			document.querySelector( '.filter__options input' ).focus();

			return Object.assign({}, state, {
				filters: []
			})

		case 'SET_PROGRAMS_HEADER':
			return Object.assign({}, state, {
				searchTerm: action.payload.searchTerm,
				sort: action.payload.sort
			})

		case 'SEARCH_PROGRAMS':
			return Object.assign({}, state, {
				searchTerm: action.payload
			})

		case 'SORT_PROGRAMS':
			return Object.assign({}, state, {
				sort: action.payload
			})

		default:
			return state
	}
}

function programFilters(state = { filters: [], status: 'initialized' }, action) {

	switch (action.type) {

		case 'GET_PROGRAM_FILTERS':
			return Object.assign({}, state, {
				status: 'loading'
			})

		case 'GOT_PROGRAM_FILTERS':
			return Object.assign({}, state, {
				status: 'loaded',
				filters: action.payload,
				lastUpdated: action.receivedAt
			})

		default:
			return state
	}
}

function locations(state = { locations: [], filters: { search: '', region: '', location: '' }, results: [], selected: {}, status: 'initialized' }, action) {

	let url = []
	let results = []
	let filters = state.filters

	/**
	 * NOTE:
	 *
	 * We are manually setting the pushState value here instead of
	 * using React Router. This was done purposefully because
	 * the default React routing would conflict with WordPress so
	 * we've done a little manual intervention to make it appear
	 * smooth.
	 *
	 * - Alex Delgado
	 */
	let filterLocations = (locations, locationId) => {
		locations = (locations || state.locations)
		locationId = (locationId || false)

		// if a region isset filter by that first
		if (filters.region !== '') {

			locations = locations.filter((location) => {
				return location.region.filter((region) => {
					return region.slug !== filters.region
				}).length == 0
			})

			url.push(`region=${filters.region}`)
		}

		// run text search on location title and address
		if (filters.search !== '') {

			locations = locations.filter((location) => {
				return (
					location.title.toLowerCase().search(filters.search) !== -1 ||
					location.address.complete.toLowerCase().search(filters.search) !== -1
				)
			})

			url.push(`search=${filters.search}`)
		}

		if (filters.location !== '' && locationId) {
			url.push(`location_id=${filters.location}`)
		}

		// @TODO: re-enable and debug
		// only call pushState once the page has fully loaded
		// if (state.status === 'loaded') {
		// 	let pathname = window.location.pathname + (url.length > 0 ? `?${url.join('&')}` : '')

		// 	history.pushState({ id: Date.now() }, '', pathname)
		// }

		return locations
	}

	switch (action.type) {

		case 'GET_LOCATIONS':
			return Object.assign({}, state, {
				status: 'loading'
			})

		case 'GOT_LOCATIONS':
			return Object.assign({}, state, {
				status: 'loaded',
				locations: action.payload,
				results: filterLocations(action.payload),
				lastUpdated: action.receivedAt
			})

		case 'SET_LOCATION_FILTERS':

			let selected = state.selected

			if (action.payload.hasOwnProperty('search')) {
				filters.search = action.payload.search
			}

			if (action.payload.hasOwnProperty('region')) {
				filters.region = action.payload.region
			}

			if (action.payload.hasOwnProperty('location')) {
				filters.location = action.payload.location

				selected = state.locations.find((location) => {
					return location.id === parseInt(filters.location)
				})
			}

			results = filterLocations(null, true)

			return Object.assign({}, state, {
				filters,
				results,
				selected
			})

		case 'CLEAR_LOCATION_FILTERS':
			document.querySelector( '.regions__menu-toggle' ).focus();

			return Object.assign({}, state, {
				filters: { search: '', region: '', location: '' },
				results: state.locations
			})

		case 'FILTER_BY_SEARCH':
			filters.search = action.payload
			results = filterLocations()

			return Object.assign({}, state, {
				filters,
				results
			})

		case 'FILTER_BY_REGION':
			filters.region = action.payload.slug
			results = filterLocations()

			return Object.assign({}, state, {
				filters,
				results
			})

		case 'SELECT_LOCATION':

			// @TODO: re-enable and debug

			// if (filters.region !== '') {
			// 	url.push(`region=${filters.region}`)
			// }

			// if (filters.search !== '') {
			// 	url.push(`search=${filters.search}`)
			// }

			// url.push(`location_id=${action.payload.id}`)

			// only call pushState once the page has fully loaded
			// if (state.status === 'loaded') {
			// 	let pathname = `${window.location.pathname}?${url.join('&')}`

			// 	history.pushState({ id: Date.now() }, '', pathname)
			// }

			return Object.assign({}, state, {
				selected: action.payload
			})

		default:
			return state
	}
}

function regions(state = { regions: [], selected: { id: 0, slug: '', name: 'All Regions' }, status: 'initialized' }, action) {

	switch (action.type) {

		case 'GET_REGIONS':
			return Object.assign({}, state, {
				status: 'loading'
			})

		case 'GOT_REGIONS':
			let newState = {
				status: 'loaded',
				regions: action.payload,
				lastUpdated: action.receivedAt
			}

			for (let i = 0; i < action.payload.length; i++) {
				if (action.payload[i].active) {
					newState.selected = action.payload[i]
				}
			}

			return Object.assign({}, state, newState)

		case 'SET_SELECTED_REGION':
			return Object.assign({}, state, {
				selected: action.payload
			})

		case 'CLEAR_LOCATION_FILTERS':
			return Object.assign({}, state, {
				selected: { id: 0, slug: '', name: 'All Regions' }
			})

		default:
			return state
	}
}

function search(state = { term: '', results: [], totalResults: 0, loading: false }, action) {

	switch (action.type) {

		case 'GET_SEARCH_RESULTS':
			return Object.assign({}, state, {
				loading: true,
				term: action.payload
			})

		case 'GOT_SEARCH_RESULTS':
			return Object.assign({}, state, {
				loading: false,
				results: action.payload.results,
				totalResults: action.payload.totalResults,
				lastUpdated: action.receivedAt
			})

		default:
			return state
	}
}

const reducers = combineReducers({
	programs,
	programFilters,
	locations,
	regions,
	search
})
export default reducers
