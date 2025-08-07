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
			const containerRef = useRef(null);

			useEffect(() => {
				const container = containerRef.current;
				if (!container || !window.GridStack) {
					console.warn('⚠️ Yak Panels: No container or GridStack lib');
					return;
				}

				// 🔍 Target the real gridstack zone — NOT the outer block wrapper
				const gridEl = container.querySelector('.block-editor-block-list__layout.grid-stack');
				if (!gridEl) {
					console.warn('❌ Yak Panels: Could not find inner .grid-stack layout');
					return;
				}

				console.log('⚙️ Yak Panels: Initializing GridStack with', columns, gridEl);

				// 🔄 Destroy old GridStack instance if exists
				if (gridEl.gridstack) {
					gridEl.gridstack.destroy(false);
					console.log('🧹 Gridstack destroyed before re-init');
				}

				const grid = GridStack.init({
					column: columns,
					cellHeight: 150,
					disableOneColumnMode: true,
					animate: true
				}, gridEl);

				console.log('✅ Yak Panels: GridStack successfully initialized', grid);

				grid.on('change', (event, items) => {
					console.log('📦 Yak Panels: Grid change triggered:', items);

					items.forEach(item => {
						const el = item.el;
						const blockId = el?.dataset?.block;
						if (!blockId) {
							console.warn('⚠️ Yak Panels: Missing data-block attribute on item:', el);
							return;
						}

						const newAttrs = {
							x: item.x,
							y: item.y,
							width: item.w,
							height: item.h
						};

						console.log(`🔄 Yak Panels: Saving new grid data for ${blockId}`, newAttrs);

						wp.data.dispatch('core/block-editor').updateBlockAttributes(blockId, newAttrs);
					});
				});

				return () => {
					grid.destroy(false);
					console.log('🧼 Yak Panels: Gridstack destroyed on unmount');
				};
			}, [columns]);

			const blockProps = useBlockProps({
				ref: containerRef,
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

		save: (props) => {
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
