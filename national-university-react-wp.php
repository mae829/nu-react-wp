<?php
/**
 * NU React WP bootstrap file
 *
 * @wordpress-plugin
 * Plugin Name:       NU React WP
 * Plugin URI:        https://nu.edu/
 * Description:       Powers the Site Search and Program Finder components with React and the WordPress REST API
 * Version:           2.2.0
 * Author:            National University
 * Author URI:        https://www.nu.edu/
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       nu-react-wp
 */

if ( ! defined( 'WPINC' ) ) {
	die;
}

define( 'NU_REACT_WP_VERSION', '2.2.0' );
define( 'NU_REACT_WP_DIR_URL', plugin_dir_url( __FILE__ ) );
define( 'NU_REACT_WP_DIR_URI', plugin_dir_path( __FILE__ ) );

require NU_REACT_WP_DIR_URI . 'inc/class-nu-react-wp-shortcode.php';
require NU_REACT_WP_DIR_URI . 'inc/national-university-react-wp.php';
require NU_REACT_WP_DIR_URI . 'inc/national-university-react-wp-config.php';
require NU_REACT_WP_DIR_URI . 'inc/national-university-react-wp-customizer.php';

add_action( 'init', [ 'NU_React_WP_Shortcode', 'singleton' ] );
add_action( 'init', [ 'national_university_react_wp', 'singleton' ] );
add_action( 'init', [ 'National_University_React_WP_Customizer', 'singleton' ] );
add_action( 'customize_register', 'national_university_load_checkbox_customizer', 0 );

/**
 * Register customizer control.
 *
 * @return void
 */
function national_university_load_checkbox_customizer() {
	require NU_REACT_WP_DIR_URI . 'inc/national-university-checkbox-control.php';
}
