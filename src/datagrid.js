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


var mjs_datagrid = {

    "name": "datagrid",


    "html": function(ui, handle, parent, args)
        {
            var that = this;

            this.show = function()
            {
                this.node_cnt$.append(
                    '<div id="dt_' + this.handle + '" style="width:' + args["Width"] + 'px;height:' + args["Height"] + 'px;"></div>'
                );
                this.node$ = $("#dt_" + this.handle, this.node_cnt$);

                var options = {
                    enableCellNavigation: true,
                    enableColumnReorder: false
                  };

                this.dataView = new Slick.Data.DataView();

                this.grid = new Slick.Grid("#dt_" + this.handle, this.dataView, args["dataset"]["columns"], options);

                // Make the grid respond to DataView change events.
                this.dataView.onRowCountChanged.subscribe(function (e, args)
                    {
                        that.grid.updateRowCount();
                        that.grid.render();
                    });

                this.dataView.onRowsChanged.subscribe(function (e, args)
                    {
                        that.grid.invalidateRows(args.rows);
                        that.grid.render();
                    });

                this.grid.onClick.subscribe(function (e)
                    {
                        var cell = that.grid.getCellFromEvent(e);
                        ui.events.fire(handle, "cellClick", cell);
                        e.stopPropagation();
                    });

                this.dataView.setItems( args["dataset"]["data"] );

                this.node$.click( function(event)
                {
                    ui.events.fire(handle, "click");
                    event.stopPropagation();
                } );

                // inherited by keyboard mixin
                this.bindKeyboardEvents( this.node$ );

            };


            // triggered after the size (Width or Height) of the widget changed
            this.afterResize = function()
            {
                this.grid.resizeCanvas();
            };


            // triggered before the widget is destroyed
            this.beforeDestroy = function()
            {
                /* TODO */
            };


            this.events = {
                "__clear": function(ctl, obj)
                    {
                        this.dataView.setItems([], "Id");
                    },

                "__addItem": function(ctl, obj)
                    {
                        this.dataView.addItem( obj );
                        this.dataView.refresh();
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
            this.dataview = {
                    "clear": function()
                        {
                            iApp.events.fire(handle, "__clear");
                        },
                    "addItem": function(row)
                        {
                            iApp.events.fire(handle, "__addItem", row);
                        }
                };
        }

};

mirrorJS.widgets.controller.install(mjs_datagrid);
