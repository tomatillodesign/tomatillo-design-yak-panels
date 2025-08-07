(function (wp) {
	const { createElement: el, useRef, useEffect } = wp.element;
	const { useBlockProps, InnerBlocks } = wp.blockEditor;
	const { registerBlockType } = wp.blocks;

	registerBlockType('yak/panel', {
		attributes: {
			x: { type: 'number', default: 0 },
            y: { type: 'number', default: 0 },
            width: { type: 'number', default: 1 },
            height: { type: 'number', default: 1 },
		},

edit: (props) => {
	const { attributes, clientId, setAttributes } = props;
	const { x = 0, y = 0, width = 1, height = 1 } = attributes;
	const ref = useRef(null);

useEffect(() => {
	const el = ref.current;
	const now = new Date().toLocaleTimeString();

	if (!el) {
		console.warn(`[Yak Panel ${clientId}] ❌ ${now} → No ref element found`);
		return;
	}

	el.dataset.block = clientId;
	console.log(`🧱 [Yak Panel ${clientId}] ✅ ${now} → Mounted`, { x, y, width, height });

	let attempt = 0;
	const maxAttempts = 10;
	const retryDelay = 300;

	const tryInitGrid = () => {
		const gridEl = el.closest('.grid-stack');
		const nowTry = new Date().toLocaleTimeString();

		if (!gridEl) {
			console.warn(`[Yak Panel ${clientId}] ⚠️ ${nowTry} → .grid-stack not found (attempt ${attempt + 1})`);
		} else if (!gridEl.gridstack) {
			console.warn(`[Yak Panel ${clientId}] ⚠️ ${nowTry} → GridStack not initialized yet (attempt ${attempt + 1})`);
		} else {
			console.log(`[Yak Panel ${clientId}] 🧩 ${nowTry} → GridStack ready, attaching change listener`);

			gridEl.gridstack.on('change', (event, items) => {
				const nowChange = new Date().toLocaleTimeString();
				console.group(`[Yak Panel ${clientId}] 🔄 ${nowChange} → GridStack change event`);
				console.log('Full change payload:', items);

				items.forEach((item) => {
					if (!item.el) {
						console.warn(`[Yak Panel ${clientId}] ⚠️ Skipping item with no element`);
						return;
					}

					const match = item.el.dataset.block === clientId;
					console.log(`[Yak Panel ${clientId}] 🧪 Match check:`, match, item.el);

					if (!match) return;

					const newData = {
						x: item.x,
						y: item.y,
						width: item.w,
						height: item.h,
					};

					console.log(`[Yak Panel ${clientId}] 💾 ${nowChange} → Calling setAttributes():`, newData);
					setAttributes(newData);
				});

				console.groupEnd();
			});

			return; // ✅ exit once we attach the listener
		}

		attempt++;
		if (attempt < maxAttempts) {
			setTimeout(tryInitGrid, retryDelay);
		} else {
			console.error(`[Yak Panel ${clientId}] ❌ ${nowTry} → GridStack not ready after ${maxAttempts} attempts`);
		}
	};

	// start retry loop
	setTimeout(tryInitGrid, retryDelay);
}, []);


	const blockProps = useBlockProps({
		ref,
		className: 'grid-stack-item',
		'data-gs-x': x,
		'data-gs-y': y,
		'data-gs-width': width,
		'data-gs-height': height,
		'data-block': clientId,
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

            console.groupCollapsed(`💾 Yak Panel Save (${props.clientId || 'unknown'})`);
            console.log('Attributes being saved:');
            console.log(`→ x: ${x}`);
            console.log(`→ y: ${y}`);
            console.log(`→ width: ${width}`);
            console.log(`→ height: ${height}`);
            console.trace('Save stack trace');
            console.groupEnd();

            return el(
                'div',
                {
                    className: 'grid-stack-item',
                    'data-gs-x': x,
                    'data-gs-y': y,
                    'data-gs-width': width,
                    'data-gs-height': height,
                },
                el(
                    'div',
                    { className: 'grid-stack-item-content' },
                    el(wp.blockEditor.InnerBlocks.Content)
                )
            );
        }
	});
})(window.wp);
