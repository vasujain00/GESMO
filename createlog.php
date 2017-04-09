<?php
$uri = $_SERVER['QUERY_STRING'];
parse_str($uri, $output);
$logFileName = $output['filename'];

$myfile = fopen("logs/$logFileName", "w") or die("Unable to open file!");
$txt = "Log Start\n";
fwrite($myfile, $txt);
fclose($myfile);

 $emparray = array();
 echo json_encode($emparray);
?>