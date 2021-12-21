(function($) {
	var template = '$label <span data-tooltip="$tooltip"><span class="filter__info icon icon--question-circle"></span></span>'

	wp.customize(
		'degree_type_label',
		function(value) {
			value.bind(
				function(newval) {
					var	html = template.replace('$label', newval)
						.replace('$tooltip', wp.customize('degree_type_tooltip')._value)

					$('.filter__heading').eq(0).html(html)
				}
			)
		}
	)

	wp.customize(
		'degree_type_tooltip',
		function(value) {
			value.bind(
				function(newval) {
					var	html = template.replace('$label', wp.customize('degree_type_label')._value)
						.replace('$tooltip', newval)

					$('.filter__heading').eq(0).html(html)
				}
			)
		}
	)

	wp.customize(
		'area_of_study_label',
		function(value) {
			value.bind(
				function(newval) {
					var	html = template.replace('$label', newval)
						.replace('$tooltip', wp.customize('area_of_study_tooltip')._value)

					$('.filter__heading').eq(1).html(html)
				}
			)
		}
	)

	wp.customize(
		'area_of_study_tooltip',
		function(value) {
			value.bind(
				function(newval) {
					var	html = template.replace('$label', wp.customize('area_of_study_label')._value)
						.replace('$tooltip', newval)

					$('.filter__heading').eq(1).html(html)
				}
			)
		}
	)

	wp.customize(
		'class_format_label',
		function(value) {
			value.bind(
				function(newval) {
					var	html = template.replace('$label', newval)
						.replace('$tooltip', wp.customize('class_format_tooltip')._value)

					$('.filter__heading').eq(2).html(html)
				}
			)
		}
	)

	wp.customize(
		'class_format_tooltip',
		function(value) {
			value.bind(
				function(newval) {
					var	html = template.replace('$label', wp.customize('class_format_label')._value)
						.replace('$tooltip', newval)

					$('.filter__heading').eq(2).html(html)
				}
			)
		}
	)

})(jQuery)
