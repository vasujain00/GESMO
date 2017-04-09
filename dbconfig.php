<?php
$dbhost = "localhost";
$dbuser = "root";
$dbpass = "";
$dbname = "gesmo";
ini_set('upload_max_filesize', '10M');
ini_set('post_max_size', '10M');
ini_set('max_input_time', 300);
ini_set('max_execution_time', 300);
$link=mysqli_connect($dbhost,$dbuser,$dbpass) or die('cannot connect to the server'); 
mysqli_select_db($link,$dbname) or die('database selection problem');
?>