<?php
include_once 'dbconfig.php';

$g = "Hip hop";

$sql = "select * from tbl_uploads where Genre='$g' limit 3";
$result = mysqli_query($link, $sql) or die("Error in Selecting " . mysqli_error($link));

 $emparray = array();
    while($row =mysqli_fetch_assoc($result))
    {
        
        $emparray[0]="topongenre";
        $emparray[]= $row;
    }

    echo json_encode($emparray);

    //close the db connection //juliu1423
    mysqli_close($link);

?>