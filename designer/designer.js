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


// GLOBALS
var workarea = null;

// Available widgets
var widgets = [
    {name: "Dialog", widget: "dialog", "defaults": {"Title": "myDialog", "Width": 600, "Height": 500}},
    {name: "Container", widget: "container", "defaults": {"Height": 350, "Resizable":{"grid": 5}}},
    {name: "Button", widget: "button", "defaults": {"Caption": "myButton", "Width": 100, "Height": 22}},
    {name: "Label", widget: "label", "defaults": {"Caption": "myLabel", "Width": 60, "Height": 22}},
    {name: "Textfield", widget: "textfield", "defaults": {"Text": "myTextfield", "Width": 100, "Height": 22}},
    {name: "Checkbox", widget: "checkbox", "defaults": {"Caption": "myCheckbox", "Width": 100, "Height": 22}},
    {name: "Radiobutton", widget: "radiobutton", "defaults": {"Caption": "myRadio", "Width": 100, "Height": 22}},
    {name: "Combobox", widget: "combobox", "defaults": {"Caption": "myCombobox", "Width": 100, "Height": 22, "Items": [
            {key: "key1", value: "value1"},
            {key: "key2", value: "value2"},
            {key: "key3", value: "value3"},
        ]}},

    {name: "Listbox", widget: "combobox", "defaults": {"Caption": "myListbox", "Listbox": true, "Width": 100, "Height": 50, "Items": [
            {key: "key1", value: "value1"},
            {key: "key2", value: "value2"},
            {key: "key3", value: "value3"},
        ]}},

    {name: "Tabber", widget: "tabber", "defaults": {"Height": 350}},
    {name: "Tab", widget: "tab", "defaults": {"Caption": "myTab"}},
    {name: "Accordion", widget: "accordion", "defaults": {"Height": 350}},
    {name: "Panel", widget: "accordionPanel", "defaults": {"Caption": "myPanel"}},
    {name: "DataGrid", widget: "datagrid", "defaults": {"Height": 200}, "startupParams": {
            "Width": 400,
            "Height": 200,
            "dataset": {
                "columns": [
                            { id: "id", name: "ID", field: "id" },
                            { id: "column1", name: "Column1", field: "column1" },
                            { id: "column2", name: "Column2", field: "column2" }
                        ],
                "data": [{id: 1, column1: "ro1", column2: "test"},{id: 2, column1: "ro2", column2: "foo"},
                             {id: 3, column1: "ro3", column2: "baz"}]
                }
        }},
    {name: "Progressbar", widget: "progressbar", "defaults": {"Width": 150, "Height": 20}}
    ];

var activeWidget = null;
var livingWidgets = {};


function getValidWidgetNameByType(t)
{
    var widgetID = 1;
    while ( livingWidgets[t + "" + widgetID ] ){ widgetID++; }
    return t + "" + widgetID;
}

var rowToWidgetInfo = [];

function updateActiveWidget(app, widget)
{
    if ( activeWidget === widget )
    {
        return;
    }

    activeWidget = widget;
    app.getWidgetByName("curWidgetTypeLabel").Caption = activeWidget.__name__;

    // update help (info and props)
    var curWidgetInfo = mirrorJS.widgets.controller.getInfo( activeWidget.type );
    if ( curWidgetInfo )
    {
        app.getWidgetByName("helpWidgetInfo").dataview.updateItem(0, {
                "name": activeWidget.type,
                "author": curWidgetInfo["author"],
                "version": curWidgetInfo["version"]
            });
        app.getWidgetByName("helpWidgetInfo").grid.autosizeColumns();

        app.getWidgetByName("helpWidgetProps").dataview.clear();
        rowToWidgetInfo = [];
        for(var __prop in curWidgetInfo["properties"])
        {
            app.getWidgetByName("helpWidgetProps").dataview.addItem({
                    "id": __prop,
                    "prop": __prop,
                    "type": curWidgetInfo["properties"][__prop]["type"],
                    "default": curWidgetInfo["properties"][__prop]["default"],
                    "desc": curWidgetInfo["properties"][__prop]["description"]
                });
            rowToWidgetInfo.push( curWidgetInfo["properties"][__prop]["description"] );
        }
        app.getWidgetByName("helpWidgetProps").grid.autosizeColumns();
        app.getWidgetByName("propHelp").Text = rowToWidgetInfo[0];
        app.getWidgetByName("helpWidgetProps").grid.setSelectedRows([0]);
    }

    if ( widget !== workarea )
    {
        workarea.Border = "";

        // updates Top, Left

        app.getWidgetByName("txtPositioningTop").Text = activeWidget.Top;
        app.getWidgetByName("txtPositioningLeft").Text = activeWidget.Left;

        app.getWidgetByName("txtLayoutWidth").Text = activeWidget.Width;
        app.getWidgetByName("txtLayoutHeight").Text = activeWidget.Height;
    }

    for(var w in livingWidgets)
    {
        livingWidgets[w].Border = "";
    }

    activeWidget.Border = "2px dotted blue";

    activeWidget.focus();

    console.log("activeWidget: ", activeWidget.__name__);
}


