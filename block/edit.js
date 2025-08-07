wp.blocks.registerBlockType('yak/panels', {
	title: 'Yak Panels',
	category: 'layout',
	icon: 'grid-view',
	supports: {
		html: false,
		anchor: true,
		align: ['wide', 'full'],
	},
	attributes: {
		columns: {
			type: 'number',
			default: 4,
		}
	},

	edit({ attributes, setAttributes }) {
		const el = wp.element.createElement;
		const Fragment = wp.element.Fragment;
		const ref = wp.element.useRef();
		const useEffect = wp.element.useEffect;

		const columns = attributes.columns;

		useEffect(() => {
			if (ref.current && window.GridStack) {
				const grid = GridStack.init(
					{
						column: columns,
						cellHeight: 150,
						disableOneColumnMode: true,
					},
					ref.current
				);
				console.log(`✅ GridStack initialized with ${columns} columns`);

				return () => {
					grid.destroy(false);
				};
			}
		}, [columns]);

		return el(
			Fragment,
			null,
			el(
				wp.blockEditor.InspectorControls,
				null,
				el(
					wp.components.PanelBody,
					{ title: 'Panel Settings', initialOpen: true },
					el(wp.components.RangeControl, {
						label: 'Number of Columns',
						min: 1,
						max: 8,
						value: columns,
						onChange: (val) => setAttributes({ columns: val }),
					})
				)
			),
			el(
				'div',
				{
					ref,
					className: 'yak-panels-block grid-stack',
					'data-columns': columns,
				},
				el(
					'div',
					{
						className: 'grid-stack-item',
						'data-gs-x': 0,
						'data-gs-y': 0,
						'data-gs-width': 2,
						'data-gs-height': 1
					},
					el(
						'div',
						{ className: 'grid-stack-item-content' },
						el(wp.blockEditor.InnerBlocks)
					)
				)
			)
		);
	},

	save({ attributes }) {
		const el = wp.element.createElement;
		const columns = attributes.columns;

		return el(
			'div',
			{
				className: 'yak-panels-block grid-stack',
				'data-columns': columns,
			},
			el(
				'div',
				{
					className: 'grid-stack-item',
					'data-gs-x': 0,
					'data-gs-y': 0,
					'data-gs-width': 2,
					'data-gs-height': 1
				},
				el(
					'div',
					{ className: 'grid-stack-item-content' },
					el(wp.blockEditor.InnerBlocks.Content)
				)
			)
		);
	}
});
