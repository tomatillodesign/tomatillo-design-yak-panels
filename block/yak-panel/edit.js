(function (wp) {
	const { createElement: el, useRef } = wp.element;
	const { useBlockProps, InnerBlocks } = wp.blockEditor;

	wp.blocks.registerBlockType('yak/panel', {
		title: 'Yak Panel',
		parent: ['yak/panels'],
		category: 'layout',
		icon: 'excerpt-view',
		supports: {
			html: false,
		},
		attributes: {
			x: { type: 'number', default: 0 },
			y: { type: 'number', default: 0 },
			width: { type: 'number', default: 1 },
			height: { type: 'number', default: 1 },
		},

		edit: (props) => {
			const { attributes, setAttributes } = props;
			const { x, y, width, height } = attributes;
			const ref = useRef(null);

			// Optional: later we'll use this to sync drag events back to attributes
			// useEffect(() => { ... });

			const blockProps = useBlockProps({
				ref,
				className: 'grid-stack-item',
				'data-gs-x': x,
				'data-gs-y': y,
				'data-gs-width': width,
				'data-gs-height': height,
			});

			return el(
				'div',
				blockProps,
				el(
					'div',
					{ className: 'grid-stack-item-content' },
					el(InnerBlocks)
				)
			);
		},

		save: (props) => {
            const { x, y, width, height } = props.attributes;

            return wp.element.createElement(
                'div',
                {
                    className: 'grid-stack-item',
                    'data-gs-x': x,
                    'data-gs-y': y,
                    'data-gs-width': width,
                    'data-gs-height': height,
                },
                wp.element.createElement(
                    'div',
                    { className: 'grid-stack-item-content' },
                    wp.element.createElement(wp.blockEditor.InnerBlocks.Content)
                )
            );
        }
	});
})(window.wp);
