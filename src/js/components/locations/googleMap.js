import React, { Component } from 'react'
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react'
import { connect } from 'react-redux'

import store from '../../store'

const mapStateToProps = state => {
	return {
		locations: state.locations.results,
		selected: state.locations.selected
	}
}

export class MapContainer extends Component {

	constructor(props) {

		super(props)

		this.state = {
			loaded: false,
			showInfoWindow: false,
			activeMarker: {}
		}

		this.markers = []

		this.onMarkerClick = this.onMarkerClick.bind(this)

		store.subscribe(() => this.onSubscribe())
	}

	onSubscribe() {
		const savedState = store.getState()

		if (savedState.locations.status === 'loaded' && savedState.regions.status === 'loaded') {

			if (savedState.locations.selected.hasOwnProperty('id')) {

				if (this.markers[savedState.locations.selected.id] && this.markers[savedState.locations.selected.id].marker) {

					this.setState({
						activeMarker: this.markers[savedState.locations.selected.id].marker,
						showInfoWindow: (savedState.locations.selected.id === this.state.activeMarker.id ? ! this.state.showInfoWindow : true)
					})
				}
			}
		}
	}

	generateMarkers() {
		let markers = []

		for (let i = 0; i < this.props.locations.length; i++) {
			let location = this.props.locations[i]

			let icon = {
				url: location.mapIcon,
				scaledSize: new google.maps.Size(25, 25)
			}

			markers.push(
				<Marker
					id={location.id}
					name={location.title}
					icon={icon}
					position={location.coordinates}
					location={location}
					onClick={this.onMarkerClick}
					key={location.id}
					ref={(marker) => { this.markers[location.id] = marker }}
				/>
			)
		}

		return markers
	}

	onMarkerClick(props, marker, e) {

		this.setState({
			activeMarker: marker,
			showInfoWindow: (marker.id === this.state.activeMarker.id ? ! this.state.showInfoWindow : true)
		})
	}

	renderThumbnail(location) {
		if (! location.hasOwnProperty('id') || location.thumbnail === '') {
			return
		}

		return (
			<div className="col-5 col-md-3">
				<img src={location.thumbnail} class="location__thumbnail"  alt={location.title} />
			</div>
		)
	}

	renderAddress(location) {

		if (! location.hasOwnProperty('id')) {
			return
		}

		return (
			<div className={location.thumbnail !== '' ? 'col-7 col-md-9' : 'col-12'}>
				<div>{location.address.streetAddress}</div>
				<div>{location.address.streetAddress2}</div>
				<div>
					{location.address.city ? location.address.city + ',' : ''} {location.address.state} {location.address.zipCode}
				</div>
			</div>
		)
	}

	render() {

		if (! this.props.google) {
			return (
				<div>Loading...</div>
			)
		}

		let center = {
			lat: 39.0119,
			lng: -98.4842
		}

		let location = (this.state.activeMarker.hasOwnProperty('location') ? this.state.activeMarker.location : {})

		return (
			<Map google={ this.props.google } initialCenter={ center } zoom={ 4 }>
				{ this.generateMarkers() }
				<InfoWindow marker={this.state.activeMarker} visible={ this.state.showInfoWindow }>
					<div className="infowindow">
						<div className="row">
							<h1 className="col-12">
								<a href={ location.permalink } target="_blank" className="infowindow__title">{ location.title }</a>
							</h1>
						</div>
						<div className="row">
							{ this.renderThumbnail(location) }
							{ this.renderAddress(location) }
						</div>
					</div>
				</InfoWindow>
			</Map>
		)
	}
}

export default connect(mapStateToProps)(
	GoogleApiWrapper({ apiKey: 'XXXX-INSERT-API-KEY-HERE' })(MapContainer)
)
