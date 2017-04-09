<?php
if(isset($_POST['Submit']))
{
$file_name = $_FILES['audio_file']['name'];
$file_type = "audio";

if($_FILES['audio_file']['type']=='audio/mpeg' || $_FILES['audio_file']['type']=='audio/mpeg3' || $_FILES['audio_file']['type']=='audio/x-mpeg3' || $_FILES['audio_file']['type']=='audio/mp3' || $_FILES['audio_file']['type']=='audio/x-wav' || $_FILES['audio_file']['type']=='audio/wav')
{ 
 $new_file_name=$_FILES['audio_file']['name'];

 // Where the file is going to be placed
 $target_path = "Audios/".$new_file_name;
 
 //target path where u want to store file.

  //following function will move uploaded file to audios folder. 
if(move_uploaded_file($_FILES['audio_file']['tmp_name'], $target_path)) {

  //insert query if u want to insert file
	$sql="INSERT INTO audio(audio) VALUES('new_file_name')";
		mysql_query($sql);
}
}
}

?>





<form name="audio_form" id="audio_form" action="" method="post" enctype="multipart/form-data">
<fieldset>
<label>Audio File:</label>
<input name="audio_file" id="audio_file" type="file"/>
 Song Name:<br>
  <input type="text" name="name"><br>
   Artist Name:<br>
  <input type="text" name="artist"><br>

<input type="submit" name="Submit" id="Submit" value="Submit"/>
</fieldset>
</form>
