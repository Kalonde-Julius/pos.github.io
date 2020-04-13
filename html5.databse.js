// Create database 
var mywebdb = openDatabase('pos', '1.0', 'db example', 2 * 1024 * 1024);

createTable(); // It will create tables.
showsavedsales(); // It will show saved records.

// Create table
function createTable() {
    mywebdb.transaction(function(tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS sales (product_id INTEGER PRIMARY KEY AUTOINCREMENT, product_name TEXT, product_type TEXT, unit_price TEXT, quantity TEXT, total_price TEXT)", []);
    });
}

// Insert sale.
function savesales() {
    var product_name_val = $.trim($("#product_name").val());
    var product_type_val = $.trim($("#product_type").val());
    var unit_price_val = $.trim($("#unit_price").val());
    var quantity_val = $.trim($("#quantity").val());
    var total_price_val = $.trim($("#total_price").val());

    if (product_name_val == '') {
        alert("Please enter the product name.");
        $("#product_name").focus();
        return false;
    }

    if (product_type_val == '') {
        alert("Please enter the product type.");
        $("#product_type").focus();
        return false;
    }

    if (unit_price_val == '') {
        alert("Please enter the unit price.");
        $("#unit_price").focus();
        return false;
    }

    if (quantity_val == '') {
        alert("Please enter the quantity.");
        $("#quantity").focus();
        return false;
    }

    if (total_price == '') {
        alert("Please enter the Total price");
        $("#total_price").focus();
        return false;
    }

    if (product_name_val != '' && product_type_val != '' && unit_price_val != '' && quantity_val != '' && total_price_val != '') {
        mywebdb.transaction(function(tx) {
            tx.executeSql("INSERT INTO sales (product_name, product_type, unit_price, quantity, total_price) VALUES (?, ?, ?, ?, ?);", [product_name_val, product_type_val, unit_price_val, quantity_val, total_price_val], showsavedsales(), onError);
        });
    }

}


// Edit sale.
function editProductRecord(product_id) {
    mywebdb.transaction(function(tx) {
        tx.executeSql('SELECT product_id, product_name, product_type, unit_price, quantity, total_price FROM sales WHERE product_id = "' + product_id + '"', [], function(tx, results) {
            var record_data = results.rows.item(0);
            $("#save_record_div").hide();
            $("#update_record_div").show();
            $("#edit_product_id").val(record_data.product_id);
            $("#product_name").val(record_data.product_name);
            $("#product_type").val(record_data.product_type);
            $("#unit_price").val(record_data.unit_price);
            $("#quantity").val(record_data.quantity);
            $("#total_price").val(record_data.total_price);
        }, null);
    });
}

// Update sales.
function updatesaleDetails() {

    var product_name_val = $.trim($("#product_name").val());
    var product_type_val = $.trim($("#product_type").val());
    var unit_price_val = $.trim($("#unit_price").val());
    var quantity_val = $.trim($("#quantity").val());
    var total_price_val = $.trim($("#total_price").val());
    var update_product_id = $.trim($("#edit_product_id").val());

    if (product_name_val == '') {
        alert("Please enter the product name.");
        $("#product_name").focus();
        return false;
    }
    if (product_type_val == '') {
        alert("Please enter the product type.");
        $("#product_type").focus();
        return false;
    }
    if (unit_price_val == '') {
        alert("Please enter the unit price.");
        $("#unit_price").focus();
        return false;
    }
    if (quantity_val == '') {
        alert("Please enter the quantity.");
        $("quantity").focus();
        return false;
    }
    if (total_price_val == '') {
        alert("Please enter the total price.");
        $("#total_price").focus();
        return false;
    }

    if (product_name_val != '' && product_type_val != '' && unit_price_val != '' && quantity_val != '' && total_price_val != '') {
        mywebdb.transaction(function(tx) {
            tx.executeSql("UPDATE sales SET product_name = ?, product_type = ?, unit_price = ?, quantity = ?, total_price = ? WHERE product_id = ?", [product_name_val, product_type_val, unit_price_val, quantity_val, total_price_val, update_product_id], showsavedsales(), onError);
        });
    }
}

