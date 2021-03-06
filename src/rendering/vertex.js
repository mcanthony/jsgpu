/*
Copyright (c) 2011 Cimaron Shanahan

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/**
 * Vertex Rendering Class
 */
function RendererVertex(renderer) {
	this.renderer = renderer;
}

proto = RendererVertex.prototype;

/**
 * Load vertex attributes into shader memory
 */
proto.loadAttributes = function(state, n) {
	var src, attr, i, j;
	
	src = Program.attributes_src;

	for (i = 0; i < src.length; i++) {

		attr = src[i];
		
		if (!attr) {
			break;
		}

		for (j = 0; j < 4; j++) {
			Program.attributes[attr.start + j] = j < attr.size ? attr.data[n * 4 + j] : 1.0;
		}
	}
	
};

/**
 * Process vertex
 */
proto.process = function(state, v) {
	var i;

	this.loadAttributes(state, v.i);

	Vertex.fn.vertexProgram();

	//@todo: restrict to active varying
	for (i = 0; i < v.varying.length; i++) {
		v.varying[i] = Program.varying[i];
	}

	for (i = 0; i < 8; i++) {
		v.result[i] = Program.result[i];
	}

	v.x = v.result[0];
	v.y = v.result[1];
	v.z = v.result[2];
	v.w = v.result[3];

	//set normalized coordinates
	if (v.w) {
		v.xd = v.x / v.w;
		v.yd = v.y / v.w;
		v.zd = v.z / v.w;

		//set window coordinates
		v.xw = state.viewportX + (state.viewportW / 2) * (1 + v.xd);
		v.yw = state.viewportY + (state.viewportH / 2) * (1 - v.yd);
		v.zw = (((state.viewportF - state.viewportN) * v.zd) + state.viewportN + state.viewportF) / 2;
	}
};

/**
 * Sort vertices
 */
proto.sortVertices = function(prim) {

	if (prim.sorted) {
		return;
	}

	var ymin = 99999, yminx = 9999, yi, i, vs, vertices= [];
	vs = prim.vertices;

	//nothing to sort
	if (vs.length < 2) {
		return;
	}

	//find top vertex
	for (i = 0; i < vs.length; i++) {
		if (vs[i].yw < ymin || (vs[i].yw == ymin && vs[i].xw < yminx)) {
			ymin = vs[i].yw;
			yminx = vs[i].xw;
			yi = i;
		}
	}

	//reorder vertices
	for (i = 0; i < vs.length; i++) {
		vertices[i] = vs[yi];
		yi++;
		if (yi >= vs.length) {
			yi = 0;
		}
	}

	prim.vertices = vertices;
	prim.sorted = true;
};

/**
 * Get slope
 */
proto.slope = function(x1, y1, x2, y2) {
	x1 = x2 - x1;
	y1 = y2 - y1;
	//divide by zero should return Nan
	return (x1 / y1);
};


