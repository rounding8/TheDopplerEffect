# The Doppler Effect

Version 1.0


## Description

A simple simulation using HTML5 Canvas, which exaggerates how a star changes color as it moves towards and away from an observer.


## Specifications

<img width="50%" height="auto" src="http://roundingeight.com/Demos/TheDopplerEffect/assets/images/star.png">

	1. The star color should change based on the value of the velocity input, where:
	
	       0 = No color change
	    -100 = Blue
	     100 = Red

	2. The velocity input should accept numbers only, limited to the range of the slider*

	3. The slider should be based on a logarithmic scale that shows more detail in the low velocity (blue) range**


## Modus Operandi

By using HTML5 Canvas for pixel manipulation, rather than gradient overlays; (multiple) rgba/hsla backgrounds via CSS, (multiple) transparent/non-transparent (.PNG/.JPG/.JPEG) images, etc., we’re able to represent the star as it changes color with its outlined shaped only - as opposed to the entire image’s (box size), including its undesired transparent pixels, being colored/shadowed.

I.e., the star image is clipped; to create the color overlay effect — for when the star color changes (between blue and red) in direct relation to its velocity — our original star image is drawn onto the HTML5 canvas, its pixels are copied, altered (to blue or red, respectively), and then saved to a new image. Thus, the new image(s) created contain ONLY the original gold star’s non-transparent pixels.

*Due to the strictly-defined value(s) & concise instructions at which the star’s velocity should change its color - one might interpret this requirement’s action as being strict in adjustment, rather than gradual. I.e., the star remains its default gold color until the velocity reaches -100 (and lower), or 100 (and greater). In this respect, the star changing colors at these critical points would not be a smooth transition.

As such, I chose to scale the star’s opacity to better reflect the color changing in transition, where the star gradually turns blue as the velocity immediately falls negative. Similarly, it immediately begins changing color to red, as soon as the input/slider value is positive. The star will reach its maximum blue color @ -100, and its maximum red @ 100, where the blue/red canvassed image is @ `opacity = 1`.

**Although the only values of importance defined are 0, -100, and 100, the requirements are not strict in these values being its limited minimum/maximum range. Therefore, to better exaggerate the exponential change in velocity as the slider movement increases positively, the maximum velocity input is not capped at 100, but 10,000 (km/s), with appropriately-defined functions to calculate the linear input value (when based on slider movement), or the adjusted logarithmic slider position (based on linear input).

## License

The MIT License (MIT)

Copyright (c) 2015 Raven N. Allan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
