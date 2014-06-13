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
var curWidgetTypeLabel = null;

var txtPositioningTop, txtPositioningLeft, txtLayoutWidth, txtLayoutHeight, ckPositioning;

// Available widgets
var widgets = [
    {name: "Dialog", widget: "dialog", "defaults": {"Title": "myDialog", "Width": 400, "Height": 250}},
    {name: "Container", widget: "container"},
    {name: "Button", widget: "button", "defaults": {"Caption": "myButton", "Width": 100, "Height": 22}},
    {name: "Label", widget: "label", "defaults": {"Caption": "myLabel", "Width": 60, "Height": 22}},
    {name: "Textfield", widget: "textfield", "defaults": {"Text": "myTextfield", "Width": 100, "Height": 22}},
    {name: "Checkbox", widget: "checkbox", "defaults": {"Caption": "myCheckbox", "Width": 100, "Height": 22}},
    {name: "Tabber", widget: "tabber"},
    {name: "Tab", widget: "tab", "defaults": {"Caption": "myTab"}}
    ];

var activeWidget = null;
var livingWidgets = {};


function getValidWidgetNameByType(t)
{
    var widgetID = 1;
    while ( livingWidgets[t + "" + widgetID ] ){ widgetID++; }
    return t + "" + widgetID;
}


function updateActiveWidget(widget)
{
    activeWidget = widget;
    curWidgetTypeLabel.Caption = activeWidget.__name__;

    if ( widget !== workarea )
    {
        workarea.Border = "";

        // updates Top, Left
        txtPositioningTop.Text = activeWidget.Top;
        txtPositioningLeft.Text = activeWidget.Left;

        txtLayoutWidth.Text = activeWidget.Width;
        txtLayoutHeight.Text = activeWidget.Height;

        ckPositioning.Checked = activeWidget.Position == "absolute";

    }


    for(var w in livingWidgets)
    {
        livingWidgets[w].Border = "";
    }

    activeWidget.Border = "2px dotted blue";
}


function addThisWidget(app, widget)
{
    var parentWidget = workarea;
    if ( activeWidget !== null )
    {
        parentWidget = activeWidget;
    }

    var newWidget = app.create(widget.widget, parentWidget);

    if ( newWidget === undefined )
    {
        alert("Widget creation error!");
        return;
    }

    newWidget.__name__ = getValidWidgetNameByType( widget.widget );

    livingWidgets[newWidget.__name__] = newWidget;

    newWidget.Top = 0;
    newWidget.Left = 0;

    if ( widget.defaults !== undefined )
    {
        for(var attr in widget.defaults)
        {
            newWidget[attr] = widget.defaults[attr];
        }
    }
    newWidget.on("click", function(myself){
            updateActiveWidget(myself);
        });

    newWidget.on("destroy", function(myself){
            console.log("Widget destroyed: " + myself.__name__);
            delete livingWidgets[myself.__name__];
            updateActiveWidget(workarea);
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
            updateActiveWidget(workarea);
        });

    workarea.on("beforeclose", function()
        {
            console.log("You can't close this window!");
        });

    updateActiveWidget( workarea );
}


function drawToolwin(app)
{
    var dialogToolwin = app.create("dialog");
    dialogToolwin.Title = "Tools";
    dialogToolwin.Width = 300;
    dialogToolwin.Height = 400;
    dialogToolwin.DialogPosition = [800, 0]; // {at: "right top"};

    dialogToolwin.on("beforeclose", function()
        {
            console.log("You can't close this window!");
        });

    var myContainer = app.create("container", dialogToolwin);
    myContainer.Border = "1px solid #CCC";

    var curWidgetLabel = app.create("label", myContainer);
    curWidgetLabel.Caption = "Active Widget:";

    curWidgetTypeLabel = app.create("label", myContainer);

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
    myContainer2.Height = 90;
    myContainer2.Position = "relative";

    var lblPositioning = app.create("label", myContainer2);
    lblPositioning.Caption = "Positioning";

    ckPositioning = app.create("checkbox", myContainer2);
    ckPositioning.Caption = "Absolute";
    ckPositioning.on("click", function(ctl, obj){
            activeWidget.Position = obj.Checked ? "absolute" : "relative";
        });

    var lblPositioningTop = app.create("label", myContainer2);
    lblPositioningTop.Caption = "Top";
    lblPositioningTop.Position = "absolute";
    lblPositioningTop.Top = 40;

    var lblPositioningLeft = app.create("label", myContainer2);
    lblPositioningLeft.Caption = "Left";
    lblPositioningLeft.Position = "absolute";
    lblPositioningLeft.Top = 60;

    txtPositioningTop = app.create("textfield", myContainer2);
    txtPositioningTop.Text = "0";
    txtPositioningTop.Position = "absolute";
    txtPositioningTop.Top = 40;
    txtPositioningTop.Left = 50;
    txtPositioningTop.on("change", function(ctl){
            activeWidget.Top = ctl.Text;
        });

    txtPositioningLeft = app.create("textfield", myContainer2);
    txtPositioningLeft.Text = "0";
    txtPositioningLeft.Position = "absolute";
    txtPositioningLeft.Top = 60;
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

    txtLayoutWidth = app.create("textfield", myContainer3);
    txtLayoutWidth.Text = "";
    txtLayoutWidth.Position = "absolute";
    txtLayoutWidth.Top = 20;
    txtLayoutWidth.Left = 50;
    txtLayoutWidth.on("change", function(ctl){
            activeWidget.Width = ctl.Text;
        });

    txtLayoutHeight = app.create("textfield", myContainer3);
    txtLayoutHeight.Text = "";
    txtLayoutHeight.Position = "absolute";
    txtLayoutHeight.Top = 40;
    txtLayoutHeight.Left = 50;
    txtLayoutHeight.on("change", function(ctl){
            activeWidget.Height = ctl.Text;
        });


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
    widgetsDialog.Height = 300;
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
    code += '    workarea.Width = 800;\n';
    code += '    workarea.Height = 500;\n';
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
            code += '    var ' + w + ' = app.create("' + livingWidgets[w].type + '", ' + parentName + ');\n';

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
    var mirrorJS = require( __dirname + "/mirrorjs-0.0.2.min");
    module.exports = function(connection)
        {

            /* mirrorJS.app.server( <UI remote connector>( <connection> ), <callback>, <conf> ); */
            return new mirrorJS.app.server(
                        new mirrorJS.ui.connectors.remote(connection),
                        main,
                        { /* CONF */ });

        };
}
