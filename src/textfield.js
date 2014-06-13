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


var mjs_textfield = {

    "name": "textfield",


    "html": function(ui, handle, parent, args)
        {
            var that = this;

            this.show = function()
            {
                this.multiline = args["MultiLine"] !== undefined ? args["MultiLine"] : false;

                var txtHTML = "";
                if ( this.multiline === true )
                {
                    txtHTML = '<textarea id="txt_' + this.handle + '"></textarea>';
                }
                else
                {
                    txtHTML = '<input type="text" id="txt_' + this.handle + '" />';
                }
                this.node_cnt$.append( txtHTML );

                this.node$ = $("#txt_" + this.handle, this.node_cnt$);

                // always send the "change" event
                // you can deactivate it with "off" [ myTextfield.off("change"); ]
                this.activateEvent("change", true);

                this.node$.change( function()
                    {
                        ui.events.fire(handle, "change", {"Text": $(this).val()});
                    } );

                this.node$.click( function(event)
                {
                    ui.events.fire(handle, "click");
                    event.stopPropagation();
                } );

            };


            this.props = {
                "Text": function(v)
                    {
                        that.node$.val( v );
                    }
                };

        },


    "backend": function(iApp, handle, parent, args)
        {
            var that = this;

            // Properties
            var _text;
            this.props =
                {
                    "Text":
                        {
                            "get": function()
                                {
                                    return _text;
                                },
                            "set": function(nv)
                                {
                                    _text = nv;
                                    return nv;
                                }
                        }
                };


            this.handleEvents = function(ctl, what, obj)
            {
                if ( what == "change" )
                {
                    // block the firing of the "update" event
                    iApp.fireEvents = false;

                    // updates the status of Text
                    this.Text = obj["Text"];

                    // enable firing of the events
                    iApp.fireEvents = true;
                }
            };


        }

};

mirrorJS.widgets.controller.install(mjs_textfield);
