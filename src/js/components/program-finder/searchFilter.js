import React from 'react'
import { connect } from 'react-redux'

import { addProgramsFilter, removeProgramsFilter } from '../../actions'
import store from '../../store'

const mapDispatchToProps = dispatch => {
	return {
		addProgramsFilter: (filter) => dispatch(addProgramsFilter(filter)),
		removeProgramsFilter: (filter) => dispatch(removeProgramsFilter(filter))
	}
}

class ConnectedSearchFilter extends React.Component {

	constructor(props) {
		super(props)

		this.state = {
			isChecked: false
		}

		store.subscribe(() => {
			const state = store.getState()
			let isChecked = false

			if (state.programs.filters.length > 0) {
				if (state.programs.filters.find((f) => (f.key == this.props.taxonomy) && (f.value == this.props.term.slug))) {
					isChecked = true
				}
			}

			this.setState({ isChecked })
		})

		this.onChange = this.onChange.bind(this)
	}

	onChange() {
		if (this.state.isChecked) {

			this.setState({ isChecked: false })

			this.props.removeProgramsFilter({
				key: this.props.taxonomy,
				value: this.props.term.slug
			})

		} else {

			this.setState({ isChecked: true })

			this.props.addProgramsFilter({
				key: this.props.taxonomy,
				value: this.props.term.slug
			})
		}
	}

	render() {
		const identifier = 'program-filter__btn--' + this.props.term.slug;
		let className = 'filter__btn'

		if (this.state.isChecked) {
			className += ' filter__btn--active'
		}

		return (
			<React.Fragment>
				<input type="checkbox" name={identifier} id={identifier} data-id={this.props.term.slug} onChange={this.onChange} checked={this.state.isChecked} />
				<label className={className} htmlFor={identifier}>
					{ this.props.term.name }
				</label>
			</React.Fragment>
		)
	}
}

const SearchFilter = connect(null, mapDispatchToProps)(ConnectedSearchFilter)
export default SearchFilter
