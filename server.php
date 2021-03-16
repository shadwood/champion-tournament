<?php
    session_start();

    /*if ($_POST['getDB']){
        require_once('db.php');
        $query = "SELECT id,nick,rating from srt_stat";
        $result = mysqli_query($link, $query);
        $db = [];
        while ($member = mysqli_fetch_object($result))
        {
            $db[] = $member;
        }

        header('Content-Type: application/json');
        $db = json_encode($db);
        $_SESSION['DB'] = $db;
        echo $db;
    }*/

    if ($_POST['memberData']){
        $_SESSION['memberData'] = $_POST['memberData'];
    }

    if ($_POST['tournamentData']){
        $tournamentData = json_decode($_POST['tournamentData']);

        foreach ($tournamentData as &$tour){
            foreach ($tour as &$fight){
                foreach ($fight as &$property){
                    $property = htmlspecialchars($property);
                }
            }
        }

        $_SESSION['tournamentData'] = json_encode($tournamentData);

        /*$_SESSION['tournamentData'] = $_POST['tournamentData'];*/
    }


    if ($_POST['lastRoundNumber']){
        $_SESSION['lastRoundNumber'] = $_POST['lastRoundNumber'];
    }

    if ($_POST['warnings']){
        $_SESSION['warnings'] = $_POST['warnings'];
    }

    if ($_POST['resetTournamentData']){
       unset($_SESSION['tournamentData']) ;
       unset($_SESSION['lastRoundNumber']) ;
       unset($_SESSION['warnings']) ;
    }

    if ($_POST['resetSession']){
        $_SESSION = [];
    }
