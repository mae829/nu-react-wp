context('Programs', () => {
	before(() => {
		cy.visit(Cypress.env('host') + '/program-finder/')
		cy.get('.gdpr-close').click()
	})

	const getTotalResults = (win) => {
		return parseInt(win.document.querySelector('.results-header__heading').textContent)
	}

	const getSectionResults = (win) => {
		let sectionResults = []

		win.document.querySelectorAll('.results-section__header').forEach((el) => {
			sectionResults.push({
				label: el.querySelector('.results-section__heading').textContent,
				count: el.querySelector('.results-section__count').textContent
			})
		})

		return sectionResults
	}

	it('displays the search filters', () => {

		// header
		cy.get('.program-finder__sidebar').should('be.visible')
		cy.get('.filter__title').should('be.visible').should('contain', 'Find Your Program')

		// degree level
		cy.get('.js-program-finder-filters .filter__section:nth-child(1) .filter__heading').should('be.visible').should('contain', 'degree level')
		cy.get('.js-program-finder-filters .filter__section:nth-child(1) .filter__options').children().should('have.length.gt', 1)
		cy.get('.js-program-finder-filters .filter__section:nth-child(1) .filter__btn').should('be.visible')

		// area of study
		cy.get('.js-program-finder-filters .filter__section:nth-child(2) .filter__heading').should('be.visible').should('contain', 'area of study')
		cy.get('.js-program-finder-filters .filter__section:nth-child(2) .filter__options').children().should('have.length.gt', 1)
		cy.get('.js-program-finder-filters .filter__section:nth-child(2) .filter__btn').should('be.visible')

		// classes
		cy.get('.js-program-finder-filters .filter__section:nth-child(3) .filter__heading').should('be.visible').should('contain', 'classes')
		cy.get('.js-program-finder-filters .filter__section:nth-child(3) .filter__options').children().should('have.length.gt', 1)
		cy.get('.js-program-finder-filters .filter__section:nth-child(3) .filter__btn').should('be.visible')
	})

	it('displays the search results', () => {

		// results
		cy.get('.js-program-finder-programs').should('be.visible')

		// results header
		cy.get('.results-header__heading').should('be.visible').should('contain', 'Programs Found')
		cy.get('.results-header .icon--search').should('be.visible')
		cy.get('.results-header .input--text').should('not.exist')
		cy.get('.results-header__sort-menu-toggle').should('be.visible').should('contain', 'Sort programs by...')
		cy.get('.results-header__sort-menu').should('not.exist')

		// results container
		cy.get('.results-section').should('have.length.gt', 1)
		cy.get('.results-section:nth-child(2) .results-section__heading').should('be.visible').should('not.be.empty')
		cy.get('.results-section:nth-child(2) .results-section__count').should('be.visible').should('not.be.empty')
		cy.get('.results-section:nth-child(2) .result:nth-child(2)').children().should('have.length', 3)
		cy.get('.results-section:nth-child(2) .result:nth-child(2) .result__permalink').should('be.visible').should('not.be.empty')
		cy.get('.results-section:nth-child(2) .result:nth-child(2) .result__excerpt').should('be.visible').should('not.be.empty')
		cy.get('.results-section:nth-child(2) .result:nth-child(2) .result__footer').should('be.visible').should('not.be.empty')
	})

	it('displays the search input', () => {

		// open
		cy.get('.results-header .icon--search').click({ force: true })
		cy.get('.results-header .input--text').should('be.visible')

		// close
		cy.get('.results-header .icon--search').click({ force: true })
		cy.get('.results-header .input--text').should('not.exist')
	})

	it('displays the sort by dropdown', () => {

		// open
		cy.get('.results-header__sort-menu-toggle').click({ force: true })
		cy.get('.results-header__sort-menu').children().should('have.length.gt', 1)
		cy.get('.results-header__sort-menu .btn:first-child').should('be.visible').should('not.be.empty')

		// close
		cy.get('.results-header__sort-menu-toggle').click({ force: true })
		cy.get('.results-header__sort-menu').should('not.exist')
	})

	it('filters the search results by degree', () => {
		let totalResults =  0
		let sectionResults = []

		cy.window()
			.then((win) => {
				totalResults = getTotalResults(win)
				sectionResults = getSectionResults(win)

				cy.get('.js-program-finder-filters .filter__section:nth-child(1) .filter__btn:first-child')
					.click({ force: true })
					.wait(2000)
					.then(() => {
						let totalResults2 = getTotalResults(win)
						let sectionResults2 = getSectionResults(win)

						expect(totalResults2).to.not.equal(totalResults)
						expect(sectionResults2).to.not.equal(sectionResults)
					})
					.then(() => {
						cy.get('.js-program-finder-filters .filter__section:nth-child(1) .filter__btn:first-child')
							.click({ force: true })
							.wait(2000)
							.then(() => {
								let totalResults3 = getTotalResults(win)
								let sectionResults3 = getSectionResults(win)

								expect(totalResults3).to.equal(totalResults)
								expect(sectionResults3).to.deep.equal(sectionResults)
							})
					})
			})
	})

	it('filters the search results by area of study', () => {
		let totalResults =  0
		let sectionResults = []

		cy.window()
			.then((win) => {
				totalResults = getTotalResults(win)
				sectionResults = getSectionResults(win)

				cy.get('.js-program-finder-filters .filter__section:nth-child(2) .filter__btn:first-child')
					.click({ force: true })
					.wait(2000)
					.then(() => {
						let totalResults2 = getTotalResults(win)
						let sectionResults2 = getSectionResults(win)

						expect(totalResults2).to.not.equal(totalResults)
						expect(sectionResults2).to.not.equal(sectionResults)
					})
					.then(() => {
						cy.get('.js-program-finder-filters .filter__section:nth-child(2) .filter__btn:first-child')
							.click({ force: true })
							.wait(2000)
							.then(() => {
								let totalResults3 = getTotalResults(win)
								let sectionResults3 = getSectionResults(win)

								expect(totalResults3).to.equal(totalResults)
								expect(sectionResults3).to.deep.equal(sectionResults)
							})
					})
			})
	})

	it('filters the search results by type', () => {
		let totalResults =  0
		let sectionResults = []

		cy.window()
			.then((win) => {
				totalResults = getTotalResults(win)
				sectionResults = getSectionResults(win)

				cy.get('.js-program-finder-filters .filter__section:nth-child(3) .filter__btn:first-child')
					.click({ force: true })
					.wait(2000)
					.then(() => {
						let totalResults2 = getTotalResults(win)
						let sectionResults2 = getSectionResults(win)

						expect(totalResults2).to.not.equal(totalResults)
						expect(sectionResults2).to.not.equal(sectionResults)
					})
					.then(() => {
						cy.get('.js-program-finder-filters .filter__section:nth-child(3) .filter__btn:first-child')
							.click({ force: true })
							.wait(2000)
							.then(() => {
								let totalResults3 = getTotalResults(win)
								let sectionResults3 = getSectionResults(win)

								expect(totalResults3).to.equal(totalResults)
								expect(sectionResults3).to.deep.equal(sectionResults)
							})
					})
			})
	})

	it('clears the search filters', () => {
		let totalResults =  0
		let sectionResults = []

		cy.window()
			.then((win) => {
				totalResults = getTotalResults(win)
				sectionResults = getSectionResults(win)

				cy.get('.js-program-finder-filters .filter__section:nth-child(1) .filter__btn:first-child')
					.click({ force: true })
					.wait(2000)
					.then(() => {
						let totalResults2 = getTotalResults(win)
						let sectionResults2 = getSectionResults(win)

						expect(totalResults2).to.not.equal(totalResults)
						expect(sectionResults2).to.not.equal(sectionResults)
					})
					.then(() => {
						cy.get('.js-program-finder-filters .filter__clear')
							.click({ force: true })
							.wait(2000)
							.then(() => {
								let totalResults3 = getTotalResults(win)
								let sectionResults3 = getSectionResults(win)

								expect(totalResults3).to.equal(totalResults)
								expect(sectionResults3).to.deep.equal(sectionResults)
							})
					})
			})
	})

	it('filters the search results by query', () => {
		let totalResults =  0
		let sectionResults = []

		cy.window().scrollTo(0, 600)

		cy.window()
			.then((win) => {
				totalResults = getTotalResults(win)
				sectionResults = getSectionResults(win)

				cy.get('.js-program-finder-programs .results-header .icon--search').click({ force: true })

				cy.get('.js-program-finder-programs .results-header .input--text')
					.type('accounting{enter}', { force: true })
					.wait(2000)
					.then(() => {
						let totalResults2 = getTotalResults(win)
						let sectionResults2 = getSectionResults(win)

						expect(totalResults2).to.not.equal(totalResults)
						expect(sectionResults2).to.not.equal(sectionResults)
					})
					.then(() => {
						cy.get('.js-program-finder-programs .results-header .input--text')
							.clear()
							.wait(2000)
							.then(() => {
								let totalResults3 = getTotalResults(win)
								let sectionResults3 = getSectionResults(win)

								expect(totalResults3).to.equal(totalResults)
								expect(sectionResults3).to.deep.equal(sectionResults)
							})
					})
					.then(() => {
						cy.get('.js-program-finder-programs .results-header .icon--search').click({ force: true })
					})
			})
	})

	it('sorts the search results', () => {
		let sectionResults = []

		cy.window()
			.then((win) => {
				sectionResults = getSectionResults(win)

				cy.get('.results-header__sort-menu-toggle').click({ force: true })

				cy.get('.results-header__sort-menu button:first-child')
					.click({ force: true })
					.wait(2000)
					.then(() => {
						let sectionResults2 = getSectionResults(win)
						expect(sectionResults2).to.not.equal(sectionResults)
					})
					.then(() => {
						cy.get('.results-header__sort-menu-toggle').click({ force: true })

						cy.get('.results-header__sort-menu button:first-child')
							.click({ force: true })
							.wait(2000)
							.then(() => {
								let sectionResults3 = getSectionResults(win)
								expect(sectionResults3).to.deep.equal(sectionResults)
							})
					})
			})
	})
})
