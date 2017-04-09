<?php
$logFileName = $_POST["filename"];
$data = $_POST["data"];

file_put_contents("logs/$logFileName", print_r($data, true) , FILE_APPEND | LOCK_EX);


 $emparray = array();
 echo json_encode($emparray);
?>