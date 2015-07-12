# mirrorjs Widgets

## Sample widget
```javascript
{
    "name": "button",
    "author": "mirrorjs",
    "version": "0.0.1",

    "html": function(ui, handle, parent, args)
        {

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

                // inherited by keyboard mixin
                this.bindKeyboardEvents( this.node$ );
            };


            this.props = {
                "Caption":
                    {
                        "set": function(v)
                            {
                                this.node$.text( v );
                            }
                    }
                };


            // inherit keyboard mixin
            this.loadMixin("keyboard", function(eventName, originalEvent, params)
                {
                    ui.events.fire(handle, eventName, params);
                    event.stopPropagation();
                });

        },


    "backend": function(iApp, handle, parent, args)
        {
            // Properties
            this.props =
                {
                    "Caption":
                        {
                            "default": "",
                            "description": "The text caption displayed in the Button control."
                        }
                };

        }
}

```

# Live Application Designer

http://www.mirrorjs.com/designer/


# Wiki

[Wiki](https://github.com/relane/mirrorjs-widgets/wiki)


# Home

http://www.mirrorjs.com/

https://github.com/relane/mirrorjs