function addThisWidget(app, widget)
{
    var parentWidget = workarea;
    if ( activeWidget !== null )
    {
        parentWidget = activeWidget;
    }

    var newWidget = app.create(widget.widget, parentWidget, widget.startupParams);

    if ( newWidget === undefined )
    {
        alert("Widget creation error!");
        return;
    }

    newWidget.__name__ = getValidWidgetNameByType( widget.widget );
    if ( widget.startupParams !== undefined )
    {
        newWidget.__startupParams = JSON.stringify( widget.startupParams );
    }

    livingWidgets[newWidget.__name__] = newWidget;

    newWidget.Top = 10;
    newWidget.Left = 10;
    newWidget.Position = "absolute";

    // if "Width" is not set: use that of the parent (-30)
    if ( parentWidget && parentWidget.Width !== undefined && widget.defaults["Width"] === undefined )
    {
        newWidget.Width = parentWidget.Width - 30;
    }

    if ( widget.defaults !== undefined )
    {
        for(var attr in widget.defaults)
        {
            newWidget[attr] = widget.defaults[attr];
        }
    }

    // check the size of the child to fit the parent
    if ( parentWidget && parentWidget.Width > 50 && newWidget.Width + 20 > parentWidget.Width )
    {
        newWidget.Width = parentWidget.Width - 30;
    }
    if ( parentWidget && parentWidget.Height > 50 && newWidget.Height + 20 > parentWidget.Height )
    {
        newWidget.Height = parentWidget.Height - 30;
    }

    newWidget.on("click", function(myself){
            updateActiveWidget(app, myself);
        });

    newWidget.on("keydown", function(myself, e){
            handleKeyboardEvent(e);
        });

    newWidget.on("widgetResize", function(myself){
            if ( myself === activeWidget )
            {
                // updates Width and Height
                app.getWidgetByName("txtLayoutWidth").Text = myself.Width;
                app.getWidgetByName("txtLayoutHeight").Text = myself.Height;
            }

            console.log("widgetResize!  --  me: ", myself.__name__);
        });

    newWidget.on("parentWidgetResize", function(myself, obj){
            console.log("parentWidgetResize!  --  me: ", myself.__name__, "  --  resized widget: ", obj["parentWidgetInstance"].__name__);
        });

    newWidget.on("destroy", function(myself){
            console.log("Widget destroyed: " + myself.__name__);
            delete livingWidgets[myself.__name__];
            updateActiveWidget(app, workarea);
        });

    console.log("widgetCrated: ", newWidget.__name__);
}


function handleKeyboardEvent(e)
{
    if ( !activeWidget )
    {
        return;
    }

    if ( e.shiftKey === true )
    {
        if ( /* LEFT */ e.keyCode === 37 )
        {
            activeWidget.Width = parseInt( activeWidget.Width ) - 5;
        }
        else if ( /* UP */ e.keyCode === 38 )
        {
            activeWidget.Height = parseInt( activeWidget.Height ) - 5;
        }
        else if ( /* RIGHT */ e.keyCode === 39 )
        {
            activeWidget.Width = parseInt( activeWidget.Width ) + 5;
        }
        else if ( /* DOWN */ e.keyCode === 40 )
        {
            activeWidget.Height = parseInt( activeWidget.Height ) + 5;
        }
    }
    else
    {
        if ( /* LEFT */ e.keyCode === 37 )
        {
            activeWidget.Left = parseInt( activeWidget.Left ) - 5;
        }
        else if ( /* UP */ e.keyCode === 38 )
        {
            activeWidget.Top = parseInt( activeWidget.Top ) - 5;
        }
        else if ( /* RIGHT */ e.keyCode === 39 )
        {
            activeWidget.Left = parseInt( activeWidget.Left ) + 5;
        }
        else if ( /* DOWN */ e.keyCode === 40 )
        {
            activeWidget.Top = parseInt( activeWidget.Top ) + 5;
        }
        else if ( /* CANC */ e.keyCode === 46 )
        {
            if ( activeWidget !== workarea )
            {
                activeWidget.destroy();
            }
        }
    }
}

if (typeof document !== 'undefined')
{
    $(document).ready(function()
        {
            $(document).keydown( handleKeyboardEvent );
        });
}

