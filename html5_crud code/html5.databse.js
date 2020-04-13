    // Create database 
    var mywebdb = openDatabase('websql_db', '1.0', 'db example', 2 * 1024 * 1024);
   
    createTable();  // It will create tables.
    showSavedUserDetails(); // It will show saved records.

    // Create table
    function createTable() 
    { 
        mywebdb.transaction(function(tx) 
        {
            tx.executeSql("CREATE TABLE IF NOT EXISTS user_details (user_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, type TEXT, uprice TEXT, quantity TEXT, tprice TEXT)", []);
        });
    }

    // Insert user details.
    function saveUserDetails()
    {
          
			
        var name_val = $.trim($("#name").val());
        var type_val =$.trim($("#type").val());
        var uprice_val = $.trim($("#uprice").val());
        var quantity_val = $.trim($("#quantity").val());
        var tprice_val = $.trim($("#tprice").val());
        
		    if(name_val == '')
        {
          alert("Please enter your name."); 
          $("#name").focus(); return false; 
        }
        if(type_val == '')
        {
          alert("Please enter your type."); 
          $("#type").focus(); return false; 
        }
		
        if(uprice_val == '')
        {
          alert("Please enter your unit price."); 
          $("#uprice").focus(); return false; 
        }
		   if(quantity_val == '')
        {
          alert("Please enter your quantity."); 
          $("#quantity").focus(); return false; 
        }
        if(tprice_val == '')
        {
          alert("Please enter your total price."); 
          $("#tprice").focus(); return false; 
        }
		
        if(name_val !='' && type_val !='' && uprice_val !='' && quantity_val !='' && tprice_val !='')
        {
            mywebdb.transaction(function (tx) 
            {
                tx.executeSql("INSERT INTO user_details (name, type, uprice, quantity, tprice) VALUES (?, ?, ?, ?, ?);", 
                [name_val, type_val, uprice_val, quantity_val, tprice_val],showSavedUserDetails(), onError);
            });
        }

    }

    // Select user details.
    function showSavedUserDetails()
    {
       //document.forms['add_form'].reset();
       var show_data_append = '';
	   
       mywebdb.transaction(function (tx) 
       {
              tx.executeSql('SELECT user_id, name, type, uprice, quantity, tprice FROM user_details', [], function (tx, results) 
              {
                   var total_rec = results.rows.length;
                   //alert("Total record  =  " +total_rec);
                   var header_ui = '<thead><tr style="border: 1px solid black;">'     
                                 +'<th style="padding:8px;border: 1px solid black;width:30%;" >Product Name</th>'
                                 +'<th style="padding:8px;border: 1px solid black;width:30%;" >Product Type</th>'
                                 +'<th style="padding:8px;border: 1px solid black;width:30%;"  >Unit price</th>'
                                 +'<th style="padding:8px;border: 1px solid black;width:30%;"  >Quantity</th>'
                                 +'<th style="padding:8px;border: 1px solid black;width:30%;"  >Total price</th>'
                                 +'<th style="padding:8px;border: 1px solid black;width:40%;" >Action&nbsp;&nbsp;<button type="button" class="btn btn-danger" onclick="dropTables();" style="cursor:pointer;"><span class="glyphicon glyphicon-remove"></span>&nbsp;&nbsp;Drop Table</button></th>'
                                 +'</tr></thead>';

                   if(total_rec >= 1)             
                   {
                       for (i = 0; i < total_rec; i++)
                       {
                         var record_data =  results.rows.item(i);
                         show_data_append += '<tr style="border: 1px solid black;" >' 
                            + '<td style="padding:8px;border: 1px solid black;" >' + record_data.name + '</td>' 
                            + '<td style="padding:8px;border: 1px solid black;" >' + record_data.type + '</td>' 
                            + '<td style="padding:8px;border: 1px solid black;" >' + record_data.uprice + '</td>' 
                            + '<td style="padding:8px;border: 1px solid black;" >' + record_data.quantity + '</td>'
                            + '<td style="padding:8px;border: 1px solid black;" >' + record_data.tprice + '</td>'
                            + '<td style="padding:8px;border: 1px solid black;" >'
                            + '<button type="button" class="btn btn-danger" onclick="deleteUserRecord('+ record_data.user_id + ');"  id="save_record_div" style="cursor:pointer;"><span class="glyphicon glyphicon-remove"></span>&nbsp;&nbsp;Delete</button>'
                            + '&nbsp;&nbsp;<button type="button" class="btn btn-info" onclick="editUserRecord('+ record_data.user_id + ');"  id="save_record_div" style="cursor:pointer;"><span class="glyphicon glyphicon-pencil"></span>&nbsp;&nbsp;Edit</button>'
                            + '</tr>';
                       }
                   }
                   else
                   {
                        show_data_append += '<tr style="border: 1px solid black;" ><td style="padding:8px;border: 1px solid black; text-align:center;" colspan="3"> No record found !</td></tr>';
                   }

                   var footer_ui = '</table>';
                   var complete_ui = header_ui+show_data_append+footer_ui;
                   $("#save_record_div").show();
                   $("#update_record_div").hide();
                   $("#show_edit_part").html(complete_ui);
             }, null);

      });

    }

    // Edit user details.
    function editUserRecord(user_id)
    {
        mywebdb.transaction(function (tx) 
        {
              tx.executeSql('SELECT user_id, name, type, uprice, quantity, tprice FROM user_details WHERE user_id = "'+ user_id+ '"', [], function (tx, results) 
              {
                    var record_data =  results.rows.item(0);
                    $("#save_record_div").hide();
                    $("#update_record_div").show();
                    $("#edit_user_id").val(record_data.user_id);
                    $("#name").val(record_data.name);
                    $("#type").val(record_data.type);
                    $("#uprice").val(record_data.uprice);
                    $("#quantity").val(record_data.quantity);
                    $("#tprice").val(record_data.tprice);
              }, null);
        });
    }

    // Update user details.
    function updateUserDetails() 
    {

        var name_val = $.trim($("#name").val());
        var type_val = $.trim($("#type").val());
        var uprice_val = $.trim($("#uprice").val());
        var quantity_val = $.trim($("#quantity").val());
        var tprice_val =$.trim($("#tprice").val());
        var update_user_id = $.trim($("#edit_user_id").val());

        if(name_val == '')
        {
          alert("Please enter your product name."); 
          $("#name").focus(); return false; 
        }
        if(type_val == '')
        {
          alert("Please enter your product type."); 
          $("#type").focus(); return false; 
        }
        if(uprice_val == '')
        {

          alert("Please enter your unit price."); 
          $("#uprice").focus(); return false; 
        }
		   if(quantity_val == '')
        {
          alert("Please enter your quantity."); 
          $("#quantity").focus(); return false; 
        }

        if(name_val !='' && type_val!='' && uprice_val!='' && quantity_val!='' && tprice_val!='')
        {
            mywebdb.transaction(function(tx) 
            {
                tx.executeSql("UPDATE user_details SET name = ?, type = ?, uprice= ?, quantity = ? , tprice= ? WHERE user_id = ?", 
                [name_val, type_val , uprice_val, quantity_val, tprice_val, update_user_id],showSavedUserDetails(), onError);
            }); 
        }
    }

    // Delete user details.
    function deleteUserRecord(delete_user_id) 
    { 
        var do_it = confirm("Do you really want to delete this record ? ");
        if (do_it) 
        {
            mywebdb.transaction(function(tx) 
            {
                 tx.executeSql('DELETE FROM user_details WHERE user_id = "'+delete_user_id+'" ');
            });

            showSavedUserDetails();
        }
    }

    // It will show query error if something is wrong with query.
    function onError(tx, error) 
    {
      alert(error.message);
      //$('#SyncProgress').html(error.message).css("color","red");
    }

    // drop tables.
    function dropTables() 
    {
       mywebdb.transaction(function(tx) 
       {
          tx.executeSql("DROP TABLE user_details", []); 
       });

    }
    //Total 
   function totalUserDetails(){

    var uprice_val = $.trim($("#uprice").val());
    var quantity_val = $.trim($("#quantity").val());
   
    var total=uprice_val*quantity_val

    $("#tprice").val(total);



   }

    