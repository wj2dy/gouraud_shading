'use strict';

const canvas = document.getElementById('mycanvas');
const ctx = canvas.getContext("2d");

function hor_line(imageData, x1, x2, y, c1, c2)
{
	x1 = x1 - 1e-8;
	x2 = x2 + 1e-8;
	for (var x = Math.ceil(x1); x <= Math.floor(x2); ++x)
	{
		var alpha = (x - x1) / (x2 - x1);
		imageData.data[y * canvas.width * 4 + x * 4 + 0] = (c1[0] * (1 - alpha) + c2[0] * alpha) * 255;
		imageData.data[y * canvas.width * 4 + x * 4 + 1] = (c1[1] * (1 - alpha) + c2[1] * alpha) * 255;
		imageData.data[y * canvas.width * 4 + x * 4 + 2] = (c1[2] * (1 - alpha) + c2[2] * alpha) * 255;
		imageData.data[y * canvas.width * 4 + x * 4 + 3] = 255;
	}
}

function color_blend(c1, c2, alpha)
{
	return [
		c1[0] * (1 - alpha) + c2[0] * alpha,
		c1[1] * (1 - alpha) + c2[1] * alpha,
		c1[2] * (1 - alpha) + c2[2] * alpha
	];
}

function up_triangle(imageData, pt1, y2, x2, x3, c1, c2, c3)
{
	for (var y = Math.ceil(pt1.y); y <= Math.floor(y2); ++y)
	{
		var alpha = (y - pt1.y) / (y2 - pt1.y);
		console.log(y);
		hor_line(imageData, pt1.x * (1 - alpha) + x2 * alpha, pt1.x * (1 - alpha) + x3 * alpha,
			y, color_blend(c1, c2, alpha), color_blend(c1, c3, alpha));
	}
}

function down_triangle(imageData, x1, x2, y1, pt3, c1, c2, c3)
{
	for (var y = Math.ceil(y1); y <= Math.floor(pt3.y); ++y)
	{
		var alpha = (y - y1) / (pt3.y - y1);
		hor_line(imageData, x1 * (1 - alpha) + pt3.x * alpha, x2 * (1 - alpha) + pt3.x * alpha,
			y, color_blend(c1, c3, alpha), color_blend(c2, c3, alpha));
	}
}

function draw_triangle(imageData, pt1, pt2, pt3, c1, c2, c3)
{
	if (pt2.y < pt1.y && pt2.y < pt3.y)
	{
		var t = pt1;
		pt1 = pt2;
		pt2 = t;

		t = c1;
		c1 = c2;
		c2 = t;
	}

	if (pt3.y < pt1.y && pt3.y < pt2.y)
	{
		var t = pt1;
		pt1 = pt3;
		pt3 = t;

		t = c1;
		c1 = c3;
		c3 = t;
	}

	if (pt3.y < pt2.y)
	{
		var t = pt2;
		pt2 = pt3;
		pt3 = t;

		t = c2;
		c2 = c3;
		c3 = t;
	}

	var alpha = (pt2.y - pt1.y) / (pt3.y - pt1.y);
	if (pt2.x < pt3.x)
	{
		up_triangle(imageData, pt1, pt2.y, pt2.x,
			pt1.x * (1 - alpha) + pt3.x * alpha,
			c1, c2,
			color_blend(c1, c3, alpha));
		down_triangle(imageData, pt2.x, 
			pt1.x * (1 - alpha) + pt3.x * alpha,
			pt2.y, pt3,
			c2, color_blend(c1, c3, alpha), c3);
	}
	else
	{
		up_triangle(imageData, pt1, pt2.y,
			pt1.x * (1 - alpha) + pt3.x * alpha, pt2.x,
			c1, color_blend(c1, c3, alpha), c2);
		down_triangle(imageData, 
			pt1.x * (1 - alpha) + pt3.x * alpha, pt2.x,
			pt2.y, pt3,
			color_blend(c1, c3, alpha), c2, c3);
	}
}

function draw()
{
	var imageData = ctx.createImageData(canvas.width, canvas.height);

	draw_triangle(imageData, {x: 100, y: 0}, {x: 0, y: 100}, {x: 200, y: 300},
		[1, 0, 0], [0, 1, 0], [0, 0, 1]);

	ctx.putImageData(imageData, 0, 0);
}

draw();