function drawWorkarea(app)
{
    workarea = app.create("dialog");
    workarea.Title = "Workarea";
    workarea.Width = 600;
    workarea.Height = 500;
    workarea.DialogPosition = [175, 0]; // {at: "center top"};

    workarea.__name__ = "workarea"

    workarea.on("click", function()
        {
            updateActiveWidget(app, workarea);
        });

    workarea.on("beforeclose", function()
        {
            console.log("You can't close this window!");
        });

    workarea.on("widgetResize", function(myself)
        {
            if ( myself === activeWidget )
            {
                // updates Width and Height
                app.getWidgetByName("txtLayoutWidth").Text = myself.Width;
                app.getWidgetByName("txtLayoutHeight").Text = myself.Height;
            }

            console.log("widgetResize!  --  me: ", myself.__name__);
        });

    workarea.on("keydown", function(myself, e){
            handleKeyboardEvent(e);
        });

    updateActiveWidget(app, workarea);
}


function drawToolwin(app)
{
    var dialogToolwin = app.create("dialog");
    dialogToolwin.Title = "Tools";
    dialogToolwin.Width = 300;
    dialogToolwin.Height = 630;
    dialogToolwin.DialogPosition = [800, 0]; // {at: "right top"};

    dialogToolwin.on("beforeclose", function()
        {
            console.log("You can't close this window!");
        });

    var myContainer = app.create("container", dialogToolwin);
    myContainer.Border = "1px solid #CCC";

    var curWidgetLabel = app.create("label", myContainer);
    curWidgetLabel.Caption = "Active Widget:";

    var curWidgetTypeLabel = app.create("label", myContainer);
    curWidgetTypeLabel.Name = "curWidgetTypeLabel";

    var destroyCurWidget = app.create("button", myContainer);
    destroyCurWidget.Caption = "Destroy";
    destroyCurWidget.Width = 130;
    destroyCurWidget.Height = 22;
    destroyCurWidget.on("click", function(){
            if ( activeWidget && activeWidget !== workarea )
            {
                activeWidget.destroy();
            }
        });

    var myContainer2 = app.create("container", dialogToolwin);
    myContainer2.Border = "1px solid #CCC";
    myContainer2.Height = 70;
    myContainer2.Position = "relative";

    var lblPositioning = app.create("label", myContainer2);
    lblPositioning.Caption = "Positioning";

    var lblPositioningTop = app.create("label", myContainer2);
    lblPositioningTop.Caption = "Top";
    lblPositioningTop.Position = "absolute";
    lblPositioningTop.Top = 20;

    var lblPositioningLeft = app.create("label", myContainer2);
    lblPositioningLeft.Caption = "Left";
    lblPositioningLeft.Position = "absolute";
    lblPositioningLeft.Top = 40;

    var txtPositioningTop = app.create("textfield", myContainer2);
    txtPositioningTop.Name = "txtPositioningTop";
    txtPositioningTop.Text = "0";
    txtPositioningTop.Position = "absolute";
    txtPositioningTop.Top = 20;
    txtPositioningTop.Left = 50;
    txtPositioningTop.on("change", function(ctl){
            activeWidget.Top = ctl.Text;
        });

    var txtPositioningLeft = app.create("textfield", myContainer2);
    txtPositioningLeft.Name = "txtPositioningLeft";
    txtPositioningLeft.Text = "0";
    txtPositioningLeft.Position = "absolute";
    txtPositioningLeft.Top = 40;
    txtPositioningLeft.Left = 50;
    txtPositioningLeft.on("change", function(ctl){
            activeWidget.Left = ctl.Text;
        });


    var myContainer3 = app.create("container", dialogToolwin);
    myContainer3.Border = "1px solid #CCC";
    myContainer3.Height = 70;
    myContainer3.Position = "relative";

    var lblLayout = app.create("label", myContainer3);
    lblLayout.Caption = "Layout";

    var lblLayoutWidth = app.create("label", myContainer3);
    lblLayoutWidth.Caption = "Width";
    lblLayoutWidth.Position = "absolute";
    lblLayoutWidth.Top = 20;

    var lblLayoutHeight = app.create("label", myContainer3);
    lblLayoutHeight.Caption = "Height";
    lblLayoutHeight.Position = "absolute";
    lblLayoutHeight.Top = 40;

    var txtLayoutWidth = app.create("textfield", myContainer3);
    txtLayoutWidth.Name = "txtLayoutWidth";
    txtLayoutWidth.Text = "";
    txtLayoutWidth.Position = "absolute";
    txtLayoutWidth.Top = 20;
    txtLayoutWidth.Left = 50;
    txtLayoutWidth.on("change", function(ctl){
            activeWidget.Width = ctl.Text;
        });

    var txtLayoutHeight = app.create("textfield", myContainer3);
    txtLayoutHeight.Name = "txtLayoutHeight";
    txtLayoutHeight.Text = "";
    txtLayoutHeight.Position = "absolute";
    txtLayoutHeight.Top = 40;
    txtLayoutHeight.Left = 50;
    txtLayoutHeight.on("change", function(ctl){
            activeWidget.Height = ctl.Text;
        });


    var helpWidgetInfo = app.create("datagrid", dialogToolwin, {
        "Width": 260,
        "Height": 60,
        "dataset":{
            "columns":[
                {"id":"name","name":"Widget","field":"name"},
                {"id":"author","name":"Author","field":"author"},
                {"id":"version","name":"Version","field":"version"}
            ],
            "data":[
                {"id": 0, "name": "", "author": "", "version": ""}
            ]
        }});
    helpWidgetInfo.Name = "helpWidgetInfo";
    helpWidgetInfo.Width = 260;
    helpWidgetInfo.Height = 60;

    var helpWidgetProps = app.create("datagrid", dialogToolwin, {
        "Width": 260,
        "Height": 130,
        "dataset":{
            "columns":[
                {"id":"prop","name":"Property","field":"prop","width": 100},
                {"id":"type","name":"Type","field":"type","width": 60},
                {"id":"default","name":"Default","field":"default","width": 100}
            ],
            "data":[]
        }});
    helpWidgetProps.Name = "helpWidgetProps";
    helpWidgetProps.Width = 260;
    helpWidgetProps.Height = 130;
    helpWidgetProps.on("cellClick", function (ctl, cell)
	    {
                app.getWidgetByName("propHelp").Text = rowToWidgetInfo[cell.row];
	    });

    var propHelp = app.create("textfield", dialogToolwin, {"MultiLine": true});
    propHelp.Name = "propHelp";
    propHelp.Text = "";
    propHelp.Width = 260;
    propHelp.Height = 70;

    var getTheCodeButton = app.create("button", dialogToolwin);
    getTheCodeButton.Caption = "Get The Code";
    getTheCodeButton.Width = 130;
    getTheCodeButton.Height = 22;
    getTheCodeButton.on("click", function(){
            getTheCode(app);
        });
}

