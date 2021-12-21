<?php
/**
 * WP Customizer setup to set up other functionality
 */

/**
 * National_University_React_WP_Customizer class
 */
class National_University_React_WP_Customizer {
	/**
	 * PLugin version
	 *
	 * @var string
	 */
	public $version;

	/**
	 * Instance of this class
	 *
	 * @var boolean
	 */
	public static $instance = false;

	/**
	 * Use class construct method to define all filters & actions
	 */
	public function __construct() {
		if ( defined( 'NU_REACT_WP_VERSION' ) ) {
			$this->version = NU_REACT_WP_VERSION;
		} else {
			$this->version = '1.0.0';
		}

		$this->add_actions();
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
	 * Add Actions
	 *
	 * Defines all the WordPress actions used by this theme.
	 */
	private function add_actions() {
		// back-end actions.
		add_action( 'customize_register', [ $this, 'add_customizer_program_finder_section' ] );
		add_action( 'customize_preview_init', [ $this, 'add_customizer_javascript' ] );
	}

	/**
	 * Add Customizer Program Finder Section
	 *
	 * Adds a "Program Finder" Section to the customizer to set the filter labels.
	 *
	 * @param WP_Customize_Manager $wp_customize WP customize builder object.
	 */
	public function add_customizer_program_finder_section( $wp_customize = null ) {
		$degree_types = [];

		$terms = get_terms(
			'degree-type',
			[
				'hide_empty' => false,
			]
		);

		foreach ( $terms as $term ) {
			$degree_types[ $term->term_id ] = $term->name;
		}

		// PROGRAM FINDER: SECTION.
		$wp_customize->add_section(
			'program_finder',
			[
				'title'    => __( 'Program Finder', 'national-university' ),
				'priority' => 120,
			]
		);

		// DEGREE TYPE.
		$wp_customize->add_setting(
			'degree_type_label',
			[
				'default'   => National_University_React_WP_Config::$degree_type_label,
				'transport' => 'postMessage',
			]
		);

		$wp_customize->add_control(
			new WP_Customize_Control(
				$wp_customize,
				'degree_type_label',
				[
					'label'    => __( 'Degree Type Label', 'national-university' ),
					'section'  => 'program_finder',
					'settings' => 'degree_type_label',
				]
			)
		);

		$wp_customize->add_setting(
			'degree_type_tooltip',
			[
				'default'   => National_University_React_WP_Config::$degree_type_tooltip,
				'transport' => 'postMessage',
			]
		);

		$wp_customize->add_control(
			new WP_Customize_Control(
				$wp_customize,
				'degree_type_tooltip',
				[
					'label'    => __( 'Degree Type Tooltip', 'national-university' ),
					'section'  => 'program_finder',
					'settings' => 'degree_type_tooltip',
					'type'     => 'textarea',
				]
			)
		);

		$wp_customize->add_setting(
			'degree_type_whitelist',
			[
				'default'           => National_University_React_WP_Config::$degree_type_whitelist,
				'sanitize_callback' => [ 'National_University_Checkbox_Control', 'sanitize_content' ],
				'transport'         => 'postMessage',
			]
		);

		$wp_customize->add_control(
			new National_University_Checkbox_Control(
				$wp_customize,
				'degree_type_whitelist',
				[
					'label'       => __( 'Degree Types', 'national-university' ),
					'section'     => 'program_finder',
					'description' => 'Select the degree types to display in the program finder',
					'settings'    => 'degree_type_whitelist',
					'type'        => 'checkbox-multiple',
					'choices'     => $degree_types,
				]
			)
		);

		// AREA OF STUDY.
		$wp_customize->add_setting(
			'area_of_study_label',
			[
				'default'   => National_University_React_WP_Config::$area_of_study_label,
				'transport' => 'postMessage',
			]
		);

		$wp_customize->add_control(
			new WP_Customize_Control(
				$wp_customize,
				'area_of_study_label',
				[
					'label'    => __( 'Area of Study Label', 'national-university' ),
					'section'  => 'program_finder',
					'settings' => 'area_of_study_label',
				]
			)
		);

		$wp_customize->add_setting(
			'area_of_study_tooltip',
			[
				'default'   => National_University_React_WP_Config::$area_of_study_tooltip,
				'transport' => 'postMessage',
			]
		);

		$wp_customize->add_control(
			new WP_Customize_Control(
				$wp_customize,
				'area_of_study_tooltip',
				[
					'label'    => __( 'Area of Study Tooltip', 'national-university' ),
					'section'  => 'program_finder',
					'settings' => 'area_of_study_tooltip',
					'type'     => 'textarea',
				]
			)
		);

		// CLASS FORMAT.
		$wp_customize->add_setting(
			'class_format_label',
			[
				'default'   => National_University_React_WP_Config::$class_format_label,
				'transport' => 'postMessage',
			]
		);

		$wp_customize->add_control(
			new WP_Customize_Control(
				$wp_customize,
				'class_format_label',
				[
					'label'    => __( 'Class Format Label', 'national-university' ),
					'section'  => 'program_finder',
					'settings' => 'class_format_label',
				]
			)
		);

		$wp_customize->add_setting(
			'class_format_tooltip',
			[
				'default'   => National_University_React_WP_Config::$class_format_tooltip,
				'transport' => 'postMessage',
			]
		);

		$wp_customize->add_control(
			new WP_Customize_Control(
				$wp_customize,
				'class_format_tooltip',
				[
					'label'    => __( 'Class Format Tooltip', 'national-university' ),
					'section'  => 'program_finder',
					'settings' => 'class_format_tooltip',
					'type'     => 'textarea',
				]
			)
		);
	}

	/**
	 * Add Customizer Javascript
	 *
	 * Adds the javascript logic required to power customizer updates.
	 */
	public function add_customizer_javascript() {
		wp_enqueue_script(
			'nu-react-wp-customizer',
			NU_REACT_WP_DIR_URL . 'build/wp-customizer.min.js',
			[ 'jquery', 'customize-preview' ],
			$this->version,
			true
		);
	}
}
