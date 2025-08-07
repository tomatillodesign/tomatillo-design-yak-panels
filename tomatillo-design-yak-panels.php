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

/**
 * Register block + styles + scripts
 */
function yak_panels_register_block() {
	$plugin_dir = __DIR__;
	$plugin_url = plugin_dir_url( __FILE__ );

	// Register styles
	wp_register_style(
		'yak-panels-style',
		$plugin_url . 'block/style.css',
		[],
		filemtime( $plugin_dir . '/block/style.css' )
	);

	wp_register_style(
		'yak-panels-editor',
		$plugin_url . 'block/editor.css',
		[],
		filemtime( $plugin_dir . '/block/editor.css' )
	);

	// Register Gridstack CSS
	wp_register_style(
		'gridstack-css',
		'https://cdn.jsdelivr.net/npm/gridstack@12.2.2/dist/gridstack.min.css',
		[],
		'12.2.2'
	);

	// Register scripts
	wp_register_script(
		'gridstack-lib',
		'https://cdn.jsdelivr.net/npm/gridstack@12.2.2/dist/gridstack-all.min.js',
		[],
		'12.2.2',
		true
	);

	wp_register_script(
		'yak-panels-editor',
		$plugin_url . 'block/edit.js',
		[ 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components' ],
		filemtime( $plugin_dir . '/block/edit.js' ),
		true
	);

	// Register block with block.json
	register_block_type( $plugin_dir . '/block' );
}
add_action( 'init', 'yak_panels_register_block' );

/**
 * Frontend-only script loader
 */
add_action( 'wp_enqueue_scripts', function() {
	if ( has_block( 'yak/panels' ) ) {
		// Enqueue Gridstack + frontend layout handler
		wp_enqueue_script( 'gridstack-lib' );

		wp_enqueue_script(
			'yak-panels-frontend',
			plugins_url( 'block/yak-panels-frontend.js', __FILE__ ),
			[ 'gridstack-lib' ],
			filemtime( __DIR__ . '/block/yak-panels-frontend.js' ),
			true
		);

		// Enqueue frontend CSS (if not automatically handled)
		wp_enqueue_style( 'yak-panels-style' );

        // Enqueue Gridstack Extra (CSS Grid support)
        wp_register_style(
            'gridstack-extra-css',
            'https://cdn.jsdelivr.net/npm/gridstack@12.2.2/dist/gridstack-extra.min.css',
            [],
            '12.2.2'
        );
        wp_enqueue_style( 'gridstack-extra-css' );

	}
} );
