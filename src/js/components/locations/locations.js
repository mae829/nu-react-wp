import React from 'react'
import { connect } from 'react-redux'

import { getRegions, gotRegions, getLocations, gotLocations, setLocationFilters } from '../../actions'

import LocationFilters from './locationFilters'
import LocationsList from './locationsList'


const mapDispatchToProps = (dispatch) => {
	return {
		getRegions: (url) => dispatch(getRegions(url)),
		gotRegions: (url, regions) => dispatch(gotRegions(url, regions)),
		getLocations: (url) => dispatch(getLocations(url)),
		gotLocations: (url, locations) => dispatch(gotLocations(url, locations)),
		setLocationFilters: (filters) => dispatch(setLocationFilters(filters))
	}
}

class ConnectedLocations extends React.Component {

	constructor(props) {
		super(props)

		this.state = {
			loaded: false,
			searchUrl: null,
			error: null
		}

		this.fetchRegions = this.fetchRegions.bind(this)
		this.fetchLocations = this.fetchLocations.bind(this)

		window.onpopstate = function(event) {
			window.location.reload()
		}
	}

	componentDidMount() {
		this.fetchRegions(this.props.regionsEndpointUrl + this.props.queryString)
		this.fetchLocations(this.props.locationsEndpointUrl + this.props.queryString)
	}

	fetchRegions(url) {

		this.props.getRegions(url)

		fetch(url)
			.then((response) => {
				if (response.ok) {
					return response.json()
				} else {
					throw new Error('An unknown error occurred while fetching the requested data.')
				}
			})
			.then((response) => {
				this.props.gotRegions(url, response)
			})
			.catch((error) => this.setState({ error }))
	}

	fetchLocations(url) {

		this.props.getLocations(url)

		fetch(url)
			.then((response) => {
				if (response.ok) {
					return response.json()
				} else {
					throw new Error('An unknown error occurred while fetching the requested data.')
				}
			})
			.then((response) => {
				this.props.gotLocations(url, response)
				this.props.setLocationFilters(this.props.queryParams)
			})
			.catch((error) => this.setState({ error }))
	}

	render() {

		if (this.state.error) {
			return <p>{this.state.error.message}</p>
		}

		return (
			<div className="locations__container">
				<LocationFilters queryParams={this.props.queryParams} />
				<LocationsList />
			</div>
		)
	}
}

const Locations = connect(null, mapDispatchToProps)(ConnectedLocations)

export default Locations
