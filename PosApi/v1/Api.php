<?php 

	//getting the dboperation class
	require_once '../includes/DbOperation.php';

	//function validating all the paramters are available
	//we will pass the required parameters to this function 
	function isTheseParametersAvailable($params){
		//assuming all parameters are available 
		$available = true; 
		$missingparams = ""; 
		
		foreach($params as $param){
			if(!isset($_POST[$param]) || strlen($_POST[$param])<=0){
				$available = false; 
				$missingparams = $missingparams . ", " . $param; 
			}
		}
		
		//if parameters are missing 
		if(!$available){
			$response = array(); 
			$response['error'] = true; 
			$response['message'] = 'Parameters ' . substr($missingparams, 1, strlen($missingparams)) . ' missing';
			
			//displaying error
			echo json_encode($response);
			
			//stopping further execution
			die();
		}
	}
	
	//an array to display response
	$response = array();
	
	//if it is an api call 
	//that means a get parameter named api call is set in the URL 
	//and with this parameter we are concluding that it is an api call
	if(isset($_GET['apicall'])){
		
		switch($_GET['apicall']){
			
			//the CREATE operation
			//if the api call value is 'createpos'
			//we will create a record in the database
			case 'createpos':
				//first check the parameters required for this request are available or not 
				isTheseParametersAvailable(array('product_name','product_type','unit_price','quantity','total_price'));
				
				//creating a new dboperation object
				$db = new DbOperation();
				
				//creating a new record in the database
				$result = $db->createsales(
					$_POST['product_name'],
					$_POST['product_type'],
					$_POST['unit_price'],
					$_POST['quantity'],
					$_POST['total_price']
					
				);
				

				//if the record is created adding success to response
				if($result){
					//record is created means there is no error
					$response['error'] = false; 

					//in message we have a success message
					$response['message'] = 'Sale addedd successfully';

					//and we are getting all the heroes from the database in the response
					$response['Sale'] = $db->getSales();
				}else{

					//if record is not added that means there is an error 
					$response['error'] = true; 

					//and we have the error message
					$response['message'] = 'Some error occurred please try again';
				}
				
			break; 
			
			//the READ operation
			//if the call is getsales
			case 'getSale':
				$db = new DbOperation();
				$response['error'] = false; 
				$response['message'] = 'Request successfully completed';
				$response['Sale'] = $db->getSales();
			break; 
			
			
			//the UPDATE operation
			case 'updatepos':
				isTheseParametersAvailable(array('product_id','product_name','product_type','unit_price','quantity','total_price'));
				$db = new DbOperation();
				$result = $db->updateSales(
				    $_POST['product_id'],
					$_POST['product_name'],
					$_POST['book_type'],
					$_POST['unit_price'],
					$_POST['quantity'],
					$_POST['total_price']
				);
				
				if($result){
					$response['error'] = false; 
					$response['message'] = 'Sale updated successfully';
					$response['Sale'] = $db->getSales();
				}else{
					$response['error'] = true; 
					$response['message'] = 'Some error occurred please try again';
				}
			break; 
			
			case 'getsalebyid':
				isTheseParametersAvailable(array('product_id'));
				$db = new DbOperation();
				$result = $db->getSalesById(
				    
					$_POST['product_id']
		
				);
				
				if($result){
					$response['error'] = false; 
					$response['message'] = 'Sale updated successfully';
					$response['sales'] = $result;
				}else{
					$response['error'] = true; 
					$response['message'] = 'Some error occurred please try again';
				}
			break;
			
			//the delete operation
			case 'deleteSale':
                isTheseParametersAvailable(array('product_id'));
				
				$db = new DbOperation();
				$result = $db->deleteSales(
				    $_POST['product_id']
					
				);
				
				if($result){
					$response['error'] = false; 
					$response['message'] = 'Sale deleted successfully';
					$response['Sale'] = $db->getSales();
				}else{
					$response['error'] = true; 
					$response['message'] = 'Some error occurred please try again';
				}
			break; 
		}
		
	}else{
		//if it is not api call 
		//pushing appropriate values to response array 
		$response['error'] = true; 
		$response['message'] = 'Invalid API Call';
	}
	
	//displaying the response in json structure 
	echo json_encode($response);
	
	
