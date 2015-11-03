/*******************************************************************************
*
* Name:         doppler.js
*
* Description:  Source script for the Doppler Effect HTML5 Canvas Demo
*
* Author:       Raven N. Allan
*
* Date:         8.16.15
*
* Notes:        Specifications are as follows (see instructions in README.md):
*
*               #1 - The star color should change based on the value of the
*                    velocity input, where:
*
*                       0 = No color change
*                    -100 = Blue
*                     100 = Red
*
*               #2 - The velocity input should accept numbers only, limited to
*                    the range of the slider
*
*               #3 - The slider should be based on a logarithmic scale that
*                    shows more detail in the low velocity (blue) range
*
*******************************************************************************/
(function($)
{
    var canvas = document.getElementById("starCanvas"),     // HTML canvas to draw star img
        ctx    = canvas.getContext("2d"),                   // define content to enable canvas-only methods
        colors = {'blue':[0, 0, 255], 'red':[255, 0, 0]},   // colors Obj for dynamically altering star's appearance based on velocity

        me =
        {
            /*****************************************************************************
            *
            * Method:       init()
            *
            * Description:  Initialize Object's starting content
            *
            *****************************************************************************/
            init: function()
            {
                me.drawImg("./assets/images/star.png")
                  .manipulatePixels(colors['blue'], "starBlue")
                  .manipulatePixels(colors['red'], "starRed")
                  .bindUI();
            },

            /*****************************************************************************
            *
            * Method:       drawImg()
            *
            * Description:  Draw img onto HTML canvas based on param: 'what'
            *
            * Input:        what : src of img to be drawn
            *
            *****************************************************************************/
            drawImg: function(what)
            {
                var img = new Image();
                img.src = what;
                ctx.drawImage(img, 0, 0, 300, 150);     // img dimensions
                return me;
            },

            /*****************************************************************************
            *
            * Method:       manipulatePixels()
            *
            * Description:  Traverse drawn canvas (star) img & manipulate its pixels based
            *               on 1st param: 'color', and then place its data into a new img
            *               as defined by the 2nd param: 'elementID'
            *
            *               By looping through the canvas (star) img's components and
            *               modifying its pixels accordingly, this isolates the pixels we
            *               want, from those that can be dismissed (i.e. transparent part
            *               of our .PNG img), thereby performing a clipping action
            *
            * Input:        color     : RGB array, e.g. [0, 0, 255] = BLUE
            *               elementID : HTML ID of img to save data to
            *
            *****************************************************************************/
            manipulatePixels: function(color, elementID)
            {
                var i,
                    data = ctx.getImageData(0, 0, 300, 150),
                    pix  = data.data,
                    len  = pix.length,
                    saveImg = document.getElementById(elementID);

                for (i = 0; i < len; i += 4)
                {
                      pix[i]     = color[0];
                      pix[i + 1] = color[1];
                      pix[i + 2] = color[2];
                      // pix[i + 3] = Transparency setting
                }
                ctx.putImageData(data, 0, 0);
                saveImg.src = canvas.toDataURL("image/png");
                return me;
            },

            /*****************************************************************************
            *
            * Method:       bindUI()
            *
            * Description:  Defines and implements UI actions for main application
            *
            *****************************************************************************/
            bindUI: function()
            {                                                           // declare constants to avoid magic nums & maintain consistency
                var minInput   = -100,                                  // minimum user input value allowed for velocity; velocityInput min="-100"
                    maxInput   = 10000,                                 // maximum user input value allowed for velocity; velocityInput max="1000"
                    minPos     = 1,                                     // adjusted minimum input value for logarithmic/exponential scale
                    maxPos     = 10000,                                 // adjusted maximum input value for logarithmic/exponential scale
                    offset     = 101,                                   // total positive offset value for negative portion of uesr input value range (-100 to -1)
                    minLog     = Math.log(minPos),                      // minimum slider range value where minLog = -100 shows most blue star color
                    maxLog     = Math.log(maxPos),                      // maximum slider range value where maxLog = 100 shows most red star color
                    scale      = (maxLog - minLog) / (maxPos - minPos), // adjustment factor for determining logarithmic/exponential conversions
                    vInput     = $('#velocityInput'),                   // cache frequently used objs for improved DOM manipulation
                    vSlider    = $('#velocitySlider'),
                    starCanvas = $('#starCanvas'),
                    starBlue   = $('#starBlue'),
                    starGold   = $('#starGold'),
                    starRed    = $('#starRed');

                /*****************************************************************************
                *
                * Function:     newInput()
                *
                * Description:  Calculates HTML input #velocitySlider val based on new input
                *               value, updates input value (if applicable, i.e. invalid range)
                *               and updates slider position accordingly
                *
                *               Updates #starGold img appearance via #starBlue & #starRed
                *               imgs, based on calculated velocity input
                *
                *****************************************************************************/
                function newInput()
                {
                    // Quick input verification RegEx alternative that restricts invalid range values
                    var inputval = Number($(this).val());
                    if (inputval < minInput)
                    {
                        // if user input value falls below valid min, replace w/ min value
                        inputval = minInput;
                        vInput.val(inputval);
                    }
                    else if (inputval > maxInput)
                    {
                        // if user input value exceeds valid max, replace w/ max value
                        inputval = maxInput;
                        vInput.val(inputval);
                    }

                    // Determine adjusted value using offset
                    // if (inputval < 0) { adjval = offset - Math.abs(inputval); } // negative input value; subtract from offset
                    // else              { adjval = offset + inputval; }           // positive input value; add to offset
                    var adjval   = (inputval < 0) ? offset - Math.abs(inputval) : offset + inputval,
                        position = (Math.log(adjval) - minLog) / (scale + minPos);

                    // Update Slider position based on new input value
                    vSlider.val(position);

                    // Update Star based on input value
                    updateStar();
                }

                /*****************************************************************************
                *
                * Function:     newSlide()
                *
                * Description:  Calculates HTML input #velocityInput val based on new slider
                *               position & updates input field accordingly
                *
                *               Updates #starGold img appearance via #starBlue & #starRed
                *               imgs, based on calculated velocity input
                *
                *****************************************************************************/
                function newSlide()
                {
                    // Determine adjusted value using offset
                    // if (sliderVal < offset) { inputVal = -(offset - sliderVal) } // adjust to neg user input value; -100 to -1
                    // else                    { inputVal = sliderVal - offset  }   // adjust to pos user input value; 0 to 10,000
                    var sliderVal = Math.exp($(this).val()),
                        inputVal  = (sliderVal < offset) ? -(offset - sliderVal) : sliderVal - offset;

                    // Update Input value based on new slider position (to 1 decimal place)
                    vInput.val(inputVal.toFixed(1));

                    // Update Star based on input value
                    updateStar();
                }

                /*****************************************************************************
                *
                * Function:     updateStar()
                *
                * Description:  Calculates star detail opacity based on spec #3, where star
                *               has most detail (opacity = 1) when velocity = -100 / blue
                *               and less detail (opacity = 0.5) when velocity = 0+
                *
                *               Calculates star Blue & Red color (opacity) based on velocity
                *               input/slider value based on spec #1
                *
                *****************************************************************************/
                function updateStar()
                {
                    var colorOpacity,
                        defaultOpac = 0.5,  // 100% star detail & color opacity => 50% = 0.5
                        opacDiv     = 200,  // divide velocity value by 200 to determine %-based opacity
                        velocity    = Number(vInput.val());

                    // Determine colorOpacity contrast of star based on velocity
                    if (velocity < 0)
                    {
                        // BLUE; 0 to -100 velocity => 0 to 0.5 opacity (not opacity = 1)
                        colorOpacity = Math.abs(velocity) / opacDiv;

                        // Reset Red & update Blue
                        starRed.css('opacity', 0);
                        starBlue.css('opacity', colorOpacity);

                        // Determine star detail strength; less velocity <==> more detail
                        var detailedOpac = colorOpacity + defaultOpac;
                        starGold.css('opacity', detailedOpac);
                    }
                    else if (velocity > 0)
                    {
                        // RED - similarly to Blue, we want 50% red color @ velocity = 100, not 100%
                        // if (velocity <= 100) { colorOpacity = velocity / opacDiv; }  // determine red color strength
                        // else                 { colorOpacity = 0.5; }                 // exceeds max red color determinant; set to max
                        colorOpacity = (velocity <= 100) ? velocity / opacDiv : defaultOpac;

                        // Reset Blue & update Red
                        starBlue.css('opacity', 0);
                        starRed.css('opacity', colorOpacity);

                        // Reset Gold star detail/opacity to default: 0.5
                        starGold.css('opacity', defaultOpac);
                    }
                }

                // Set Slider min/max/start positions based on calculations
                var startPos = Math.log(offset) / (scale + minPos); // velocity = 0.0 starting slider position
                vSlider.attr('min', minLog)
                       .attr('max', maxLog)
                       .val(startPos);

                // Bind update f(n)s to appropriate user input elements
                vInput.bind('input', newInput); // .bind() = .on('keyup', newInput) + .on(HTML5 key button press)
                vSlider.on('input', newSlide);

                /*****************************************************************************
                *
                * Method:       $(window).on(resize)
                *
                * Description:  Resize content appropriately to fit screen size / viewport
                *
                * Notes:        Retrieving/calculating img dimensions for canvas drawing would
                *               be far trickier if its height != width; luckily our star.png
                *               is H x W proportionate for a 1:1 ratio, i.e. 420 x 420, so
                *               our program will work based on this assumption
                *
                *****************************************************************************/
                $(window).on('resize', function()
                {
                    var starImgHW  = starGold.height(),
                        starImgPos = starGold.position();
                    
                    starCanvas.height(starImgHW)
                              .width(starImgHW)
                              .css('left', starImgPos.left);
                }).trigger('resize');
                return me;
            }
        };

    me.init();

}(jQuery));