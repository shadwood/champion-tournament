<?php
    session_start();

    if ($_POST['memberData']){
        $_SESSION['memberData'] = $_POST['memberData'];
    }

    if ($_POST['tournamentData']){
        $_SESSION['tournamentData'] = $_POST['tournamentData'];
    }

    if ($_POST['lastRoundNumber']){
        $_SESSION['lastRoundNumber'] = $_POST['lastRoundNumber'];
    }

    if ($_POST['resetTournamentData']){
       unset($_SESSION['tournamentData']) ;
       unset($_SESSION['lastRoundNumber']) ;
    }

    if ($_POST['resetSession']){
        $_SESSION = [];
    }