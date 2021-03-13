<?php
    $host = 'localhost';
    $user = 'root';
    $pass = 'root';
    $db = 'eprt';
    $link = mysqli_connect($host, $user, $pass, $db);
    if (mysqli_connect_errno()){
        echo mysqli_connect_error()."<br>";
        exit('Ошибка подключения к базе');
    }
