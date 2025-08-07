(function (wp) {
	const { createElement: el, useEffect, useRef, Fragment } = wp.element;
	const {
		InnerBlocks,
		InspectorControls,
		useBlockProps,
	} = wp.blockEditor;
	const { PanelBody, RangeControl } = wp.components;
	const { registerBlockType } = wp.blocks;

	registerBlockType('yak/panels', {
		title: 'Yak Panels',
		category: 'layout',
		icon: 'grid-view',
		supports: {
			html: false,
			anchor: true,
			align: ['wide', 'full']
		},
		attributes: {
			columns: {
				type: 'number',
				default: 4
			}
		},

		edit: (props) => {
			const { attributes: { columns }, setAttributes } = props;
			const ref = useRef(null);

			useEffect(() => {
				const gridEl = ref.current;
				if (!gridEl || !window.GridStack) {
					console.warn('⚠️ Gridstack container or GridStack lib missing.');
					return;
				}

				// Clean up existing gridstack if any
				if (gridEl.gridstack) {
					gridEl.gridstack.destroy(false);
					console.log('🧹 Gridstack destroyed before re-init');
				}

				// Initialize Gridstack
				const grid = GridStack.init({
					column: columns,
					cellHeight: 150,
					disableOneColumnMode: true,
					animate: true
				}, gridEl);

				console.log(`✅ Gridstack initialized with ${columns} columns`);

				return () => {
					grid.destroy(false);
					console.log('🧼 Gridstack cleanup on unmount');
				};
			}, [columns]);

			const blockProps = useBlockProps({
				ref,
				className: 'yak-panels-block grid-stack',
				'data-columns': columns
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
							max: 12,
							value: columns,
							onChange: (val) => setAttributes({ columns: val })
						})
					)
				),
				el(
					'div',
					blockProps,
					el(InnerBlocks, {
						allowedBlocks: ['yak/panel'],
						orientation: 'horizontal',
						renderAppender: InnerBlocks.ButtonBlockAppender
					})
				)
			);
		},

		save: function (props) {
			const { columns } = props.attributes;

			return wp.element.createElement(
				'div',
				{
					className: 'yak-panels-block grid-stack',
					'data-gs-columns': columns,
				},
				wp.element.createElement(wp.blockEditor.InnerBlocks.Content)
			);
		}

	});
})(window.wp);
