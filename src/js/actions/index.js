/**
 * PROGRAMS
 */
export function getPrograms(url) {
	return {
		type: 'GET_PROGRAMS',
		payload: url
	}
}

export function gotPrograms(url, programs) {
	return {
		type: 'GOT_PROGRAMS',
		url,
		payload: programs,
		receivedAt: Date.now()
	}
}

export function addProgramsFilter(filter) {
	return {
		type: 'ADD_PROGRAMS_FILTER',
		payload: filter
	}
}

export function removeProgramsFilter(filter) {
	return {
		type: 'REMOVE_PROGRAMS_FILTER',
		payload: filter
	}
}

export function setProgramsFilters(filters) {
	return {
		type: 'SET_PROGRAMS_FILTERS',
		payload: filters
	}
}

export function clearProgramFilters() {
	return {
		type: 'CLEAR_PROGRAM_FILTERS'
	}
}

export function setProgramsHeader(filters) {
	return {
		type: 'SET_PROGRAMS_HEADER',
		payload: filters
	}
}

export function searchPrograms(searchTerm) {
	return {
		type: 'SEARCH_PROGRAMS',
		payload: searchTerm
	}
}

export function sortPrograms(sort) {
	return {
		type: 'SORT_PROGRAMS',
		payload: sort
	}
}

export function decodeProgramsUrl(url) {
	return {
		type: 'DECODE_PROGRAMS_URL',
		payload: url
	}
}


/**
 * PROGRAM FILTERS
 */
export function getProgramFilters(url) {
	return {
		type: 'GET_PROGRAM_FILTERS',
		payload: url
	}
}

export function gotProgramFilters(url, filters) {
	return {
		type: 'GOT_PROGRAM_FILTERS',
		url,
		payload: filters,
		receivedAt: Date.now()
	}
}


/**
 * LOCATIONS
 */
export function getLocations(url) {
	return {
		type: 'GET_LOCATIONS',
		url
	}
}

export function gotLocations(url, locations) {
	return {
		type: 'GOT_LOCATIONS',
		url,
		payload: locations,
		receivedAt: Date.now()
	}
}

export function setLocationFilters(filters) {
	return {
		type: 'SET_LOCATION_FILTERS',
		payload: filters,
	}
}

export function clearLocationFilters() {
	return {
		type: 'CLEAR_LOCATION_FILTERS'
	}
}

export function filterBySearch(text) {
	return {
		type: 'FILTER_BY_SEARCH',
		payload: text
	}
}

export function filterByRegion(region) {
	return {
		type: 'FILTER_BY_REGION',
		payload: region
	}
}

export function filterByLocation(location) {
	return {
		type: 'FILTER_BY_LOCATION',
		payload: location
	}
}

export function selectLocation(location) {
	return {
		type: 'SELECT_LOCATION',
		payload: location
	}
}


/**
 * REGIONS
 */
export function getRegions(url) {
	return {
		type: 'GET_REGIONS',
		url
	}
}

export function gotRegions(url, regions) {
	return {
		type: 'GOT_REGIONS',
		url,
		payload: regions,
		receivedAt: Date.now()
	}
}

export function setSelectedRegion(region) {
	return {
		type: 'SET_SELECTED_REGION',
		payload: region
	}
}


/**
 * SEARCH FILTERS
 */
export function addSearchFilter(filter) {
	return {
		type: 'ADD_SEARCH_FILTER',
		payload: filter
	}
}

export function removeSearchFilter(filter) {
	return {
		type: 'REMOVE_SEARCH_FILTER',
		payload: filter
	}
}

export function addSortFilter(filter) {
	return {
		type: 'ADD_SORT_FILTER',
		payload: filter
	}
}


/**
 * SEARCH
 */
export function getSearchResults(term) {
	return {
		type: 'GET_SEARCH_RESULTS',
		payload: term
	}
}

export function gotSearchResults(url, results) {
	return {
		type: 'GOT_SEARCH_RESULTS',
		url,
		payload: results,
		receivedAt: Date.now()
	}
}
