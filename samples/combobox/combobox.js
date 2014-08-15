function main(app)
{
    var workarea = app.create("dialog");
    workarea.Title = "Workarea";
    workarea.Width = 365;
    workarea.Height = 170;
    workarea.DialogPosition = {at: "center"};

    var combobox = app.create("combobox", workarea);
    combobox.Top = 12;
    combobox.Left = 12;
    combobox.Position = "absolute";
    combobox.Width = 205;
    combobox.Height = 22;
    combobox.Border = "";
    combobox.Items = [{"key": "key1", "value": "value1"},
                      {"key": "key2", "value": "value2"},
                      {"key": "key3", "value": "value3"}];
    combobox.on("change", function(myself, key){
            // updates the textfield with current key
            textfield4.Text = key;
            console.log("on change - key:", combobox.Selected);
        });

    var button1 = app.create("button", workarea);
    button1.Top = 10;
    button1.Left = 225;
    button1.Position = "absolute";
    button1.Caption = "Clear";
    button1.Width = 100;
    button1.Height = 22;
    button1.Border = "";
    button1.on("click", function(){
            combobox.clear();
        });

    var button2 = app.create("button", workarea);
    button2.Top = 40;
    button2.Left = 225;
    button2.Position = "absolute";
    button2.Caption = "Add Item";
    button2.Width = 100;
    button2.Height = 22;
    button2.Border = "";
    button2.on("click", function(){
            combobox.addItem(/* key*/ textfield2.Text, /* value */ textfield3.Text);
        });

    var button3 = app.create("button", workarea);
    button3.Top = 70;
    button3.Left = 225;
    button3.Position = "absolute";
    button3.Caption = "Remove Item";
    button3.Width = 100;
    button3.Height = 22;
    button3.Border = "";
    button3.on("click", function(){
            combobox.removeItem(/* key*/ textfield4.Text);
        });

    var textfield2 = app.create("textfield", workarea);
    textfield2.Top = 40;
    textfield2.Left = 10;
    textfield2.Position = "absolute";
    textfield2.Text = "key";
    textfield2.Width = 80;
    textfield2.Height = 17;
    textfield2.Border = "";

    var textfield3 = app.create("textfield", workarea);
    textfield3.Top = 40;
    textfield3.Left = 95;
    textfield3.Position = "absolute";
    textfield3.Text = "value";
    textfield3.Width = 118;
    textfield3.Height = 17;
    textfield3.Border = "";

    var textfield4 = app.create("textfield", workarea);
    textfield4.Top = 70;
    textfield4.Left = 10;
    textfield4.Position = "absolute";
    textfield4.Text = "key";
    textfield4.Width = 80;
    textfield4.Height = 17;
    textfield4.Border = "";
}
