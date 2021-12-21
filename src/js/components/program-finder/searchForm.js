import React from 'react'
import { connect } from 'react-redux'

import { getProgramFilters, gotProgramFilters, clearProgramFilters } from '../../actions'

import SearchFilters from './searchFilters'

const mapStateToProps = state => {
	return {
		searchFilters: state.programs.filters,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getProgramFilters: (url) => dispatch(getProgramFilters(url)),
		gotProgramFilters: (url, filters) => dispatch(gotProgramFilters(url, filters)),
		clearProgramFilters: () => dispatch(clearProgramFilters())
	}
}

class ConnectedSearchForm extends React.Component {

	constructor(props) {
		super(props)

		this.state = {
			error: null
		}

		this.fetchFilters = this.fetchFilters.bind(this)
	}

	componentDidMount() {
		this.fetchFilters(this.props.endpointUrl + this.props.queryString)
	}

	fetchFilters(url) {

		this.props.getProgramFilters(url)

		fetch(url)
			.then((response) => {
				if (response.ok) {
					return response.json()
				} else {
					throw new Error('An unknown error occurred while fetching the requested data.')
				}
			})
			.then((response) => {
				this.props.gotProgramFilters(url, response)
			})
			.catch((error) => this.setState({ error }))
	}

	render() {
		let clearFilters = ''

		if (this.state.error) {
			return (<p>{this.state.error.message}</p>)
		}

		if (this.props.searchFilters.length > 0) {
			clearFilters = (
				<div key="clear-filters" className="filter__footer">
					<button className="filter__clear" onClick={this.props.clearProgramFilters}>
						<span aria-hidden="true" className="icon icon--close"></span> Clear filters ({this.props.searchFilters.length})
					</button>
				</div>
			)
		}

		return (
			<div>
				<SearchFilters displayDegree={true} displayClassFormat={true} displayStudyArea={ true } displayFilters={this.props.displayFilters}/>

				{this.props.displayFilters.length === 0 ? clearFilters : ''}
			</div>
		)
	}
}

const SearchForm = connect(mapStateToProps, mapDispatchToProps)(ConnectedSearchForm)
export default SearchForm
