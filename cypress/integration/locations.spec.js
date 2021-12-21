context('Locations', () => {
	let totalLocations = 0;
	let totalPins = 0

	before(() => {
		cy.visit(Cypress.env('host') + '/location-landing/')

		cy.get('.gdpr-close').click({ force: true })

		cy.get('.locations__list .location')
			.its('length')
			.then((length) => totalLocations = length)

		cy.get('img[src*="/wp-content/themes/national-university-hotb/img/"]')
			.its('length')
			.then((length) => totalPins = length)
	})

	it('displays locations', () => {

		// filters
		cy.get('.locations__filters').should('be.visible')
		cy.get('.search-locations').should('be.visible').should('have.attr', 'placeholder', 'Search Locations...').should('have.value', '')
		cy.get('.regions__menu-toggle').should('be.visible').should('contain', 'All Regions')
		cy.get('.regions__menu').should('not.exist')

		// list
		cy.get('.locations__list').should('be.visible').children().should('have.length.gt', 1)
		cy.get('.locations__list .location:first-child').should('be.visible').children().should('have.length', 2)
		cy.get('.locations__list .location:first-child .location__left').should('be.visible').should('contain', '1')
		cy.get('.locations__list .location:first-child .location__name').should('be.visible').should('not.be.empty')
		cy.get('.locations__list .location:first-child .location__address').should('be.visible').should('not.be.empty')
	})

	it('displays a google map', () => {
		cy.get('.js-google-map').should('be.visible')
		cy.get('.js-google-map > div > div').should('be.visible')
		cy.get('img[src*="/wp-content/themes/national-university-hotb/img/"]').should('have.length.gte', 1)
	})

	it('filters location by query', () => {
		cy.get('.search-locations')
			.type('california{enter}')
			.wait(1000)
			.then(() => {
				cy.get('.locations__list .location').should('have.length.lt', totalLocations)
				cy.get('img[src*="/wp-content/themes/national-university-hotb/img/"]').should('have.length.lt', totalPins)
			})
			.then(() => {
				cy.get('.search-locations')
					.clear()
					.wait(1000)
					.then(() => {
						cy.get('.locations__list .location').should('have.length', totalLocations)
						cy.get('img[src*="/wp-content/themes/national-university-hotb/img/"]').should('have.length', totalPins)
					})
			})
	})

	it('filters location by region', () => {
		cy.get('.regions__menu-toggle').click({ force: true })

		cy.get('.regions__menu .btn:first-child')
			.click({ force: true })
			.wait(1000)
			.then(() => {
				cy.get('.locations__list .location').should('have.length.lt', totalLocations)
				cy.get('img[src*="/wp-content/themes/national-university-hotb/img/"]').should('have.length.lt', totalPins)
			})
			.then(() => {
				cy.get('.regions__menu-toggle').click({ force: true })

				cy.get('.regions__menu .btn:first-child')
					.click({ force: true })
					.wait(1000)
					.then(() => {
						cy.get('.locations__list .location').should('have.length', totalLocations)
						cy.get('img[src*="/wp-content/themes/national-university-hotb/img/"]').should('have.length', totalPins)
					})
			})
	})

	it('clears filters', () => {

		// query
		cy.get('.search-locations').type('california', { force: true })
		cy.get('.locations__clear-btn').should('exist').should('contain', 'Clear filters').click({ force: true })
		cy.get('.search-locations').should('have.value', '')
		cy.get('.locations__clear-btn').should('not.exist')

		// region
		cy.get('.regions__menu-toggle').click({ force: true })
		cy.get('.regions__menu .btn:nth-child(1)').click({ force: true })
		cy.get('.locations__clear-btn').should('exist').should('contain', 'Clear filters').click({ force: true })
		cy.get('.regions__menu-toggle').should('contain', 'All Regions')
		cy.get('.locations__clear-btn').should('not.exist')

		// both
		cy.get('.search-locations').type('california', { force: true })
		cy.get('.regions__menu-toggle').click({ force: true })
		cy.get('.regions__menu .btn:nth-child(1)').click({ force: true })
		cy.get('.locations__clear-btn').should('exist').should('contain', 'Clear filters').click({ force: true })
		cy.get('.search-locations').should('have.value', '')
		cy.get('.regions__menu-toggle').should('contain', 'All Regions')
		cy.get('.locations__clear-btn').should('not.exist')
	})

	it('shows no locations message', () => {
		cy.get('.search-locations').type('vancouver', { force: true })
		cy.get('.regions__menu-toggle').click({ force: true })
		cy.get('.regions__menu .btn:nth-child(1)').click({ force: true })
		cy.get('.locations__list .location:nth-child(1)').should('be.visible').should('contain', 'No locations')
	})

	it('opens location', () => {
		cy.get('.search-locations').clear({ force: true })
		cy.get('.regions__menu-toggle').click({ force: true })
		cy.get('.regions__menu .btn:nth-child(1)').click({ force: true })

		// open
		cy.get('.locations__list .location:first-child').click({ force: true })
		cy.get('.infowindow').should('be.visible')
		cy.get('.infowindow__title').should('be.visible').should('not.be.empty')
		cy.get('.infowindow .row:nth-child(2)').should('be.visible').should('not.be.empty')

		// close
		cy.get('.locations__list .location:first-child').click({ force: true })
		cy.get('.infowindow').should('not.exist')
	})
})
