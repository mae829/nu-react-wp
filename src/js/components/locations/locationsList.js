import React from 'react'
import { connect } from 'react-redux'

import { selectLocation, filterByLocation, clearLocationFilters } from '../../actions'

const mapStateToProps = (state) => {
	return {
		locations: state.locations,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		selectLocation: (location) => dispatch(selectLocation(location)),
		filterByLocation: (location) => dispatch(filterByLocation(location)),
		clearLocationFilters: () => dispatch(clearLocationFilters()),
	}
}

class ConnectedLocationsList extends React.Component {

	constructor(props) {
		super(props)

		this.state = {
			selected: 0
		}

		this.onClick = this.onClick.bind(this)
	}

	onClick(location) {

		if (window.innerWidth < 992) {
			return window.open(location.permalink, 'NUS_LOCATION')
		}

		this.setState({
			selected: (this.state.selected === location.id ? 0 : location.id)
		})

		this.props.selectLocation(location)
	}

	generateLocations() {
		let locations = []

		if (this.props.locations.results.length > 0) {

			for (let i = 0; i < this.props.locations.results.length; i++) {
				let location = this.props.locations.results[i]

				locations.push(
					<button className={'location' + (this.state.selected === location.id ? ' location--active' : '') + ' w-100'} onClick={(e) => this.onClick(location) } data-location={location.id} key={location.id}>
						<div className="location__left">{ (i + 1) }.</div>
						<div className="location__right">
							<h2 className="location__name">{ location.title }</h2>
							<div className="location__address">
								<div>{ location.address.streetAddress }</div>
								<div>{ location.address.streetAddress2 }</div>
								<div>{ location.address.city ? location.address.city + ',' : '' } { location.address.state } { location.address.zipCode }</div>
							</div>
						</div>
					</button>
				)
			}

		} else if (this.props.locations.status === 'loaded') {
			locations.push(
				<div className="location" key="0">No locations matching your request were found.</div>
			)
		}

		return locations
	}

	generateFooter() {
		if (this.props.locations.filters.search !== '' || this.props.locations.filters.region !== '' || this.props.locations.filters.location !== '') {
			return (
				<div className="locations__footer" key="0">
					<button className="locations__clear-btn" onClick={this.props.clearLocationFilters}>
						<span aria-hidden="true" className="icon icon--close"></span> Clear filters
					</button>
				</div>
			)
		}
	}

	render() {
		return (
			<div className="locations__list p-lg-1">
				{ this.generateLocations() }
				{ this.generateFooter() }
			</div>
		)
	}
}

const LocationsList = connect(mapStateToProps, mapDispatchToProps)(ConnectedLocationsList)
export default LocationsList
