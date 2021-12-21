import React from 'react'
import { connect } from 'react-redux'

import { setProgramsFilters, getPrograms, gotPrograms } from '../../actions'

import store from '../../store'

import SearchResultsHeader from './searchResultsHeader'
import SearchResultGroups from './searchResultGroups'

import SearchEvent from '../../models/search-event'
import SubmitEvent from '../../models/submit-event'

const mapDispatchToProps = dispatch => {
	return {
		setProgramsFilters: (filters) => dispatch(setProgramsFilters(filters)),
		getPrograms: (url) => dispatch(getPrograms(url)),
		gotPrograms: (url, programs) => dispatch(gotPrograms(url, programs))
	}
}

class ConnectedSearchResults extends React.Component {

	constructor(props) {
		super(props)

		this.state = {
			searchUrl: this.props.queryString,
			loaded: false,
			error: null
		}

		this.fetchResults = this.fetchResults.bind(this)

		store.subscribe(() => this.onSubscribe())
	}

	componentDidMount() {

		// push query parameters into "programs" state
		this.props.setProgramsFilters(this.props.queryParams.filters)

		// fetch the requested programs from the API
		this.fetchResults(this.props.endpointUrl + this.props.queryString)
	}

	fetchResults(url) {
		var searchTerm = (store.getState().programs && store.getState().programs.searchTerm || '')

		this.props.getPrograms(url)

		fetch(url)
		.then((response) => {
			if (response.ok) {
				return response.json()
			} else {
				throw new Error('An unknown error occurred while fetching the requested data.')
			}
		})
		.then((response) => {
			this.props.gotPrograms(url, response[0])

			if (searchTerm) {
				SubmitEvent.send(new SearchEvent({
					keyword: searchTerm,
					name: 'Program Finder Search',
					resultCount: response[0].totalPrograms,
					resultMessage: `${ response[0].totalPrograms } Programs Found`
				}))
			}
		})
		.catch((error) => {
			this.setState({ error })

			if (searchTerm) {
				SubmitEvent.send(new SearchEvent({
					done: false,
					keyword: searchTerm,
					name: 'Program Finder Search',
					resultError: '1',
					resultMessage: error.message
				}))
			}
		})
	}

	onSubscribe() {
		const savedState = store.getState()

		// don't run when filters or programs are loading
		if (savedState.programFilters.status !== 'loaded' || savedState.programs.status !== 'loaded') {
			return
		}

		if (this.state.loaded === false) {
			this.setState({ loaded: true })
			return
		}

		const url = this.generateSearchUrl(savedState.programs)

		// prevent duplicate API calls for same request
		if (url !== this.state.searchUrl) {

			this.setState({ searchUrl: url })

			this.fetchResults(this.props.endpointUrl + url)
		}
	}

	generateSearchUrl(state) {

		let url = ''
		let params = []

		if (state.filters.length > 0) {
			let filters = []

			for (let i = 0; i < state.filters.length; i++) {
				let el = state.filters[i]

				if (filters.hasOwnProperty(el.key)) {
					filters[el.key].push(el.value)
				} else {
					filters[el.key] = [el.value]
				}
			}

			for (let x in filters) {
				params.push(`filter[${x}]=${filters[x].join(',')}`)
			}
		}

		if (state.searchTerm !== '') {
			params.push(`filter[search]=${state.searchTerm}`)
		}

		if (state.sort.key !== '') {
			params.push(`sort[${state.sort.key}]=${state.sort.value}`)
		}

		if (params.length > 0) {
			url = `?${params.join('&')}`
		}

		return url
	}

	render() {

		if (this.state.error) {
			return <p>{this.state.error.message}</p>
		}

		return (
			<div>
				<SearchResultsHeader queryParams={this.props.queryParams} />
				<SearchResultGroups />
			</div>
		)
	}
}

const SearchResults = connect(null, mapDispatchToProps)(ConnectedSearchResults)
export default SearchResults
