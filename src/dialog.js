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


var mjs_dialog = {

    "name": "dialog",


    "html": function(ui, handle, parent, args)
        {
            var that = this;

            this.show = function()
            {
                this.node_cnt$.dialog(
                    {
                        modal: args["Modal"] !== undefined ? args["Modal"] : false
                    });

                this.node_cnt$.bind( "dialogbeforeclose", function(event, _ui)
                    {
                        ui.events.fire(handle, "beforeclose", /*obj */ undefined, /* force send */ true);
                        return false;
                    });

                this.node_cnt$.click( function(event)
                {
                    ui.events.fire(handle, "click");
                    event.stopPropagation();
                } );

                this.node_cnt$.dialog({
                    resizeStop: function( /* unised */ )
                        {
                            ui.events.fire(handle, "resize", {"Width": parseInt(that.node_cnt$.dialog( "option", "width" )), "Height": parseInt(that.node_cnt$.dialog( "option", "height" ))}, /* force send */ true);
                        }
                    });

                // inherited by keyboard mixin
                this.bindKeyboardEvents( this.node_cnt$ );

            };


            // triggered before the widget is destroyed
            this.beforeDestroy = function()
            {
                this.node_cnt$.dialog( "destroy" );
            };


            this.props = {
                "Title":
                    {
                        "set": function(v)
                            {
                                this.node_cnt$.dialog({ title: v });
                            }
                    },
                "DialogPosition":
                    {
                        "set": function(v)
                            {
                                this.node_cnt$.dialog({ position: v });
                            }
                    }
                };


            this.setBorder = function(v)
            {
                this.node_cnt$.css( "border", v );
            };


            this.setWidth = function(v)
            {
                this.node_cnt$.dialog({ width: v });
            };


            this.setHeight = function(v)
            {
                this.node_cnt$.dialog({ height: v });
            };


            this.setPosition = function(v)
            {
                /* ... */
            };


            this.events = {
                "resize": function(ctl, obj)
                    {
                        // TODO
                    }
            };


            // inherit keyboard mixin
            this.loadMixin("keyboard", function(eventName, originalEvent, params) {
                    ui.events.fire(handle, eventName, params);
                    event.stopPropagation();
                });


        },


    "backend": function(iApp, handle, parent, args)
        {
            // Properties
            var _title;
            var _position;
            this.props =
                {
                    "Title":
                        {
                            "get": function()
                                {
                                    return _title;
                                },
                            "set": function(nv)
                                {
                                    _title = nv;
                                    return nv;
                                }
                        },
                    "DialogPosition":
                        {
                            "get": function()
                                {
                                    return _position;
                                },
                            "set": function(nv)
                                {
                                    _position = nv;
                                    return nv;
                                }
                        }
                };


            this.events = {
                "beforeclose": function(ctl, obj)
                    {
                        if ( this.getCustomEventHandler("beforeclose") === undefined )
                        {
                            // the custom "beforeclose" has not been implemented!
                            // defaulting to: destroy dialog
                            this.destroy();
                        }
                    },
                "resize": function(ctl, obj)
                    {
                        // updates the status
                        this.Width = obj["Width"];
                        this.Height = obj["Height"];
                    }
            };

        }

};

mirrorJS.widgets.controller.install(mjs_dialog);
