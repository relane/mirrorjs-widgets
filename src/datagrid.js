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
                this.grid = new Slick.Grid("#dt_" + this.handle, args["dataset"]["data"], args["dataset"]["columns"], options);

                this.grid.onClick.subscribe(function (e)
                    {
                        var cell = that.grid.getCellFromEvent(e);
                        ui.events.fire(handle, "cellClick", cell);
                        e.stopPropagation();
                    });

            };

        },


    "backend": function(iApp, handle, parent, args)
        {

        }

};

mirrorJS.widgets.controller.install(mjs_datagrid);
