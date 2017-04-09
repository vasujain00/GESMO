<?php
include_once 'dbconfig.php';

$Key="Miley Cyrus";
$sql = "SELECT DISTINCT Album FROM tbl_uploads WHERE artistname='$Key'";
$result = mysqli_query($link, $sql) or die("Error in Selecting " . mysqli_error($link));

 $emparray = array();
    while($row =mysqli_fetch_assoc($result))
    {
        
        $emparray[0]="Albums";
        $emparray[]= $row;
    }

    echo json_encode($emparray);

    //close the db connection //juliu1423
    mysqli_close($link);

?>