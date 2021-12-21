<?php
/**
 * Main React hooks functionality
 */

/**
 * National_University_React_WP class
 */
class National_University_React_WP {
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
		// front-end actions.
		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_assets' ] );
		add_action( 'script_loader_tag', [ $this, 'do_script_loader_tag' ], 10, 3 );

		// back-end actions.
		add_action( 'rest_api_init', [ $this, 'register_rest_api_routes' ] );
	}

	/**
	 * Enqueue Assets
	 *
	 * Enqueues the necessary css and js files when the theme is loaded.
	 */
	public function enqueue_assets() {
		global $post;
		$base = 'nu-react-wp/v' . NU_REACT_WP_VERSION;

		if ( is_page( 'program-finder' ) || has_shortcode( $post->post_content, 'program-finder' ) ) {
			wp_enqueue_script( 'nu-react-wp-program-finder', NU_REACT_WP_DIR_URL . 'build/program-finder.min.js', [ 'jquery' ], filemtime( NU_REACT_WP_DIR_URI . 'build/program-finder.min.js' ), true );
		}

		if ( is_page( 'location-landing' ) ) {
			wp_enqueue_script( 'nu-react-wp-locations', NU_REACT_WP_DIR_URL . 'build/locations.min.js', [ 'jquery' ], filemtime( NU_REACT_WP_DIR_URI . 'build/locations.min.js' ), true );
		}

		wp_enqueue_script( 'nu-react-wp-search', NU_REACT_WP_DIR_URL . 'build/search.min.js', [ 'jquery' ], filemtime( NU_REACT_WP_DIR_URI . 'build/search.min.js' ), true );

		wp_localize_script(
			'nu-react-wp-program-finder',
			'nu_react_wp_program_finder',
			[
				'filters'      => rest_url( "{$base}/program-finder/filters" ),
				'programs'     => rest_url( "{$base}/program-finder/programs" ),
				'query_params' => $this->_generate_program_finder_query_params(),
			]
		);

		wp_localize_script(
			'nu-react-wp-locations',
			'nu_react_wp_locations',
			[
				'locations'    => rest_url( "{$base}/locations" ),
				'regions'      => rest_url( "{$base}/locations/regions" ),
				'query_params' => $this->_generate_locations_query_params(),
			]
		);

		wp_localize_script(
			'nu-react-wp-search',
			'nu_react_wp_search',
			[
				'search' => rest_url( "{$base}/search?term=%s" ),
			]
		);
	}

	/**
	 * Do Script Loader Tag
	 * - For organization purposes, this only handles this plugin's scripts.
	 *   Each plugin should handle their own scripts loading.
	 *
	 * Allows enqueued scripts to be loaded asynchronously, thus preventing the
	 * page from being blocked by js calls.
	 *
	 * @param  string $tag    The <script> tag for the enqueued script.
	 * @param  string $handle The script's registered handle.
	 * @param  string $src    The script's source URL.
	 *
	 * @return string The formatted HTML script tag of the given enqueued script.
	 */
	public function do_script_loader_tag( $tag, $handle, $src ) {
		// The handles of the enqueued scripts we want to async.
		$async_scripts = [
			'nu-react-wp-program-finder',
			'nu-react-wp-locations',
		];
		if ( in_array( $handle, $async_scripts, true ) ) {
			return str_replace( ' src', ' async="async" src', $tag );
		}

		// the handles of the enqueued scripts we want to defer.
		$defer_scripts = [
			'nu-react-wp-search',
		];
		if ( in_array( $handle, $defer_scripts, true ) ) {
			return str_replace( ' src', ' defer="defer" src', $tag );
		}

		return $tag;
	}

	/**
	 * Register REST API Routes
	 *
	 * Adds custom WP API endpoints to the routes table.
	 */
	public function register_rest_api_routes() {
		$namespace = 'nu-react-wp/v' . NU_REACT_WP_VERSION;

		register_rest_route( $namespace, '/locations', [
			[
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => [ $this, 'get_locations' ],
				'permission_callback' => '__return_true',
				'args'                => [],
			],
		] );

		register_rest_route( $namespace, '/locations/regions', [
			[
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => [ $this, 'get_regions' ],
				'permission_callback' => '__return_true',
				'args'                => [],
			],
		] );

		register_rest_route( $namespace, '/program-finder/filters', [
			[
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => [ $this, 'get_program_finder_filters' ],
				'permission_callback' => '__return_true',
				'args'                => [],
			],
		] );

		register_rest_route( $namespace, '/program-finder/programs', [
			[
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => [ $this, 'get_program_finder_programs' ],
				'permission_callback' => '__return_true',
				'args'                => [],
			],
		] );

		register_rest_route( $namespace, '/search', [
			[
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => [ $this, 'get_search_results' ],
				'permission_callback' => '__return_true',
				'args'                => [],
			],
		] );
	}

	/**
	 * Get Program Finder Filters
	 *
	 * Retrieves all available filters and returns the data as a JSON object.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_program_finder_filters( $request = null ) {
		$taxonomies = get_object_taxonomies( 'program', 'output' );

		if ( empty( $taxonomies ) ) {
			return null;
		}

		$response = [];

		$map = [
			'degree-type',
			'area-of-study',
			'class-format',
		];

		foreach ( $taxonomies as $taxonomy ) {
			// whitelist returned taxonomies.
			$index = array_search( $taxonomy->name, $map, true );

			if ( false === $index ) {
				continue;
			}

			$term_options = [
				'hide_empty' => false,
				'orderby'    => 'description',
				'order'      => 'ASC',
			];

			// apply whitelist functionality to available degree types.
			if ( 'degree-type' === $taxonomy->name ) {
				$term_options['include'] = $this->_get_theme_mod( 'degree_type_whitelist' );
			}

			$_terms = get_terms(
				$taxonomy->name,
				$term_options
			);

			$terms = [];

			foreach ( $_terms as $term ) {
				$terms[] = [
					'term_id'   => $term->term_id,
					'name'      => html_entity_decode( $term->name ),
					'slug'      => $term->slug,
					'taxonomy'  => $term->taxonomy,
					'isChecked' => (
						! empty( $_REQUEST['filter'] ) &&
						! empty( $_REQUEST['filter'][ $taxonomy->name ] ) &&
						strpos( $_REQUEST['filter'][ $taxonomy->name ], $term->slug ) !== false
					),
				];
			}

			$theme_mod = str_replace( '-', '_', $taxonomy->name );

			$response[ $index ] = [
				'taxonomy' => $taxonomy->name,
				'terms'    => $terms,
				'heading'  => $this->_get_theme_mod( "{$theme_mod}_label" ),
				'tooltip'  => $this->_get_theme_mod( "{$theme_mod}_tooltip" ),
			];
		}

		ksort( $response );

		return new WP_REST_Response( $response, 200 );
	}

	/**
	 * Get Program Finder Programs
	 *
	 * Retrieves all available Programs and returns the data as a JSON object.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_program_finder_programs( $request = null ) {
		parse_str( $_SERVER['QUERY_STRING'], $params );

		$programs = $this->_get_programs( $params, $request );

		if ( isset( $params['sort']['class-format'] ) ) {
			$response = $this->_sort_programs_by_class_format( $programs, $params['sort']['class-format'] );
		} elseif ( isset( $params['sort']['degree-type'] ) ) {
			$response = $this->_sort_programs_by_degree_type( $programs );
		} else {
			$response = $this->_sort_programs_by_area_of_study( $programs );
		}

		return new WP_REST_Response( $response, 200 );
	}

	/**
	 * Get Locations
	 *
	 * Retrieves all available locations and returns the data as a JSON object.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_locations( $request = null ) {
		return new WP_REST_Response( $this->_get_locations(), 200 );
	}

	/**
	 * Get Regions
	 *
	 * Retrieves all available regions and returns the data as a JSON object.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_regions( $request = null ) {
		$response = [];

		$terms = get_terms(
			[
				'taxonomy' => 'region',
			]
		);

		if ( is_wp_error( $terms ) ) {
			return false;
		}

		if ( ! empty( $terms ) ) {
			foreach ( $terms as $term ) {
				$response[] = [
					'id'     => $term->term_id,
					'slug'   => $term->slug,
					'name'   => $term->name,
					'active' => ( ! empty( $_REQUEST['region'] ) && $_REQUEST['region'] === $term->slug ),
				];
			}
		}

		return new WP_REST_Response( $response, 200 );
	}

	/**
	 * Get Search Results
	 *
	 * Queries the database with the given term and returns the data as a JSON object.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_search_results( $request = null ) {
		parse_str( $_SERVER['QUERY_STRING'], $params );

		return new WP_REST_Response( $this->_query_wordpress_search( $params ), 200 );
	}

	/**
	 * Generate Query Params for Program Finder functionality
	 *
	 * Converts the requested URL parameters into a react-friendly filters object.
	 */
	private function _generate_program_finder_query_params() {
		$params = [
			'filters'    => [],
			'searchTerm' => '',
			'sort'       => [
				'key'   => '',
				'value' => '',
			],
		];

		if ( ! empty( $_REQUEST['filter'] ) ) {
			$filters = [];

			foreach ( $_REQUEST['filter'] as $key => $terms ) {
				foreach ( explode( ',', $terms ) as $term ) {
					$filters[] = [
						'key'   => $key,
						'value' => $term,
					];
				}
			}

			$params['filters'] = $filters;
		}

		if ( ! empty( $_REQUEST['sort'] ) ) {
			$sort           = reset( $_REQUEST['sort'] );
			$params['sort'] = [
				'key'   => $sort,
				'value' => $sort,
			];
		}

		return $params;
	}

	/**
	 * Generate Query Params for Locations functionality
	 *
	 * Converts the requested URL parameters into a react-friendly filters object.
	 */
	private function _generate_locations_query_params() {
		$params = [
			'filters'    => [],
			'searchTerm' => '',
			'sort'       => [
				'key'   => '',
				'value' => '',
			],
		];

		if ( ! empty( $_REQUEST['search'] ) ) {
			$params['filters']['search'] = sanitize_text_field( $_REQUEST['search'] ); // input var ok.
		}

		if ( ! empty( $_REQUEST['region'] ) ) {
			$params['filters']['region'] = sanitize_text_field( $_REQUEST['region'] ); // input var ok.
		}

		if ( ! empty( $_REQUEST['location_id'] ) ) {
			$params['filters']['location'] = sanitize_text_field( $_REQUEST['location_id'] ); // input var ok.
		}

		return $params;
	}

	/**
	 * Get Theme Mod
	 *
	 * Returns the defined or default value for the given theme modification setting.
	 *
	 * @param string $mod The WP theme mod to fetch.
	 */
	private function _get_theme_mod( $mod = null ) {
		$value = get_theme_mod( $mod );

		return ( ! empty( $value ) ? $value : National_University_React_WP_Config::$$mod );
	}

	/**
	 * Get Programs
	 *
	 * Queries the database for all programs matching the given criteria.
	 *
	 * @param array           $params  WP_Query parameters.
	 * @param WP_REST_Request $request The original REST API request.
	 */
	private function _get_programs( $params = [], $request ) {
		global $post;

		$args = [
			'post_type'              => 'program',
			'posts_per_page'         => 300,
			'orderby'                => 'title',
			'order'                  => 'ASC',
			'no_found_rows'          => true,
			'update_post_meta_cache' => false,
		];

		// Area of Study.
		if ( ! empty( $params['filter']['area-of-study'] ) ) {

			if ( empty( $args['tax_query'] ) ) {
				$args['tax_query'] = [];
			}

			$areas_of_study = explode( ',', $params['filter']['area-of-study'] );

			$args['tax_query'][] =
				[
					'taxonomy' => 'area-of-study',
					'field'    => 'slug',
					'terms'    => $areas_of_study,
					'operator' => 'IN',
				];

		} else {
			$areas_of_study = null;
		}

		// Class Format.
		if ( ! empty( $params['filter']['class-format'] ) ) {

			if ( empty( $args['tax_query'] ) ) {
				$args['tax_query'] = [];
			}

			$class_formats = explode( ',', $params['filter']['class-format'] );

			$args['tax_query'][] = [
				'taxonomy' => 'class-format',
				'field'    => 'slug',
				'terms'    => $class_formats,
				'operator' => 'IN',
			];

		} else {
			$class_formats = null;
		}

		// College.
		if ( ! empty( $params['filter']['college'] ) ) {

			if ( empty( $args['tax_query'] ) ) {
				$args['tax_query'] = [];
			}

			$colleges = explode( ',', $params['filter']['college'] );

			$args['tax_query'][] = [
				'taxonomy' => 'college',
				'field'    => 'slug',
				'terms'    => $colleges,
				'operator' => 'IN',
			];

		} else {
			$colleges = null;
		}

		// Degree Type.
		if ( ! empty( $params['filter']['degree-type'] ) ) {

			if ( empty( $args['tax_query'] ) ) {
				$args['tax_query'] = [];
			}

			$degree_types = explode( ',', $params['filter']['degree-type'] );

			$args['tax_query'][] = [
				'taxonomy' => 'degree-type',
				'field'    => 'slug',
				'terms'    => $degree_types,
				'operator' => 'IN',
			];

		} else {
			$degree_types = null;
		}

		if ( ! empty( $params['tax_query'] ) && count( $params['tax_query'] ) > 1 ) {
			$args['tax_query']['relation'] = 'AND';
		}

		// Text Search.
		if ( ! empty( $params['filter']['search'] ) ) {
			$args['s'] = $params['filter']['search'];
		}

		$programs = [];

		$query = new WP_Query( $args );

		if ( $query->have_posts() ) {

			while ( $query->have_posts() ) {

				$query->the_post();

				$program = [
					'id'          => $post->ID,
					'title'       => wp_strip_all_tags( $post->post_title ),
					'permalink'   => get_permalink( $post->ID ),
					'excerpt'     => get_the_excerpt(),
					'areaOfStudy' => $this->_get_program_area_of_study( $post, $areas_of_study ),
					'classFormat' => $this->_get_program_class_format( $post, $class_formats ),
					'college'     => $this->_get_program_college( $post, $colleges ),
					'degreeType'  => $this->_get_program_degree_type( $post, $degree_types ),
				];

				$programs[] = $program;
			}

			wp_reset_postdata();
		}

		$programs = apply_filters( 'nu_react_wp_program_finder_programs', $programs, $request );

		return $this->_sort_programs_by_title( $programs );
	}

	/**
	 * Get Program Area of Study
	 *
	 * Gets all the associated 'Area of Study' terms associated with the given program.
	 *
	 * @param WP_Post $program Program we want to fetch taxonomy for.
	 * @param array   $areas_of_study The areas of study.
	 */
	private function _get_program_area_of_study( $program = null, $areas_of_study = [] ) {
		$terms = wp_get_post_terms( $program->ID, 'area-of-study' );

		if ( is_wp_error( $terms ) ) {
			return false;
		}

		// assert only white listed terms are displayed.
		if ( ! empty( $areas_of_study ) ) {
			foreach ( $terms as $i => $term ) {
				if ( ! in_array( $term->slug, $areas_of_study, true ) ) {
					unset( $terms[ $i ] );
				}
			}
		}

		return $terms;
	}

	/**
	 * Get Program Class Format
	 *
	 * Gets all the associated 'Class Format' terms associated with the given program.
	 *
	 * @param WP_Post $program Program we want to fetch taxonomy for.
	 * @param array   $class_formats The terms list based on the class-format taxonomy.
	 */
	private function _get_program_class_format( $program = null, $class_formats = [] ) {
		$terms = wp_get_post_terms( $program->ID, 'class-format' );

		if ( is_wp_error( $terms ) ) {
			return false;
		}

		/*
		// assert only whitelisted terms are displayed.
		if ( ! empty( $class_formats ) ) {
			foreach( $terms as $i => $term ) {
				if ( ! in_array( $term->slug, $class_formats ) ) {
					unset( $terms[$i] );
				}
			}
		}
		*/

		return $terms;
	}

	/**
	 * Get Program College
	 *
	 * Gets all the associated 'College' terms associated with the given program.
	 *
	 * @param WP_Post $program Program we want to fetch cpt for.
	 * @param array   $colleges List of colleges to filter by.
	 */
	private function _get_program_college( $program = null, $colleges = [] ) {
		$terms = wp_get_post_terms( $program->ID, 'college' );

		if ( is_wp_error( $terms ) ) {
			return false;
		}

		// assert only white listed terms are displayed.
		if ( ! empty( $colleges ) ) {
			foreach ( $terms as $i => $term ) {
				if ( ! in_array( $term->slug, $colleges, true ) ) {
					unset( $terms[ $i ] );
				}
			}
		}

		return $terms;
	}

	/**
	 * Get Program Degree Type
	 *
	 * Gets all the associated 'Degree Type' terms associated with the given program.
	 *
	 * @param WP_Post $program Program we want to fetch terms for.
	 * @param array   $degree_types Degree types to filter by.
	 */
	private function _get_program_degree_type( $program = null, $degree_types = [] ) {
		$terms = wp_get_post_terms( $program->ID, 'degree-type' );

		if ( is_wp_error( $terms ) ) {
			return false;
		}

		// assert only white listed terms are displayed.
		if ( ! empty( $degree_types ) ) {

			foreach ( $terms as $i => $term ) {
				if ( ! in_array( $term->slug, $degree_types, true ) ) {
					unset( $terms[ $i ] );
				}
			}
		} else {

			$degree_types = $this->_get_theme_mod( 'degree_type_whitelist' );
			$degree_types = array_map( 'intval', $degree_types );

			foreach ( $terms as $i => $term ) {
				if ( ! in_array( $term->term_id, $degree_types, true ) ) {
					unset( $terms[ $i ] );
				}
			}
		}

		return $terms;
	}

	/**
	 * Query WordPress Search
	 *
	 * Queries the database for all programs matching the given criteria.
	 *
	 * @param array $params WP_Query params.
	 */
	private function _query_wordpress_search( $params = [] ) {
		global $post;

		$results = [];

		if ( empty( $params['term'] ) ) {
			return $results;
		}

		$args = [
			'post_type'      => 'any',
			'post_status'    => 'publish',
			'posts_per_page' => 5,
			's'              => sanitize_text_field( $params['term'] ),
		];

		$query = new WP_Query( $args );

		if ( $query->have_posts() ) {
			while ( $query->have_posts() ) {
				$query->the_post();

				if ( 'yes' === get_post_meta( get_the_ID(), 'teachout', true ) ) {
					continue;
				}

				$result = [
					'id'        => $post->ID,
					'title'     => $post->post_title,
					'permalink' => get_permalink( $post->ID ),
					'excerpt'   => wp_strip_all_tags( get_the_excerpt() ),
				];

				$results[] = $result;
			}

			wp_reset_postdata();
		}

		return [
			'results'      => $results,
			'totalResults' => $query->found_posts,
		];
	}

	/**
	 * Utility function to sort programs alphabetically by array key "title"
	 *
	 * @param array $programs Programs to sort.
	 *
	 * @return array
	 */
	private function _sort_programs_by_title( $programs = [] ) {
		usort( $programs, function( $a, $b ) {
			return strcmp( $a['title'], $b['title'] );
		} );

		return $programs;
	}

	/**
	 * Sort Programs by Area of Study
	 *
	 * Groups all the given programs by their associated 'Area of Study'.
	 *
	 * @param array $programs Programs to sort.
	 */
	private function _sort_programs_by_area_of_study( $programs = [] ) {
		$results = [];

		foreach ( $programs as $program ) {

			foreach ( $program['areaOfStudy'] as $area_of_study ) {

				if ( ! isset( $results[ $area_of_study->slug ] ) ) {

					$area_of_study->name = html_entity_decode( $area_of_study->name );

					$results[ $area_of_study->slug ] = [
						'id'            => $area_of_study->term_id,
						'term'          => $area_of_study,
						'programs'      => [],
						'totalPrograms' => 0,
					];
				}

				$results[ $area_of_study->slug ]['programs'][] = [
					'id'          => $program['id'],
					'title'       => $program['title'],
					'permalink'   => $program['permalink'],
					'excerpt'     => $program['excerpt'],
					'classFormat' => $program['classFormat'],
				];

				// Update term program total.
				$results[ $area_of_study->slug ]['totalPrograms']++;
			}
		}

		// order results by user-defined order.
		$results = $this->_sort_programs_by_taxonomy_description( $results );

		$response = [
			[
				'results'       => $results,
				'totalPrograms' => count( $programs ),
			],
		];

		return $response;
	}

	/**
	 * Sort Programs by Class Format
	 *
	 * Groups all the given programs by their associated 'Class Format'.
	 *
	 * @param array $programs Programs to sort by class format.
	 */
	private function _sort_programs_by_class_format( $programs = [] ) {
		$results = [];

		foreach ( $programs as $program ) {

			foreach ( $program['classFormat'] as $class_format ) {

				if ( ! isset( $results[ $class_format->slug ] ) ) {

					$results[ $class_format->slug ] = [
						'id'            => $class_format->term_id,
						'term'          => $class_format,
						'programs'      => [],
						'totalPrograms' => 0,
					];
				}

				$results[ $class_format->slug ]['programs'][] = [
					'id'          => $program['id'],
					'title'       => $program['title'],
					'permalink'   => $program['permalink'],
					'excerpt'     => $program['excerpt'],
					'classFormat' => $program['classFormat'],
				];

				// Update term program total.
				$results[ $class_format->slug ]['totalPrograms']++;
			}
		}

		// order results by user-defined order.
		$results = $this->_sort_programs_by_taxonomy_description( $results );

		$response = [
			[
				'results'       => $results,
				'totalPrograms' => count( $programs ),
			],
		];

		return $response;
	}

	/**
	 * Sort Programs by Degree Type
	 *
	 * Groups all the given programs by their associated 'Degree Type'.
	 *
	 * @param array $programs Programs to sort.
	 */
	private function _sort_programs_by_degree_type( $programs = [] ) {
		$results = [];

		foreach ( $programs as $program ) {

			foreach ( $program['degreeType'] as $degree_type ) {

				if ( ! isset( $results[ $degree_type->slug ] ) ) {

					$results[ $degree_type->slug ] = [
						'id'            => $degree_type->term_id,
						'term'          => $degree_type,
						'programs'      => [],
						'totalPrograms' => 0,
					];
				}

				$results[ $degree_type->slug ]['programs'][] = [
					'id'          => $program['id'],
					'title'       => $program['title'],
					'permalink'   => $program['permalink'],
					'excerpt'     => $program['excerpt'],
					'classFormat' => $program['classFormat'],
				];

				// Update term program total.
				$results[ $degree_type->slug ]['totalPrograms']++;
			}
		}

		// order results by user-defined order.
		$results = $this->_sort_programs_by_taxonomy_description( $results );

		$response = [
			[
				'results'       => $results,
				'totalPrograms' => count( $programs ),
			],
		];

		return $response;
	}

	/**
	 * Sort Programs by Taxonomy Description
	 *
	 * Sorts the given programs object by the description of each top-level term group.
	 *
	 * @param array $programs Programs to sort.
	 */
	private function _sort_programs_by_taxonomy_description( $programs = [] ) {
		usort(
			$programs,
			function( $a, $b ) {

				if ( empty( $a['term']->description ) || empty( $b['term']->description ) ) {
					return 0;
				}

				if ( $a['term']->description === $b['term']->description ) {
					return 0;
				}

				return ( $a['term']->description < $b['term']->description ? -1 : 1 );
			}
		);

		return $programs;
	}

	/**
	 * Get Locations
	 *
	 * Queries the database for all locations matching the given criteria.
	 *
	 * @param array $params Paramters to use to filter by.
	 */
	private function _get_locations( $params = [] ) {
		global $post;

		$args = [
			'post_type'      => 'location',
			'posts_per_page' => 100,
			'order'          => 'ASC',
		];

		// Location Type.
		if ( ! empty( $params['filter']['location-type'] ) ) {

			if ( empty( $args['tax_query'] ) ) {
				$args['tax_query'] = [];
			}

			$location_types = explode( ',', $params['filter']['location-type'] );

			$args['tax_query'][] =
				[
					'taxonomy' => 'location-type',
					'field'    => 'slug',
					'terms'    => $location_types,
					'operator' => 'IN',
				];

		} else {
			$location_types = null;
		}

		// Regions.
		if ( ! empty( $params['filter']['region'] ) ) {

			if ( empty( $args['tax_query'] ) ) {
				$args['tax_query'] = [];
			}

			$regions = explode( ',', $params['filter']['region'] );

			$args['tax_query'][] = [
				'taxonomy' => 'region',
				'field'    => 'slug',
				'terms'    => $regions,
				'operator' => 'IN',
			];

		} else {
			$regions = null;
		}

		if ( ! empty( $params['tax_query'] ) && count( $params['tax_query'] ) > 1 ) {
			$args['tax_query']['relation'] = 'AND';
		}

		// Text Search.
		if ( ! empty( $params['filter']['search'] ) ) {
			$args['s'] = $params['filter']['search'];
		}

		$locations = [];

		$query = new WP_Query( $args );

		if ( $query->have_posts() ) {

			while ( $query->have_posts() ) {

				$query->the_post();

				$location = [
					'id'           => $post->ID,
					'title'        => html_entity_decode( $post->post_title ),
					'permalink'    => get_permalink( $post->ID ),
					'locationType' => $this->_get_location_types( $post, $location_types ),
					'region'       => $this->_get_location_regions( $post, $regions ),
					'mapIcon'      => '',
					'address'      => [
						'complete'       => '',
						'streetAddress'  => '',
						'streetAddress2' => '',
						'city'           => '',
						'state'          => '',
						'zipCode'        => '',
					],
					'thumbnail'    => '',
					'coordinates'  => [
						'lat' => '',
						'lng' => '',
					],
					'active'       => (
						! empty( $_REQUEST['location_id'] ) &&
						$_REQUEST['location_id'] === $post->ID
					),
				];

				$meta = get_post_meta( $post->ID );

				if ( ! empty( $meta['map-icon'] ) ) {
					$location['mapIcon'] = $meta['map-icon'][0];
				}

				if ( ! empty( $meta['street-address'] ) ) {
					$location['address']['complete']      = $meta['street-address'][0] . ' ';
					$location['address']['streetAddress'] = $meta['street-address'][0];
				}

				if ( ! empty( $meta['street-address-2'] ) ) {
					$location['address']['complete']       .= $meta['street-address-2'][0] . ' ';
					$location['address']['streetAddress2'] .= $meta['street-address-2'][0];
				}

				if ( ! empty( $meta['city'] ) ) {
					$location['address']['complete'] .= $meta['city'][0] . ' ';
					$location['address']['city']     .= $meta['city'][0];
				}

				if ( ! empty( $meta['state'] ) ) {
					$location['address']['complete'] .= $meta['state'][0] . ' ';
					$location['address']['state']    .= $meta['state'][0];
				}

				if ( ! empty( $meta['zip-code'] ) ) {
					$location['address']['complete'] .= $meta['zip-code'][0];
					$location['address']['complete']  = trim( $location['address']['complete'] );

					$location['address']['zipCode'] .= $meta['zip-code'][0];
				}

				if ( ! empty( $meta['latitude'] ) ) {
					$location['coordinates']['lat'] = $meta['latitude'][0];
				}

				if ( ! empty( $meta['longitude'] ) ) {
					$location['coordinates']['lng'] = $meta['longitude'][0];
				}

				if ( has_post_thumbnail( $post->ID ) ) {
					$location['thumbnail'] = get_the_post_thumbnail_url( $post->ID );
				}

				$locations[] = $location;
			}

			wp_reset_postdata();
		}

		return $locations;
	}

	/**
	 * Get Location Types
	 *
	 * Gets all the associated 'Location Type' terms associated with the given location.
	 *
	 * @param WP_Post $location Single location.
	 * @param array   $location_types The category type of location.
	 */
	private function _get_location_types( $location = null, $location_types = [] ) {
		$terms    = wp_get_post_terms( $location->ID, 'location-type' );
		$response = [];

		if ( is_wp_error( $terms ) ) {
			return false;
		}

		// assert only whitelisted terms are displayed.
		if ( ! empty( $location_types ) ) {
			foreach ( $terms as $i => $term ) {
				if ( ! in_array( $term->slug, $location_types, true ) ) {
					unset( $terms[ $i ] );
				}
			}
		}

		if ( ! empty( $terms ) ) {
			foreach ( $terms as $term ) {
				$response[] = [
					'id'   => $term->slug,
					'slug' => $term->slug,
					'name' => $term->name,
				];
			}
		}

		return $response;
	}

	/**
	 * Get Location Regions
	 *
	 * Gets all the associated 'Region' terms associated with the given location.
	 *
	 * @param WP_Post $location Single location.
	 * @param array   $regions The category region.
	 */
	private function _get_location_regions( $location = null, $regions = [] ) {
		$terms    = wp_get_post_terms( $location->ID, 'region' );
		$response = [];

		if ( is_wp_error( $terms ) ) {
			return false;
		}

		// assert only white listed terms are displayed.
		if ( ! empty( $regions ) ) {
			foreach ( $terms as $i => $term ) {
				if ( ! in_array( $term->slug, $regions, true ) ) {
					unset( $terms[ $i ] );
				}
			}
		}

		if ( ! empty( $terms ) ) {
			foreach ( $terms as $term ) {
				$response[] = [
					'id'   => $term->term_id,
					'slug' => $term->slug,
					'name' => $term->name,
				];
			}
		}

		return $response;
	}
}
