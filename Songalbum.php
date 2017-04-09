<?php
include_once 'dbconfig.php';

$uri = $_SERVER['QUERY_STRING'];
parse_str($uri, $output);
$album_id = intval($output['album_id']);

$sql = "SELECT  * FROM tbl_uploads WHERE album_id='$album_id'";
$result = mysqli_query($link, $sql) or die("Error in Selecting " . mysqli_error($link));

 $emparray = array();
    while($row =mysqli_fetch_assoc($result))
    {
        $emparray[]= $row;
    }

    echo json_encode($emparray);

    //close the db connection //juliu1423
    mysqli_close($link);

?>