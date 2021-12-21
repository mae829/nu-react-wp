import React from 'react'
import { connect } from 'react-redux'
import { DebounceInput } from 'react-debounce-input'

import { addProgramsFilter, removeProgramsFilter, setProgramsHeader, searchPrograms, sortPrograms } from '../../actions'

const mapStateToProps = state => {
	return {
		status: state.programs.status,
		totalPrograms: state.programs.totalPrograms,
		searchTerm: state.programs.searchTerm,
		sort: state.programs.sort
	}
}

const mapDispatchToProps = dispatch => {
	return {
		addProgramsFilter: (filter) => dispatch(addProgramsFilter(filter)),
		removeProgramsFilter: (filter) => dispatch(removeProgramsFilter(filter)),
		setProgramsHeader: (filter) => dispatch(setProgramsHeader(filter)),
		searchPrograms: (searchTerm) => dispatch(searchPrograms(searchTerm)),
		sortPrograms: (sort) => dispatch(sortPrograms(sort))
	}
}

class ConnectedSearchResultsHeader extends React.Component {

	constructor(props) {
		super(props)

		this.state = {
			showSearchInput: false,
			sortOptions: [
				{
					id: 0,
					key: '',
					value: '',
					label: 'Sort programs by...'
				},
				{
					id: 1,
					key: 'area-of-study',
					value: 'area-of-study',
					label: 'Area of Study'
				},
				{
					id: 2,
					key: 'class-format',
					value: 'class-format',
					label: 'Class Format'
				},
				{
					id: 3,
					key: 'degree-type',
					value: 'degree-type',
					label: 'Degree Level'
				},
			],
			sortValue: this.props.queryParams.sort.key
		}

		this.toggleSearchInput = this.toggleSearchInput.bind(this)
		this.searchPrograms = this.searchPrograms.bind(this)

		this.sortPrograms = this.sortPrograms.bind(this)
	}

	componentDidMount() {

		// push "search" and "sort" URL params into react state
		let header = {
			searchTerm: (this.props.queryParams.searchTerm ? this.props.queryParams.searchTerm : ''),
			sort: this.state.sortOptions[0]
		}

		if (this.props.queryParams.sort.key && this.props.queryParams.sort.value) {

			let sort = this.state.sortOptions.find((option) => {
				return (option.key === this.props.queryParams.sort.key && option.value === this.props.queryParams.sort.value)
			})

			if (sort !== undefined) {
				header.sort = sort
			}
		}

		this.props.setProgramsHeader(header)
	}

	toggleSearchInput() {
		this.setState({ showSearchInput: ! this.state.showSearchInput })
	}

	searchPrograms(e) {
		this.props.searchPrograms(e.target.value)
	}

	renderSortOptions() {
		return this.state.sortOptions.map( option => {
			let inputProps = {
				key: option.id,
				'data-id': option.id,
				id: `sort-option-${ option.id }`,
				value: option.value,
			}

			if ( ! option.id ) {
				inputProps.disabled = true;
			}

			return <option {...inputProps}>{ option.label }</option>
		} )
	}

	renderSortMenu() {
		return (
			<select value={ this.state.sortValue } className="results-header__sort-menu" name="sort-programs" id="sort-programs" onChange={ this.sortPrograms }>
				{ this.renderSortOptions() }
			</select>
		)
	}

	sortPrograms(e) {
		let sort  = this.state.sortOptions[0]

		const selected = e.target.options[ e.target.selectedIndex ];
		const dataset = selected.dataset;

		if ( parseInt(dataset.id) !== this.props.sort.id ) {
			sort = this.state.sortOptions.find((opt) => {
				return (opt.id === parseInt(dataset.id))
			})
		}

		this.setState({
			sortLabel: sort.label,
			sortValue: selected.value
		})

		this.props.sortPrograms(sort)
	}

	renderSearchInput() {

		if (this.state.showSearchInput || this.props.searchTerm) {
			return (
				<React.Fragment>
					<label htmlFor="filtered-programs-search" className="sr-only">Search filtered program results</label>
					<DebounceInput
						minLength={4}
						debounceTimeout={500}
						value={this.props.searchTerm}
						onChange={this.searchPrograms}
						className="input input--text"
						id="filtered-programs-search"
						aria-expanded="true" />
				</React.Fragment>
			)
		}
	}

	render() {
		return (
			<div className="results-header container-fluid">
				<div className="results-header__column">
					<h2 className="results-header__heading heading heading--five mb-0">{this.props.totalPrograms} Programs Found</h2>
				</div>
				<div className="results-header__column">
					<button className="icon--btn" onClick={this.toggleSearchInput} aria-expanded={ this.state.showSearchInput ? 'true' : 'false' } aria-label="Search filtered program results." aria-controls="filtered-programs-search"><span className="icon icon--search"></span></button>
					{this.renderSearchInput()}
				</div>
				<div className="results-header__column">
					<label
						className="results-header__sort-menu-toggle sr-only"
						htmlFor="sort-programs"
					>
						{this.props.sort.label}
					</label>
					{this.renderSortMenu()}
				</div>
			</div>
		)
	}
}

const SearchResultsHeader = connect(mapStateToProps, mapDispatchToProps)(ConnectedSearchResultsHeader)
export default SearchResultsHeader
