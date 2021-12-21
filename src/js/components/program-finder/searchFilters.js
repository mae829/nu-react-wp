import React from 'react'
import { connect } from 'react-redux'

import SearchFilter from './searchFilter'

const mapStateToProps = state => {
	return {
		status: state.programFilters.status,
		filters: state.programFilters.filters,
	}
}

class ConnectedSearchFilters extends React.Component {

	constructor(props) {
		super(props)
	}

	taxonomyDisplay( filters, filtersToDisplay  ) {
		let newFilters = filters.filter( filter => { return filtersToDisplay.includes( filter.taxonomy ) });
		return newFilters;
	}

	buildSearchFilters( filters ) {
		return filters.map( (filter) => {
			if ( filter.taxonomy !== this.props.displayNone ) {
				let tooltip = ''

				if (filter.tooltip) {
					tooltip = (
						<span data-tooltip={filter.tooltip}>
							<span className="filter__info icon icon--question-circle"></span>
						</span>
					)
				}

				const filters = filter.terms.map( ( term ) => {
					return (
						<SearchFilter key={term.term_id} taxonomy={filter.taxonomy} term={term} />
					)
				})

				return (
					<fieldset key={filter.taxonomy} className={ `filter__section filter__section--${filter.taxonomy}` }>
						<legend className="filter__heading">{filter.heading} {tooltip}</legend>
						<div className="filter__options">{filters}</div>
					</fieldset>
				)
			}
		})
	}

	render() {
		let filters = '';

		if (this.props.status === 'loading') {

			return (
				<div className="filter__section">
					<p>Loading...</p>
				</div>
			)

		} else if (this.props.status === 'loaded') {

			if ( this.props.displayFilters.length !== 0 ){
				let newFilters = this.taxonomyDisplay(  this.props.filters, this.props.displayFilters  );
				filters = this.buildSearchFilters( newFilters )
			} else {
				filters = this.buildSearchFilters( this.props.filters )
			}

		}
		return filters
	}
}

const SearchFilters = connect(mapStateToProps)(ConnectedSearchFilters)
export default SearchFilters
