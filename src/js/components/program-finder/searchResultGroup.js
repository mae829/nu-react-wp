import React from 'react'
import SearchResult from './searchResult'

export default class SearchResultsGroup extends React.Component {

	constructor(props) {
		super(props)

		this.state = {
			limit: 5,
			increment: 10
		}

		this.focusOnMore = React.createRef();

		this.onClick = this.onClick.bind(this)
	}

	componentDidUpdate() {
		if ( ! this.focusOnMore.current ) {
			return
		}

		this.focusOnMore.current.focus()
	}

	onClick(e) {
		e.preventDefault()

		this.setState({ limit: (this.state.limit + this.state.increment) })
	}

	render() {
		const group = this.props.group

		let results = group.programs.slice(0, this.state.limit).map((result, index) => {
			const toFocus = index === ( this.state.limit - this.state.increment ) ? this.focusOnMore : false
			return (<SearchResult key={result.id} result={result} reference={toFocus} />)
		})

		return (
			<div key={group.taxonomy} className="results-section container-fluid">
				<div className="results-section__header row">
					<div className="col-8 col-md-6 results-section__heading">
						<h3 className="mb-0">{group.term.name}</h3>
					</div>
					<div className="col-4 col-md-6 results-section__count">{group.totalPrograms}</div>
				</div>
				{results}
				<div className={"results-section__more row" + (this.state.limit >= group.totalPrograms ? ' d-none' : '')}>
					<div className="col-12">
						<button className="btn btn--blue-bright" onClick={this.onClick}>View More <span aria-hidden="true" className="icon icon--chevron-down"></span></button>
					</div>
				</div>
			</div>
		)
	}
}
