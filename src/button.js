/*
 * Copyright (c) 2014 mirrorJS
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */


var mirrorJS = mirrorJSRequire("mirrorJS");


var mjs_button = {

    "name": "button",


    "html": function(ui, handle, parent, args)
        {
            var that = this;

            mirrorJS.widgets.base.ui.call(this, ui, handle, parent, args);

            this.show = function()
            {
                this.node_cnt$.append(
                    '<button id="btn_' + this.handle + '" type="button"></button>'
                );

                this.node$ = $("#btn_" + this.handle, this.node_cnt$);

                this.node$.click( function(event)
                {
                    ui.events.fire(handle, "click");
                    event.stopPropagation();
                } );
            };


            this.props = {
                "Caption": function(v)
                    {
                        that.node$.text( v );
                    }
                };

        },


    "backend": function(iApp, handle, parent, args)
        {
            var that = this;

            // Properties
            var _caption = '';
            this.props =
                {
                    "Caption":
                        {
                            "get": function()
                                {
                                    return _caption;
                                },
                            "set": function(nv)
                                {
                                    _caption = nv;
                                    return nv;
                                }
                        }
                };

            // Inherit base control
            mirrorJS.widgets.base.backend.call(this, iApp, handle, parent, args);

        }
};

mirrorJS.widgets.controller.install(mjs_button);
