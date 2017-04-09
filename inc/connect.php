<?php

class Database{
	private $host="localhost";
	private $db_name="homedecor";
	private $username="root";
	private $password="anurag";


	private $conn;
	public function dbConnect(){
		$this->conn=null;
		
			//$this->conn=@mysqli_connect($this->host,$this->username,$this->password,$this->db_name);
			$this->conn=@mysql_connect($this->host,$this->username,$this->password);

			if(!$this->conn){
				die('Could not connect'.mysql_error());
			}

		mysql_select_db($this->db_name) or die('Could not connect to database '.mysql_error());

	}

	public function getConn(){
		return $this->conn;
	}
}



?>