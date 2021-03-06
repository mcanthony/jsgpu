/*
Copyright (c) 2014 Cimaron Shanahan

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
 * Set the current depth function
 *
 * @param   function   func   Depth function
 */
Fragment.setDepthFunc = function(ctx, func) {
	this.fn.depthFunc = func;
};

/**
 * Depth functions
 */
Fragment.fn.depth = {

	never : function(state, i, z) {
		return false;
	},
	
	always : function(state, i, z) {
		return true;	
	},
	
	less : function(state, i, z) {
		var depth;
		
		depth = state.depthBuffer.data[i];

		return z < depth;
	},
	
	ltEqual : function(state, i, z) {
		var depth;
		
		depth = state.depthBuffer.data[i];

		return z <= depth;			
	},

	equal : function(state, i, z) {
		var depth;
		
		depth = state.depthBuffer.data[i];

		return z == depth;			
	},

	greater : function(state, i, z) {
		var depth;
		
		depth = state.depthBuffer.data[i];

		return z > depth;	
	},

	gtEqual : function(state, i, z) {
		var depth;
		
		depth = state.depthBuffer.data[i];

		return z >= depth;	
	},

	nEqual : function(state, i, z) {
		var depth;
		
		depth = state.depthBuffer.data[i];

		return z != depth;	
	}

};

Fragment.fn.depthFunc = Fragment.fn.depth.less;

//Set up constants
for (var i in Fragment.fn.depth) {
	GPU.constants['fnDepth' + i.charAt(0).toUpperCase() + i.slice(1)] = Fragment.fn.depth[i];
}

