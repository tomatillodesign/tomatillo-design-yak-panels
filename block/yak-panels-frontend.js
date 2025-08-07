document.addEventListener('DOMContentLoaded', () => {
	const grids = document.querySelectorAll('.grid-stack');
	grids.forEach(grid => {
		if (window.GridStack && !grid.classList.contains('gridstack-initialized')) {
			const columnCount = parseInt(grid.dataset.columns) || 4;

			GridStack.init(
				{
					column: columnCount,
					cellHeight: 150,
					disableOneColumnMode: true,
					dragEnabled: false, // <-- disables drag on frontend
					resizable: { handles: '' }, // <-- disables resize
				},
				grid
			);
			console.log(`✅ GridStack initialized with ${columnCount} columns`);
		}
	});
});
