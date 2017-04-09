<?php
include_once 'dbconfig.php';

$uri = $_SERVER['QUERY_STRING'];
parse_str($uri, $output);
$genre_id = intval($output['genre_id']);

$sql = "SELECT * FROM tbl_uploads WHERE genre_id='$genre_id' ORDER BY id desc limit 10";
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