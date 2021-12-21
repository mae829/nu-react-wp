import React from 'react'
import { connect } from 'react-redux'
import { DebounceInput } from 'react-debounce-input'

import { filterBySearch, filterByRegion, setSelectedRegion } from '../../actions'
import store from '../../store'

const mapStateToProps = (state) => {
	return {
		regions: state.regions.regions,
		selected: state.regions.selected,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		filterBySearch: (text) => dispatch(filterBySearch(text)),
		filterByRegion: (region) => dispatch(filterByRegion(region)),
		setSelectedRegion: (region) => dispatch(setSelectedRegion(region))
	}
}

class ConnectedLocationFilters extends React.Component {

	constructor(props) {
		super(props)

		this.state = {
			searchText: this.props.queryParams.search,
			showRegionsMenu: false,
		}

		store.subscribe(() => {
			const state = store.getState()

			if (state.locations.filters.search == '') {
				this.setState({ searchText: '' })
			}
		})

		this.onFilterBySearch = this.onFilterBySearch.bind(this)
		this.onFilterByRegion = this.onFilterByRegion.bind(this)
		this.onSelectChange = this.onSelectChange.bind(this)
	}

	onFilterBySearch(e) {
		this.setState({ searchText: e.target.value })
		this.props.filterBySearch(e.target.value.toLowerCase())
	}

	onFilterByRegion(region) {
		// if region is current selected, set default
		if (region.id === this.props.selected.id) {
			region = {
				id: 0,
				slug: '',
				name: 'All Regions',
			}
		}

		this.props.filterByRegion(region)
		this.props.setSelectedRegion(region)
	}

	onSelectChange( event ) {
		// Build the previously used type of object to pass to onFilterByRegion
		// ...sorry guys, needed to fix for the A360 deadline.
		const selected = event.target.options[ event.target.selectedIndex ];
		const dataset = selected.dataset;
		const selectedObject = {
			id: parseInt( dataset.id ),
			slug: event.target.value,
			name: selected.label,
			active: dataset.active === 'true',
		}

		this.onFilterByRegion( selectedObject )
	}

	getRegions() {
		let regions = []

		regions.push( {
			id: null,
			value: ' ',
			label: '— Regions Filter —'
		}, {
			id: 0,
			value: '',
			label: 'All Regions',
		} )

		for (var i = 0; i < this.props.regions.length; i++) {
			let region = this.props.regions[i]

			regions.push( {
				id: region.id,
				label: region.name,
				value: region.slug,
				active: region.active,
			} )
		}

		return regions
	}

	renderRegions() {
		return this.getRegions().map( region => {
			let inputProps = {
				key: region.id,
				'data-id': region.id,
				'data-active': region.active,
				id: 'region-' + region.id,
				value: region.value,
			}

			if ( null === region.id ) {
				inputProps.disabled = true;
			}

			return <option {...inputProps}>{ region.label }</option>
		} )
	}

	render() {

		return (
			<div className="locations__filters">
				<div className="locations__search-filters">
					<div className="locations__search">
						<span aria-hidden="true" className="icon icon--search icon--pointer"></span>
						<DebounceInput
							minLength={4}
							debounceTimeout={500}
							value={this.state.searchText}
							onChange={this.onFilterBySearch}
							className="input input--text search-locations"
							aria-label="Search Locations"
							placeholder="Search Locations..." />
					</div>
					<div className="locations__regions">
						<div className="regions">
							<label className="regions__menu-toggle sr-only" htmlFor="regions-filter">Regions Filter</label>
							<select defaultValue=" " className="regions__menu" name="regions-filter" id="regions-filter" onChange={ this.onSelectChange }>
								{ this.renderRegions() }
							</select>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

const LocationFilters = connect(mapStateToProps, mapDispatchToProps)(ConnectedLocationFilters)
export default LocationFilters