// Delete sale.
function deleteProductRecord(delete_product_id) {
    var do_it = confirm("Do you really want to delete this sale ? ");
    if (do_it) {
        mywebdb.transaction(function(tx) {
            tx.executeSql('DELETE FROM sales WHERE product_id = "' + delete_product_id + '" ');
        });

        showsavedsales();
    }
}

// It will show query error if something is wrong with query.
function onError(tx, error) {
    alert(error.message);
    //$('#SyncProgress').html(error.message).css("color","red");
}

// drop tables.
function dropTables() {
    mywebdb.transaction(function(tx) {
        tx.executeSql("DROP TABLE sales", []);
    });

}

function total_amount() {
    var product_name_val = $.trim($("#product_name").val());
    var product_type_val = $.trim($("#product_type").val());
    var unit_price_val = $.trim($("#unit_price").val());
    var quantity_val = $.trim($("#quantity").val());
    var total_price_val = $.trim($("#total_price").val());

    if (product_name_val == '') {
        alert("Please enter your product name.");
        $("#product_name").focus();
        return false;
    }

    if (product_type_val == '') {
        alert("Please enter your product type.");
        $("#product_type").focus();
        return false;
    }

    if (unit_price_val == '') {
        alert("Please enter the unit price.");
        $("#unit_price").focus();
        return false;
    }

    if (quantity_val == '') {
        alert("Please enter the quantity.");
        $("#quantity").focus();
        return false;
    }

    if (total_price == '') {
        alert("");
        $("#total_price").focus();
        return false;
    }

    if (product_name_val != '' && product_type_val != '' && unit_price_val != '' && quantity_val != '' && total_price_val != '') {
        mywebdb.transaction(function(tx) {
            tx.executeSql("INSERT INTO sales (product_name, product_type, unit_price, quantity, total_price) VALUES (?, ?, ?, ?, ?);", [product_name_val, product_type_val, unit_price_val, quantity_val, total_price_val], show(unit_price_val * quantity_val), onError);
        });
    }

}
// Select sales.
function showsavedsales() {
    //document.forms['add_form'].reset();
    var show_data_append = '';

    mywebdb.transaction(function(tx) {
        tx.executeSql('SELECT product_id, product_name, product_type, unit_price, quantity, total_price FROM sales', [], function(tx, results) {
            var total_rec = results.rows.length;
            //alert("Total record  =  " +total_rec);
            var header_ui = '<thead><tr style="border: 1px solid black;">' +
                '<th style="padding:8px;border: 1px solid black;width:30%;" >product_name</th>' +
                '<th style="padding:8px;border: 1px solid black;width:30%;" >product_type</th>' +
                '<th style="padding:8px;border: 1px solid black;width:30%;" >unit_price</th>' +
                '<th style="padding:8px;border: 1px solid black;width:30%;"  >quantity</th>' +
                '<th style="padding:8px;border: 1px solid black;width:30%;"  >total_price</th>' +
                '<th style="padding:8px;border: 1px solid black;width:40%;" >Action&nbsp;&nbsp;<button type="button" class="btn btn-danger" onclick="dropTables();" style="cursor:pointer;"><span class="glyphicon glyphicon-remove"></span>&nbsp;&nbsp;Drop Table</button></th>' +
                '</tr></thead>';

            if (total_rec >= 1) {
                for (i = 0; i < total_rec; i++) {
                    var record_data = results.rows.item(i);
                    show_data_append += '<tr style="border: 1px solid black;" >' +
                        '<td style="padding:8px;border: 1px solid black;" >' + record_data.product_name + '</td>' +
                        '<td style="padding:8px;border: 1px solid black;" >' + record_data.product_type + '</td>' +
                        '<td style="padding:8px;border: 1px solid black;" >' + record_data.unit_price + '</td>' +
                        '<td style="padding:8px;border: 1px solid black;" >' + record_data.quantity + '</td>' +
                        '<td style="padding:8px;border: 1px solid black;" >' + record_data.total_price + '</td>' +
                        '<td style="padding:8px;border: 1px solid black;" >'

                    +
                    '<button type="button" class="btn btn-danger" onclick="deleteProductRecord(' + record_data.product_id + ');"  id="save_record_div" style="cursor:pointer;"><span class="glyphicon glyphicon-remove"></span>&nbsp;&nbsp;Delete</button>' +
                        '&nbsp;&nbsp;<button type="button" class="btn btn-info" onclick="editProductRecord(' + record_data.product_id + ');"  id="save_record_div" style="cursor:pointer;"><span class="glyphicon glyphicon-pencil"></span>&nbsp;&nbsp;Edit</button>' +
                        '</tr>';
                }
            } else {
                show_data_append += '<tr style="border: 1px solid black;" ><td style="padding:8px;border: 1px solid black; text-align:center;" colspan="5"> No record found !</td></tr>';
            }

            var footer_ui = '</table>';
            var complete_ui = header_ui + show_data_append + footer_ui;
            $("#save_record_div").show();
            $("#update_record_div").hide();
            $("#show_edit_part").html(complete_ui);
        }, null);

    });

}

