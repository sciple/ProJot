<?php
   $json = $_POST['json'];
   if (json_decode($json) != null) { /* sanity check */
    /*  this should also post to deploy path*/
     $file = fopen('../../assets/data/data.txt','w+');
     fwrite($file, $json);
     fclose($file);
   } else {
      echo("Hello world!");
   }
?>
