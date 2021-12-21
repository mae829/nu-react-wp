import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import store from '../../store'

import Locations from './locations'
import MapContainer from './googleMap'

export default class LocationsController {

	constructor() {

		this.maybeRenderMap = this.maybeRenderMap.bind(this)

		this.renderLocations()
		this.maybeRenderMap()

		window.addEventListener('resize', this.maybeRenderMap)
	}

	renderLocations() {
		const $locationsContainer = document.querySelector('.js-locations')

		if ($locationsContainer) {
			ReactDOM.render(
				<Provider store={store}>
					<Locations
						locationsEndpointUrl={nu_react_wp_locations.locations}
						regionsEndpointUrl={nu_react_wp_locations.regions}
						queryParams={nu_react_wp_locations.query_params.filters}
						queryString={window.location.search}
					/>
				</Provider>,
				$locationsContainer
			)
		}
	}

	maybeRenderMap() {

		if (window.innerWidth > 991) {
			this.renderMap()
			window.removeEventListener('resize', this.maybeRenderMap)
		}
	}

	renderMap() {
		const $mapContainer = document.querySelector('.js-google-map')

		if ($mapContainer) {
			ReactDOM.render(
				<Provider store={store}>
					<MapContainer />
				</Provider>,
				$mapContainer
			)
		}
	}
}
