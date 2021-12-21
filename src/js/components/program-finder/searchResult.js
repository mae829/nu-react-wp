import React from 'react'

export default class SearchResult extends React.Component {

	constructor(props) {
		super(props)
	}

	renderOnCampus() {
		if (this.props.result.classFormat.length > 0) {
			let format = this.props.result.classFormat.find((f) => {
				return f.slug === 'on-campus'
			})

			if (format !== undefined) {
				return (
					<li className="result__location d-inline-block mr-4"><span aria-hidden="true" className="icon icon--map-marker"></span> On-Site</li>
				)
			}
		}
	}

	renderOnline() {
		if (this.props.result.classFormat.length > 0) {
			let format = this.props.result.classFormat.find((f) => {
				return f.slug === 'online'
			})

			if (format !== undefined) {
				return (
					<li className="result__location d-inline-block mr-4"><span aria-hidden="true" className="icon icon--laptop"></span> Online</li>
				)
			}
		}
	}

	render() {
		return (
			<div className="result row">
				<h4 className="mb-0"><a href={this.props.result.permalink} className="result__permalink" ref={this.props.reference}>{this.props.result.title}</a></h4>
				<div className="result__excerpt">{this.props.result.excerpt}</div>
				<div className="result__footer mt-4">
					<ul className="list list--reset mb-0">
						{this.renderOnCampus()}
						{this.renderOnline()}
					</ul>
				</div>
			</div>
		)
	}
}
