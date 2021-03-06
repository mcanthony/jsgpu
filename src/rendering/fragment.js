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
 * Fragment Rendering Class
 */
function RendererFragment(renderer) {
		this.renderer = renderer;
}

var proto = RendererFragment.prototype;

/**
 * Load attributes into shader
 */
proto.loadAttributes = function(state, f) {
	var attr, i, j;

	for (i = 0; i < state.activeVarying.length; i++) {
		attr = state.activeVarying[i];

		if (attr) {
			for (j = 0; j < attr; j++) {
				Program.varying[4 * i + j] = f.attrib[4 * i + j];	
			}
		}
	}
};

/**
 * Process fragment
 */
proto.process = function(state, f) {
	var i;

	this.loadAttributes(state, f);

	Fragment.fn.fragmentProgram();
};

/**
 * Write fragment output
 */
proto.write = function(state, i, frag) {
	var c_buffer, c, result, c_mask;

	result = Program.result;

	if (state.depthMask) {
		//gl_FragDepth = result.depth = result@0.z
		state.depthBuffer.data[i] = Program.result[2];
	}

	i <<= 2;

	c = frag.color;
	//gl_FragColor = result.color = result@1
	c[0] = result[4] * 255;
	c[1] = result[5] * 255;
	c[2] = result[6] * 255;
	c[3] = result[7] * 255;

	c_buffer = state.colorBuffer.data;

	if (state.blendEnabled) {
		this.blend(c, c_buffer, i);
	}

	c_mask = state.colorMask;
	c_buffer[i    ] = c_mask[0] & (c[0] + .5)|0; //round(frag.r)
	c_buffer[i + 1] = c_mask[1] & (c[1] + .5)|0; //round(frag.g)
	c_buffer[i + 2] = c_mask[2] & (c[2] + .5)|0; //round(frag.b)
	c_buffer[i + 3] = c_mask[3] & (c[3] + .5)|0; //round(frag.a)		
};

/**
 * Blend colors
 */
proto.blend = function(src, dest, i) {
	var sf, df;

	sf = Fragment.fn.blendFnSrc(src[3], dest[i + 3]);
	df = Fragment.fn.blendFnDest(src[3], dest[i + 3]);

	src[0] = Fragment.fn.blendEqRgb(src[0], dest[i    ], sf, df);
	src[1] = Fragment.fn.blendEqRgb(src[1], dest[i + 1], sf, df);
	src[2] = Fragment.fn.blendEqRgb(src[2], dest[i + 2], sf, df);
	src[3] = Fragment.fn.blendEqA(  src[3], dest[i + 3], sf, df);


	if (src[0] > 255) { src[0] = 255; }
	if (src[1] > 255) { src[1] = 255; }
	if (src[2] > 255) { src[2] = 255; }
	if (src[3] > 255) { src[3] = 255; }
	
};

