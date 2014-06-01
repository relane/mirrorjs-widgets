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


var mjs_tabber = {

    "name": "tabber",


    "html": function(ui, handle, parent, args)
        {
            var that = this;

            mirrorJS.widgets.base.ui.call(this, ui, handle, parent, args);

            this.show = function()
            {
                this.node_cnt$.append(
                    '<div id="tabber_' + this.handle + '" class="mirrorTabber"><ul></ul></div>'
                );

                this.node$ = $("#tabber_" + this.handle, this.node_cnt$);

                this.tabber = this.node$.tabs({ collapsible: false });

                this.node$.click( function(event)
                {
                    ui.events.fire(handle, "click");
                    event.stopPropagation();
                } );

            };

        },


    "backend": function(iApp, handle, parent, args)
        {
            var that = this;

            mirrorJS.widgets.base.backend.call(this, iApp, handle, parent, args);

            this.isGoodChild = function(ctl)
            {
                if ( ctl && ctl.type === "tab" )
                {
                    // tabber can only accept tabs
                    return true;
                }
                return false;
            };

        }
};


var mjs_tab = {

    "name": "tab",


    "html": function(ui, handle, parent, args)
        {
            var that = this;

            mirrorJS.widgets.base.ui.call(this, ui, handle, parent, args);


            this.create = function()
            {
                parent.tabber.find( ".ui-tabs-nav" ).append( '<li id="tab_li_' + this.handle + '"><a href="#tab_' + this.handle + '"></a></li>' );
                parent.tabber.append( '<div id="tab_' + this.handle + '"></div>' );
                parent.tabber.tabs( "refresh" );
                this.node_cnt$ = $("#tab_" + this.handle);
                this.tab_li$ = $("#tab_li_" + this.handle);

                if( parent.tabber.tabs( "option", "active" ) === false )
                {
                    parent.tabber.tabs( "option", "active", 0 );
                }

                this.tab_li$.click( function(event)
                {
                    ui.events.fire(handle, "click");
                    event.stopPropagation();
                } );
            };


            this.beforeDestroy = function()
            {
                this.tab_li$.remove();
            };


            this.afterDestroy = function()
            {
                parent.tabber.tabs( "refresh" );
            };


            this.setBorder = function(v)
            {
                this.tab_li$.css( "border", v );
            };


            this.props = {
                "Caption": function(v)
                    {
                        that.tab_li$.find("a").text(v);
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

            mirrorJS.widgets.base.backend.call(this, iApp, handle, parent, args);

            this.isGoodParent = function()
            {
                if ( parent && parent.type === "tabber" )
                {
                    // tabber can only accept tabs
                    return true;
                }
                return false;
            };

        }
};

mirrorJS.widgets.controller.install(mjs_tabber);
mirrorJS.widgets.controller.install(mjs_tab);
