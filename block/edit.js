(function (wp) {
	const el = wp.element.createElement;
	const useEffect = wp.element.useEffect;
	const useRef = wp.element.useRef;
	const Fragment = wp.element.Fragment;

	const registerBlockType = wp.blocks.registerBlockType;
	const InnerBlocks = wp.blockEditor.InnerBlocks;
	const InnerBlocksContent = wp.blockEditor.InnerBlocks.Content;
	const InspectorControls = wp.blockEditor.InspectorControls;
	const useBlockProps = wp.blockEditor.useBlockProps;
	const PanelBody = wp.components.PanelBody;
	const RangeControl = wp.components.RangeControl;

	registerBlockType('yak/panels', {
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
			},
		},

		edit: function (props) {
			const columns = props.attributes.columns;
			const setAttributes = props.setAttributes;
			const ref = useRef(null);

			useEffect(function () {
				if (!ref.current || !window.GridStack) {
					console.warn('⚠️ Gridstack container or GridStack lib missing.');
					return;
				}

				if (ref.current.gridstack) {
					ref.current.gridstack.destroy(false);
					console.log('🧹 Gridstack destroyed');
				}

				const grid = GridStack.init(
					{
						column: columns,
						cellHeight: 150,
						disableOneColumnMode: true,
						animate: true,
					},
					ref.current
				);

				console.log(`✅ Gridstack initialized with ${columns} columns`);

				return function () {
					grid.destroy(false);
					console.log('🧼 Gridstack cleanup');
				};
			}, [columns]);

			const blockProps = useBlockProps({
				ref: ref,
				className: 'yak-panels-block grid-stack',
				'data-columns': columns,
			});

			return el(
				Fragment,
				null,
				el(
					InspectorControls,
					null,
					el(
						PanelBody,
						{ title: 'Panel Settings', initialOpen: true },
						el(RangeControl, {
							label: 'Number of Columns',
							min: 1,
							max: 8,
							value: columns,
							onChange: function (val) {
								setAttributes({ columns: val });
							},
						})
					)
				),
				el(
					'div',
					blockProps,
					el(
						'div',
						{
							className: 'grid-stack-item',
							'data-gs-x': 0,
							'data-gs-y': 0,
							'data-gs-width': 2,
							'data-gs-height': 1,
						},
						el(
							'div',
							{ className: 'grid-stack-item-content' },
							el(InnerBlocks)
						)
					)
				)
			);
		},

		save: function (props) {
			const columns = props.attributes.columns;

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
						'data-gs-height': 1,
					},
					el(
						'div',
						{ className: 'grid-stack-item-content' },
						el(InnerBlocksContent)
					)
				)
			);
		},
	});
})(window.wp);
