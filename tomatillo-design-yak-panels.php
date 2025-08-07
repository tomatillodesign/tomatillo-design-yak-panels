<?php
/**
 * Plugin Name: Tomatillo Design ~ Yak Panels
 * Description: A flexible, drag-and-drop layout block powered by Gridstack.js and InnerBlocks.
 * Author: Tomatillo Design
 * Version: 0.1.0
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * Text Domain: yak-panels
 */

defined( 'ABSPATH' ) || exit;

function yak_panels_register_blocks() {
	$plugin_dir = __DIR__;
	$plugin_url = plugin_dir_url( __FILE__ );

	// === Register Yak Panels assets ===
	wp_register_script(
		'yak-panels-editor',
		$plugin_url . 'block/yak-panels/edit.js',
		[ 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components' ],
		filemtime( $plugin_dir . '/block/yak-panels/edit.js' ),
		true
	);

    wp_register_script(
        'yak-panels-enhancements',
        $plugin_url . 'block/block-enhancements.js',
        [ 'gridstack-lib' ],
        filemtime( $plugin_dir . '/block/block-enhancements.js' ),
        true
    );

	wp_register_style(
		'yak-panels-editor',
		$plugin_url . 'block/yak-panels/editor.css',
		[],
		filemtime( $plugin_dir . '/block/yak-panels/editor.css' )
	);

	wp_register_style(
		'yak-panels-style',
		$plugin_url . 'block/yak-panels/style.css',
		[],
		filemtime( $plugin_dir . '/block/yak-panels/style.css' )
	);

	// === Gridstack core ===
	wp_register_script(
		'gridstack-lib',
		'https://cdn.jsdelivr.net/npm/gridstack@12.2.2/dist/gridstack-all.min.js',
		[],
		'12.2.2',
		true
	);

	wp_register_style(
		'gridstack-css',
		'https://cdn.jsdelivr.net/npm/gridstack@12.2.2/dist/gridstack.min.css',
		[],
		'12.2.2'
	);

	wp_register_style(
		'gridstack-extra-css',
		'https://cdn.jsdelivr.net/npm/gridstack@12.2.2/dist/gridstack-extra.min.css',
		[],
		'12.2.2'
	);

	// === Register blocks AFTER assets are registered ===
    //error_log( 'Registering yak/panels from: ' . $plugin_dir . '/block/yak-panels' );

    wp_register_script(
        'yak-panel-editor',
        $plugin_url . 'block/yak-panel/edit.js',
        [ 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components' ],
        filemtime( $plugin_dir . '/block/yak-panel/edit.js' ),
        true
    );

	register_block_type( $plugin_dir . '/block/yak-panel' );
	register_block_type( $plugin_dir . '/block/yak-panels' );

}
add_action( 'init', 'yak_panels_register_blocks' );





add_action( 'enqueue_block_editor_assets', function() {
	wp_enqueue_script( 'gridstack-lib' );
	wp_enqueue_style( 'gridstack-css' );
    wp_enqueue_style( 'gridstack-extra-css' );
    wp_enqueue_script( 'yak-panels-enhancements' );
} );

add_action( 'wp_enqueue_scripts', function() {
	if ( has_block( 'yak/panels' ) ) {
		wp_enqueue_script( 'gridstack-lib' );

		wp_enqueue_script(
			'yak-panels-frontend',
			plugins_url( 'block/yak-panels-frontend.js', __FILE__ ),
			[ 'gridstack-lib' ],
			filemtime( __DIR__ . '/block/yak-panels-frontend.js' ),
			true
		);

		wp_enqueue_style( 'gridstack-css' );
		wp_enqueue_style( 'gridstack-extra-css' );
	}
} );




add_action( 'init', function() {
	if ( function_exists( 'register_block_type' ) ) {
		$blocks = WP_Block_Type_Registry::get_instance()->get_all_registered();
		error_log( print_r( array_keys( $blocks ), true ) );
	}
} );