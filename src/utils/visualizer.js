export const calculateBarData = (frequencyData, width, barWidth, gap) => {
	let units = width / (barWidth + gap);
	let step = Math.floor(frequencyData.length / units);

	if (units > frequencyData.length) {
		units = frequencyData.length;
		step = 1;
	}

	const data = [];

	for (let i = 0; i < units; i++) {
		let sum = 0;

		for (let j = 0; j < step && i * step + j < frequencyData.length; j++) {
			sum += frequencyData[i * step + j];
		}
		data.push(sum / step);
	}
	return data;
};

export const draw = (
	data,
	canvas,
	barWidth,
	gap,
	backgroundColor,
	barColor
) => {
	const amp = canvas.height / 2;

	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	if (backgroundColor !== "transparent") {
		ctx.fillStyle = backgroundColor;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}

	data.forEach((dp, i) => {
		ctx.fillStyle = barColor;

		const x = i * (barWidth + gap);
		const y = amp - dp / 2;
		const w = barWidth;
		const h = dp || 1;

		ctx.beginPath();
		if (ctx.roundRect) {
			// making sure roundRect is supported by the browser
			ctx.roundRect(x, y, w, h, 50);
			ctx.fill();
		} else {
			// fallback for browsers that do not support roundRect
			ctx.fillRect(x, y, w, h);
		}
	});
};
