context('Search', () => {
	before(() => {
		cy.visit(Cypress.env('host'))
		cy.get('.gdpr-close').click()
	})

	it('opens the search overlay', () => {
		cy.get('.primary-navigation--desktop .js-search-overlay-toggle .icon--search').should('be.visible').click()
		cy.get('#js-dynamic-search').should('be.visible')
	})

	it('should display correctly', () => {

		// search form
		cy.get('.search-overlay__title').should('be.visible').should('contain', 'Search the site')
		cy.get('.search-overlay__input .input--text').should('have.attr', 'placeholder', 'What are you looking for?').should('have.value', '')

		// search results
		cy.get('.search-results').should('not.exist')

		// featured programs
		cy.get('#js-dynamic-search-footer .col-12:nth-child(1) .heading').should('be.visible').should('contain', 'Featured Programs')
		cy.get('#menu-search-featured-programs').children().should('have.length.gt', 1)
		cy.get('#menu-search-featured-programs a').first().should('be.visible')

		// helpful links
		cy.get('#js-dynamic-search-footer .col-12:nth-child(2) .heading').should('be.visible').should('contain', 'Helpful Links')
		cy.get('#menu-search-helpful-links').children().should('have.length.gt', 1)
		cy.get('#menu-search-helpful-links a').first().should('be.visible')

		// close button
		cy.get('#js-search-overlay-close').should('be.visible')
	})

	it('closes the search overlay', () => {
		cy.get('#js-search-overlay-close').click()
		cy.get('#js-dynamic-search').should('not.be.visible')
	})

	it('displays search results', () => {
		cy.get('.js-search-overlay-toggle.icon--search').click()

		// search form
		cy.get('.search-overlay__input .input--text').type('accounting')
		cy.get('.search-overlay__input .input--text').should('have.value', 'accounting')
		cy.get('.search-overlay__input .icon--close-circle').should('be.visible')

		// search results
		cy.get('.search-results').should('exist')
		cy.get('.search-overlay__heading').should('be.visible').should('contain', 'results for "accounting"')
		cy.get('.search-results__content').children().should('have.length.gt', 1)
		cy.get('.search-results__content a').first().should('be.visible')
		cy.get('#js-search-overlay .container').scrollTo('bottom')
		cy.get('.search-results__view-all a').should('be.visible').should('contain', 'View all results')

		// search footer
		cy.get('#js-dynamic-search-footer').should('not.be.visible')

		// close button
		cy.get('#js-search-overlay .container').scrollTo('top')
		cy.get('#js-search-overlay-close').should('be.visible')
	})

	it('clears search results', () => {
		cy.get('.search-overlay__input .icon--close-circle').click()

		// search form
		cy.get('.search-overlay__input .input--text').should('have.value', '')
		cy.get('.search-results').should('not.exist')

		// search footer
		cy.get('#js-dynamic-search-footer .col-12:nth-child(1) .heading').should('be.visible')
		cy.get('#js-dynamic-search-footer .col-12:nth-child(2) .heading').should('be.visible')
	})

	it('updates search results', () => {

		// search form
		cy.get('.search-overlay__input .input--text').type('business{enter}')
		cy.get('.search-overlay__input .input--text').should('have.value', 'business')
		cy.get('.search-overlay__input .icon--close-circle').should('be.visible')

		// search results
		cy.get('.search-results').should('exist')
		cy.get('.search-overlay__heading').should('be.visible').should('contain', 'results for "business"')
		cy.get('.search-results__content').children().should('have.length.gt', 1)
		cy.get('.search-results__result').first().children().should('have.length', 2)
		cy.get('.search-results__result a').first().should('be.visible')
		cy.get('#js-search-overlay .container').scrollTo('bottom')
		cy.get('.search-results__view-all a').should('be.visible').should('contain', 'View all results')

		// search footer
		cy.get('#js-dynamic-search-footer').should('not.be.visible')
	})

	it('shows no results found message', () => {
		cy.get('#js-search-overlay .container').scrollTo('top')

		cy.get('.search-overlay__input .input--text').clear().type('somereallylongstring')
		cy.get('.search-overlay__heading').should('be.visible').should('contain', 'No results found')

		cy.get('#js-search-overlay-close').click()
	})
})
