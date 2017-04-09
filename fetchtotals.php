<?php
include_once 'dbconfig.php';

$result1 = mysqli_query($link, "SELECT * FROM artists");
$num_rows1 = mysqli_num_rows($result1);

$result2 = mysqli_query($link, "SELECT * FROM albums");
$num_rows2 = mysqli_num_rows($result2);

$result3 = mysqli_query($link, "SELECT * FROM genres");
$num_rows3 = mysqli_num_rows($result3);

$result4 = mysqli_query($link, "SELECT * FROM tbl_uploads");
$num_rows4 = mysqli_num_rows($result4);

 $emparray = array(
 		'artists' => $num_rows1,
 		'albums' => $num_rows2,
 		'genres' => $num_rows3,
 		'songs' => $num_rows4
 	);

    echo json_encode($emparray);

    //close the db connection //juliu1423
    mysqli_close($link);

?>