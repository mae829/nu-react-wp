import React from 'react'
import { connect } from 'react-redux'

import SearchResultGroup from './searchResultGroup'

const mapStateToProps = state => {
	return {
		status: state.programs.status,
		programs: state.programs.programs,
		filters: state.programs.filters
	}
}

class ConnectedSearchResultsGroups extends React.Component {

	constructor(props) {
		super(props)
	}

	render() {
		let groups = ''

		if (this.props.status === 'loading') {

			groups = (<div className="results__section container-fluid"><p>Loading...</p></div>)

		} else if (this.props.programs.length > 0) {

			groups = this.props.programs.map((group) => {
				return (
					<SearchResultGroup key={group.id} group={group} paginate={this.props.filters.length === 0} />
				)
			})

		}

		return groups
	}
}

const SearchResultsGroups = connect(mapStateToProps)(ConnectedSearchResultsGroups)
export default SearchResultsGroups
