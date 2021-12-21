import React, { Component } from 'react'
import { connect } from 'react-redux'
import { DebounceInput } from 'react-debounce-input'

import { getSearchResults, gotSearchResults } from '../../actions'
import store from '../../store'

import SearchEvent from '../../models/search-event'
import SubmitEvent from '../../models/submit-event'

const mapStateToProps = state => {
	return {
		loading: state.search.loading,
		results: state.search.results,
		totalResults: state.search.totalResults,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getSearchResults: (term) => dispatch(getSearchResults(term)),
		gotSearchResults: (url, results) => dispatch(gotSearchResults(url, results)),
	}
}

const sendAnalyticsView = function(url) {
	const blogurl = document.location.origin

	if (typeof ga != 'undefined' || typeof gtag != 'undefined') {

		// get the part of the URL that we need
		if (url.indexOf(blogurl) > -1) { url = url.replace(blogurl, '') }
		// Grab the last piece we need for the page view
		url = url.split('/').pop()
		// Make sure it has a slash a the beginning
		if (url.indexOf('/') != 0) { url = '/' + url }

		// if analytics is present then send a response to the appropriate tag
		// Going to try to send to gtag first because if gtag is loaded, the analytics file defines GA inside of it, throwing a sort of false positive.
		if (typeof ga !== 'undefined' && typeof gtag !== 'undefined') {
			// Get the analytics key(s) dynamically.
			var gaIDs    = []
			var trackers = ga.getAll()
			for (var tracker in trackers) {
				var gaID = trackers[ tracker ].get('trackingId')
				// For some reason the returned gaIDs can be repeated.
				if (-1 === gaIDs.indexOf(gaID)) {
					gaIDs.push(gaID)
				}
			}

			// Check if we found it in the chaos above and send a page view to each.
			if (gaIDs.length > 0) {
				gaIDs.forEach(function(gaID) {
					gtag('config', gaID, { 'page_path': url })
				})
			}

		} else if (typeof ga !== 'undefined') {
			ga('send', 'pageview', url)
		}
	}
}

export class ConnectedDynamicSearch extends Component {

	constructor(props) {

		super(props)

		this.state =
			this.initialState = {
				active: false,
				term: '',
				error: null
			}

		store.subscribe(() => this.onSubscribe())

		this.onChange = this.onChange.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
		this.onClearButton = this.onClearButton.bind(this)
	}

	onSubscribe() {
		const savedState = store.getState()

		if (savedState.search.results && savedState.search.results.length > 0) {
			this.setState({
				results: savedState.search.results,
				totalResults: savedState.search.totalResults
			})
		}
	}

	onChange() {
		if (this.state.term && this.state.term.length > 0) {
			this.queryAPI(this.state.term)
		}
	}

	onSubmit(e) {
		e.preventDefault()

		// If the results are already trying to display (onChange is running), do not try to run again (will run twice if this is not here)
		if (this.props.loading) { return }

		if (this.state.term && this.state.term.length > 0) {
			this.queryAPI(this.state.term)
		}
	}

	onClearButton() {

		this.setState(this.initialState)

		document.getElementById('js-dynamic-search-footer').classList.remove('d-none')
	}

	queryAPI(term) {
		const url = window.nu_react_wp_search.search.replace('%s', term)

		this.setState({ active: true })

		this.props.getSearchResults(term)

		fetch(url)
			.then((response) => {
				if (response.ok) {
					return response.json()
				} else {
					throw new Error('An unknown error occurred while fetching the requested data.')
				}
			})
			.then((data) => {
				this.props.gotSearchResults(url, data)

				sendAnalyticsView(url)

				SubmitEvent.send(new SearchEvent({
					keyword: term,
					name: 'Nav Site Search',
					resultCount: data.totalResults,
					resultMessage: `Showing ${ data.results.length } of ${ data.totalResults } results for '${ term }'`
				}))
			})
			.catch((error) => {
				this.setState({ error })

				SubmitEvent.send(new SearchEvent({
					done: false,
					keyword: term,
					name: 'Nav Site Search',
					resultError: '1',
					resultMessage: error.message
				}))
			})

		document.getElementById('js-dynamic-search-footer').classList.add('d-none')
	}

	render() {

		let clearButton = null
		let suggestions = null
		let searchResults = null
		let viewMore = null

		if (this.state.active) {

			// display clear input button
			clearButton = (
				<button
					type="reset"
					className="btn"
					onClick={this.onClearButton}><span className="sr-only">Clear search field and results.</span><span aria-hidden="true" className="icon icon--close-circle"></span>
				</button>
			)

			// default to "no results found" once the state is "active"
			searchResults = (<h3 className="search-overlay__heading">No results found for "{ this.state.term }".</h3>)

			// @TODO: add auto-suggest in a future release
			// suggestions = (
			// 	<div className="search-overlay__suggestions">
			// 		<ul className="search-suggestions list list--reset">
			// 			<li className="search-suggestions__result">
			// 				<div className="icon icon--circle"></div>
			// 				<a href="" className="search-suggestions__link link link--black">Master of Arts in Education</a>
			// 			</li>
			// 			<li className="search-suggestions__result">
			// 				<div className="icon icon--circle"></div>
			// 				<a href="" className="search-suggestions__link link link--black">Bachelor of Arts in English with an Inspired Teaching and Learning and a Preliminary Single Subject Teaching Credential</a>
			// 			</li>
			// 			<li className="search-suggestions__result">
			// 				<div className="icon icon--circle"></div>
			// 				<a href="" className="search-suggestions__link link link--black">Bachelor of Arts in Interdisciplinary Studies with a California Preliminary Multiple Subjects Teaching Credential</a>
			// 			</li>
			// 		</ul>
			// 	</div>
			//)

			if (this.props.loading) {

				searchResults = (<div>Loading...</div>)

			} else if (this.props.totalResults > 0) {

				// loop through all returned results
				let results = this.props.results.map((result) => {
					return (
						<div key={result.id} className="search-results__result">
							<h3><a href={result.permalink} className="link">{ result.title }</a></h3>
							<p>{ result.excerpt }</p>
						</div>
					)
				})

				// if total results > returned results the display 'view all' link
				if (parseInt(this.props.totalResults) > this.props.results.length) {
					viewMore = (
						<div className="search-results__view-all">
							<a href={ '/?s=' + this.state.term }>View all results</a>
						</div>
					)
				}

				// display returned results
				searchResults = (
					<div className="search-overlay__content search-results">
						<div className="search-results__header">
							<h3 className="search-overlay__heading">Showing { this.props.results.length } of { this.props.totalResults } results for "{ this.state.term }"</h3>
						</div>
						<div className="search-results__content">
							{ results }
						</div>
						{ viewMore }
					</div>
				)
			}
		}

		return (
			<form onSubmit={this.onSubmit}>
				<div className="search-overlay__header">
					<div className="search-overlay__icon icon icon--search"></div>
					<div className="search-overlay__input">
						<DebounceInput
							minLength={4}
							debounceTimeout={500}
							value={this.state.term}
							onChange={this.onChange}
							onKeyUp={e => this.setState({term: e.target.value})}
							className="input input--text"
							aria-label="Search Website"
							placeholder="What are you looking for?" />

						{ clearButton }
					</div>
					{ suggestions }
				</div>
				{ searchResults }
			</form>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectedDynamicSearch)
