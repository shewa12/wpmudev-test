<?php
/**
 * Google Drive test block.
 *
 * @link          https://wpmudev.com/
 * @since         1.0.0
 *
 * @author        WPMUDEV (https://wpmudev.com)
 * @package       WPMUDEV\PluginTest
 *
 * @copyright (c) 2025, Incsub (http://incsub.com)
 */

namespace WPMUDEV\PluginTest\App\Admin_Pages;

use WPMUDEV\PluginTest\Base;

defined( 'ABSPATH' ) || exit;

/**
 * Posts maintenance class
 */
class Posts_Maintenance extends Base {

	/**
	 * Page wrapper unique id
	 *
	 * @var string
	 */
	private $page_id = 'wpmudev_plugintest_post_maintenance_main_wrap';

	/**
	 * Register admin hooks
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function init() {
		add_action( 'admin_menu', array( $this, 'add_menu' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
	}

	/**
	 * Register menu page
	 *
	 * @return void
	 */
	public function add_menu() {
		add_menu_page(
			__( 'Posts Maintenance', 'wpmudev-plugin-test' ),
			__( 'Posts Maintenance', 'wpmudev-plugin-test' ),
			'manage_options',
			'posts-maintenance',
			array( $this, 'render' ),
			'dashicons-admin-tools',
			80
		);
	}

	/**
	 * Enqueue scripts for this page
	 *
	 * @since 1.0.0
	 *
	 * @param string $hook Page slug.
	 *
	 * @return void
	 */
	public function enqueue_assets( $hook ) {
		if ( 'toplevel_page_posts-maintenance' !== $hook ) {
			return;
		}

		$src_url  = trailingslashit( WPMUDEV_PLUGINTEST_ASSETS_URL ) . 'js/postsmaintenance.min.js';
		$src_path = WPMUDEV_PLUGINTEST_DIR . 'assets/js/postsmaintenance.min.js';

		wp_enqueue_script(
			'wpmudev-posts-maintenance',
			$src_url,
			array(
				'react',
				'wp-element',
				'wp-i18n',
			),
			filemtime( $src_path ),
			true
		);

		wp_localize_script(
			'wpmudev-posts-maintenance',
			'wpmudevPostsMaintenance',
			array(
				'pageId'  => $this->page_id,
				'restUrl' => rest_url( 'wpmudev/v1/posts-maintenance/scan' ),
				'nonce'   => wp_create_nonce( 'wp_rest' ),
			)
		);
	}

	/**
	 * View callback method
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function render() {
		?>
		<div class="wrap">
			<div id="<?php echo esc_attr( $this->page_id ); ?>"></div>
		</div>
		<?php
	}
}
