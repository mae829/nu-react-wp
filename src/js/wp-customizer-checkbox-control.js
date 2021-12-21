jQuery(document).ready(function($) {
	var $control = $('.customize-control-checkbox-multiple-options')

	$control.find('input[type="checkbox"]').on('click', function() {
		var checkbox_values = $control.find('input[type="checkbox"]:checked').map(function() {
			return this.value
		}).get().join(',')

		$control.find('input[type="hidden"]').val(checkbox_values).trigger('change')
	})
})
