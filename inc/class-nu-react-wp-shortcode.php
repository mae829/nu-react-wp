<?php
/**
 * Shortcodes for plugin
 */

/**
 * NU_React_WP_Shortcode class
 */
class NU_React_WP_Shortcode {
	/**
	 * Instance of this class
	 *
	 * @var boolean
	 */
	public static $instance = false;

	/**
	 * Use class construct method to define all hooks
	 */
	public function __construct() {
		add_shortcode( 'program-finder', [ $this, 'build_program_finder' ] );
	}

	/**
	 * Singleton
	 *
	 * Returns a single instance of this class.
	 */
	public static function singleton() {
		if ( ! self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Undocumented function
	 *
	 * @param array $atts {
	 *     Array of default attributes.
	 *
	 *     @type string $filtersdisplay Which filters to display (taxonomies), if empty will show all filters.
	 *     @type string $presort        Predetermine the sort of the programs.
	 *     @type string $prefilters     Which, if any, filters should be used to prepopulate/prefilter the programs.
	 *                                  Make sure to use an online serializer to convert JSON data for the `prefilters` attribute.
	 *                                  Example: a:3:{s:11:"degree-type";a:2:{i:0;s:10:"associates";i:1;s:9:"bachelors";}s:13:"area-of-study";a:1:{i:0;s:22:"teaching_and_education";}s:12:"class-format";a:1:{i:0;s:6:"online";}}.
	 * }
	 * @return string HTML content to display.
	 */
	public function build_program_finder( $atts ) {
		$atts = shortcode_atts( [
			'filtersdisplay' => null,
			'presort'        => null,
			'prefilters'     => null,
		], $atts );

		$prefilters = maybe_unserialize( $atts['prefilters'] );
		$prefilters = wp_json_encode( $prefilters );

		$filtersdisplay_attribute = ! empty( $atts['filtersdisplay'] ) ? ' data-filtersdisplay="' . esc_attr( $atts['filtersdisplay'] ) . '"' : '';
		$presort_attribute        = ! empty( $atts['presort'] ) && false !== $atts['presort'] ? ' data-presort=\'' . esc_attr( $atts['presort'] ) . '\'' : '';
		$prefilters_attribute     = ! empty( $atts['prefilters'] ) && false !== $prefilters ? ' data-prefilters=\'' . esc_attr( $prefilters ) . '\'' : '';

		ob_start();
		?>

		<div class="js-program-finder-filters" aria-label="filter"<?php echo $filtersdisplay_attribute; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>></div>
		<section class="program-finder__results results js-program-finder-programs"<?php echo $presort_attribute . $prefilters_attribute; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>></section>

		<?php
		return ob_get_clean();
	}
}