// Edit sale.
function editsaleRecord(product_id) {
    mywebdb.transaction(function(tx) {
        tx.executeSql('SELECT product_id, product_name, product_type, unit_price, quantity, total_price FROM book_details WHERE product_id = "' + product_id + '"', [], function(tx, results) {
            var record_data = results.rows.item(0);
            $("#save_record_div").hide();
            $("#update_record_div").show();
            $("#edit_product_id").val(record_data.product_id);
            $("#product_name").val(record_data.product_name);
            $("#product_type").val(record_data.product_type);
            $("#unit_price").val(record_data.unit_price);
            $("#quantity").val(record_data.quantity);
            $("#total_price").val(record_data.total_price);
        }, null);
    });
}

// Update sale.
function updatesale() {

    var product_name_val = $.trim($("#product_name").val());
    var product_type_val = $.trim($("#product_type").val());
    var unit_price_val = $.trim($("#unit_price").val());
    var quantity_val = $.trim($("#quantity").val());
    var total_price_val = $.trim($("#total_price").val());
    var update_product_id = $.trim($("#edit_product_id").val());

    if (product_name_val == '') {
        alert("Please enter the product name.");
        $("#product_name").focus();
        return false;
    }
    if (product_type_val == '') {
        alert("Please enter the product type.");
        $("#product_type").focus();
        return false;
    }
    if (unit_price_val == '') {
        alert("Please enter the unit price.");
        $("#unit_price").focus();
        return false;
    }
    if (quantity_val == '') {
        alert("Please enter the quantity.");
        $("#quantity").focus();
        return false;
    }
    if (total_price_val == '') {
        alert(".");
        $("#total_price").focus();
        return false;
    }

    if (product_name_val != '' && product_type_val != '' && unit_price_val != '' && quantity_val != '' && total_price_val != '') {
        mywebdb.transaction(function(tx) {
            tx.executeSql("UPDATE sales SET product_name = ?, product_type = ?, unit_price = ?, quantity = ?, total_price = ? WHERE product_id = ?", [product_name_val, product_type_val, unit_price_val, quantity_val, total_price_val, update_product_id], showSavedSales(), onError);
        });
    }
}

// Delete sale.
function deletesaleRecord(delete_product_id) {
    var do_it = confirm("Do you really want to delete this sale ? ");
    if (do_it) {
        mywebdb.transaction(function(tx) {
            tx.executeSql('DELETE FROM sales WHERE product_id = "' + delete_product_id + '" ');
        });

        showsavedsales();
    }
}

// It will show query error if something is wrong with query.
function onError(tx, error) {
    alert(error.message);
    //$('#SyncProgress').html(error.message).css("color","red");
}

// drop tables.
function dropTables() {
    mywebdb.transaction(function(tx) {
        tx.executeSql("DROP TABLE sales", []);
    });

}
//total
function totalsale() {
    var unit_price_val = $.trim($("#unit_price").val());
    var quantity_val = $.trim($("#quantity").val());

    var total = unit_price_val * quantity_val
    $("#total_price").val(total);
}