function drawWidgetsDialog(app)
{
    var widgetsDialog = app.create("dialog");
    widgetsDialog.Title = "Widgets";
    widgetsDialog.Width = 165;
    widgetsDialog.Height = 500;
    widgetsDialog.DialogPosition = [0, 0];

    widgetsDialog.on("beforeclose", function()
        {
            console.log("You can't close this window!");
        });

    var myContainer = app.create("container", widgetsDialog);

    for(var wl = 0; wl < widgets.length; wl++)
    {
        (function(curWidget){
            var widget = app.create("button", myContainer);
            widget.Caption = curWidget.name;
            widget.Width = 130;
            widget.Height = 22;
            widget.on("click", function(){
                    addThisWidget(app, curWidget);
                });
            })(widgets[wl]);
    }
}


function getTheCode(app)
{
    var gtcDialog = app.create("dialog", undefined, {"Modal": true});
    gtcDialog.Title = "Get The Code";
    gtcDialog.Width = 700;
    gtcDialog.Height = 470;
    gtcDialog.DialogPosition = "center";

    var txtCode = app.create("textfield", gtcDialog, {"MultiLine": true});
    txtCode.Width = 666;
    txtCode.Height = 400;

    var code = "function main(app){\n\n";
    code += '    var workarea = app.create("dialog");\n';
    code += '    workarea.Title = "Workarea";\n';
    code += '    workarea.Width = ' + workarea.Width + ';\n';
    code += '    workarea.Height = ' + workarea.Height + ';\n';
    code += '    workarea.DialogPosition = {at: "center top"};\n\n';

    for(var w in livingWidgets)
    {
        var __state__ = livingWidgets[w].getState();
        if ( __state__.c )
        {
            var parentName = "workarea";
            if ( __state__.c.parent && __state__.c.parent.__name__ )
            {
                parentName = __state__.c.parent.__name__;
            }

            // console.log("__state__ ", __state__);
            code += '    var ' + w + ' = app.create("' +
            livingWidgets[w].type + '", ' +
            parentName +
            (livingWidgets[w].__startupParams !== undefined ? ', ' + livingWidgets[w].__startupParams : '') +
            ');\n';

            for (var attr in __state__.s)
            {
                code += '    ' + w + '.' + attr + ' = ' + JSON.stringify(  __state__.s[attr] ) + ';\n';
            }

            code += '\n';
        }
    }

    code += "}\n";

    txtCode.Text = code;
}



function main(app, args)
{
    drawWidgetsDialog(app);
    drawToolwin(app);
    drawWorkarea(app);
}



if (typeof module !== 'undefined' && module.exports)
{
    var mirrorJS = require( __dirname + "/mirror");
    module.exports = function(connection)
        {

            /* mirrorJS.app.server( <UI remote connector>( <connection> ), <callback>, <conf> ); */
            return new mirrorJS.app.server(
                        new mirrorJS.ui.connectors.remote(connection),
                        main,
                        { /* CONF */ });

        };
}
