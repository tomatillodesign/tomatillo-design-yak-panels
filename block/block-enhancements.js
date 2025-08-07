document.addEventListener('DOMContentLoaded', () => {
	console.log('🟡 Yak Panels: DOMContentLoaded fired, waiting 500ms before initializing GridStack...');

	setTimeout(() => {
		const panelRoot = document.querySelector('.yak-panels-block');
		if (!panelRoot) {
			console.warn('❌ Yak Panels: .yak-panels-block not found in DOM.');
			return;
		}

		console.log('✅ Yak Panels: .yak-panels-block found:', panelRoot);

		// GridStack must be globally available
		if (!window.GridStack) {
			console.error('❌ Yak Panels: GridStack library not loaded on window.');
			return;
		}

		// Locate the actual editable layout area (InnerBlocks container)
		const layout = panelRoot.querySelector('.block-editor-block-list__layout');
		if (!layout) {
			console.warn('❌ Yak Panels: Could not find .block-editor-block-list__layout inside Yak Panels block.');
			return;
		}

		const columnCount = parseInt(panelRoot.dataset.columns) || 4;
		console.log(`⚙️ Yak Panels: Initializing GridStack with ${columnCount} columns`, layout);

		// If already initialized (e.g. hot reload), destroy first
		if (layout.gridstack) {
			console.log('♻️ Yak Panels: Existing GridStack instance found, destroying before re-init.');
			layout.gridstack.destroy(false);
		}

		const grid = GridStack.init({
			cellHeight: 150,
			column: columnCount,
			disableOneColumnMode: true,
			animate: true
		}, layout);

		console.log('✅ Yak Panels: GridStack successfully initialized', grid);
	}, 500);
});
