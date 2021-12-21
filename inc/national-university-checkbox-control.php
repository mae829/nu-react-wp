<?php
/**
 * Multiple checkbox customize control class.
 */
class National_University_Checkbox_Control extends WP_Customize_Control {
	/**
	 * The type of customize control being rendered.
	 *
	 * @access public
	 * @var    string
	 */
	public $type = 'checkbox-multiple';

	/**
	 * Enqueue scripts/styles.
	 */
	public function enqueue() {
		wp_enqueue_script( 'nu-checkbox-control', NU_REACT_WP_DIR_URL . 'build/wp-customizer-checkbox-control.min.js', [ 'jquery' ], NU_REACT_WP_VERSION, true );
	}

	/**
	 * Displays the control content.
	 */
	public function render_content() {
		if ( empty( $this->choices ) ) {
			return;
		}

		if ( ! empty( $this->label ) ) {
			printf(
				'<label for="%s" class="customize-control-title">%s</label>',
				esc_attr( $this->id ),
				esc_html( $this->label )
			);
		}

		if ( ! empty( $this->description ) ) {
			printf( '<span class="description customize-control-description">%s</span>', esc_html( $this->description ) );
		}

		$list = ! is_array( $this->value() ) ? explode( ',', $this->value() ) : $this->value();

		echo '<div class="customize-control-checkbox-multiple-options">';

		foreach ( $this->choices as $value => $label ) {
			printf(
				'<label style="display:block;margin-bottom:5px;">' .
					'<input type="checkbox" value="%s" %s> %s' .
				'</label>',
				esc_attr( $value ),
				checked( in_array( (string) $value, $list, true ), true, false ),
				esc_html( $label )
			);
		}

		printf(
			'<input type="hidden" name="%s" value="%s" %s>',
			esc_attr( $this->id ),
			esc_attr( implode( ',', $list ) ),
			wp_kses_post( $this->get_link() )
		);

		echo '</div>';
	}

	/**
	 * Sanitizing utility helper function
	 *
	 * @param mixed $value Value to sanitize.
	 * @return mixed
	 */
	public static function sanitize_content( $value ) {
		$values = ( ! is_array( $value ) ? explode( ',', $value ) : $value );

		return ( ! empty( $values ) ? array_map( 'sanitize_text_field', $values ) : [] );
	}
}
