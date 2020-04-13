<?php
 
class DbOperation
{
    //Database connection link
    private $con;
 
    //Class constructor
    function __construct()
    {
        //Getting the DbConnect.php file
        require_once dirname(__FILE__) . '/DbConnect.php';
 
        //Creating a DbConnect object to connect to the database
        $db = new DbConnect();
 
        //Initializing our connection link of this class
        //by calling the method connect of DbConnect class
        $this->con = $db->connect();
    }
	
	/*
	* The create operation
	* When this method is called a new record is created in the database
	*/
		
	function createsales($product_name,$product_type,$unit_price,$quantity,$total_price){
		$stmt = $this->con->prepare("INSERT INTO sales (product_name,product_type,unit_price,quantity,total_price) VALUES ('$product_name','$product_type','$unit_price','$quantity','$total_price')");
		//$stmt->bind_param("ssis", $name, $realname, $rating, $teamaffiliation);
		
		if($stmt->execute()){
			return true; 
		}else{
		   return false;
		}		
	}

	/*
	* The read operation
	* When this method is called it is returning all the existing record of the database
	*/
	function getsales(){
		$stmt = $this->con->prepare("SELECT product_id, product_name, product_type, unit_price, quantity, total_price FROM sales");
		$stmt->execute();
		$stmt->bind_result($product_id, $product_name, $product_type, $unit_price, $quantity, $total_price);
		
		$sales = array(); 
		
		while($stmt->fetch()){
			$sale  = array();
			$sale['product_id'] = $product_id; 
			$sale['product_name'] = $product_name; 
			$sale['product_type'] = $product_type; 
			$sale['unit_price'] = $unit_price; 
			$sale['quantity'] = $quantity;
            $sale['total_price'] = $total_price; 		
			
			array_push($sales, $sale); 
		}
		
		return $sales; 
	}
	
	function getsalesById($product_id){
		$stmt = $this->con->prepare("SELECT product_id, product_name, product_type, unit_price, quantity, total_price FROM sales WHERE product_id='$product_id'");
		$stmt->execute();
		$stmt->bind_result($product_id,$product_name,$product_type,$unit_price,$quantity,$total_price);
		
		$Sales = array(); 
		
		while($stmt->fetch()){
			$sale  = array();
			$sale['product_id'] = $product_id; 
			$sale['product_name'] = $product_name; 
			$sale['product_type'] = $product_type; 
			$sale['unit_price'] = $unit_price; 
			$sale['quantity'] = $quantity;
            $sale['total_price'] = $total_price; 
            			
			array_push($sales, $sale); 
		}
		
		return $sales; 
	}
	
	/*
	* The update operation
	* When this method is called the record with the given id is updated with the new given values
	*/
	function updatesales($product_id,$product_name,$product_type,$unit_price,$quantity,$total_price){
		$stmt = $this->con->prepare("UPDATE sales SET product_name='$product_name',product_type='$product_type',unit_price='$unit_price',quantity='$quantity',total_price='$total_price' WHERE product_id='$product_id'");
		//$stmt->bind_param("ssisi", $name, $realname, $rating, $teamaffiliation, $id);
		if($stmt->execute()){
			return true; 
		}else{
		return false;
        }		
	}
		
	/*
	* The delete operation
	* When this method is called record is deleted for the given id 
	*/
	function deletesale($product_id) {
		$stmt = $this->con->prepare("DELETE FROM sales WHERE product_id='$product_id' ");
		
		if($stmt->execute()){
			return true; 
		}else{
		
		return false; 
		}
	}
}