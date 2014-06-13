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

            this.drawContainer = function ()
            {
                $(document.body).append(
                    "<div id='" + this.handle + "' class='mirrorJSWidget'></div>"
                );
                this.node_cnt$ = $("#" + this.handle);
            };

            this.show = function()
            {
                this.node_cnt$.dialog(
                    {
                        modal: args["Modal"] !== undefined ? args["Modal"] : false
                    });

                // always send the "beforeclose" event
                // you can deactivate it with "off" [ myDialog.off("beforeclose"); ]
                this.activateEvent("beforeclose", true);

                this.node_cnt$.bind( "dialogbeforeclose", function(event, _ui)
                    {
                        ui.events.fire(handle, "beforeclose");
                        return false;
                    });

                this.node_cnt$.click( function(event)
                {
                    ui.events.fire(handle, "click");
                    event.stopPropagation();
                } );
            };

            this.beforeDestroy = function()
            {
                this.node_cnt$.dialog( "destroy" );
            };


            this.props = {
                "Title": function(v)
                    {
                        that.node_cnt$.dialog({ title: v });
                    },
                "DialogPosition": function(v)
                    {
                        that.node_cnt$.dialog({ position: v });
                    }
                };


            this.setBorder = function(v)
            {
                this.node_cnt$.css( "border", v );
            };


            this.setWidth = function(v)
            {
                that.node_cnt$.dialog({ width: v });
            };


            this.setHeight = function(v)
            {
                that.node_cnt$.dialog({ height: v });
            };


            this.handleEvents = function(ctl, what, obj)
            {
                if ( what == "resize" )
                {
                    // TODO
                }
            };

        },


    "backend": function(iApp, handle, parent, args)
        {
            var that = this;

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


            this.handleEvents = function(ctl, what, obj)
            {
                if ( what == "beforeclose" )
                {
                    if ( this.events["beforeclose"] === undefined )
                    {
                        // the custom "beforeclose" has not been implemented!
                        // defaulting to: destroy dialog
                        iApp.destroy( handle );
                    }
                }
            };


        }

};

mirrorJS.widgets.controller.install(mjs_dialog);
