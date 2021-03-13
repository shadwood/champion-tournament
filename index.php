<?
    session_start();
    if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW'])){
        header('WWW-Authenticate: Basic realm="Champion page"');
        header('HTTP/1.0 401 Unauthorized');
        exit("Доступ запрещен");
    }
    else
    {
        require_once 'db.php';

        /*$player = [];
        $query = 'SELECT id, nick, rating FROM srt_stat';
        $result = mysqli_query($link, $query);
        while ($row = mysqli_fetch_assoc($result)){
            $player[] = $row;
        }

        echo json_encode($player);*/

        $auth = false;
        $query = 'SELECT * FROM srt_user';
        $result = mysqli_query($link, $query);
        while ($row = mysqli_fetch_assoc($result)){
            if ($row['login'] == $_SERVER['PHP_AUTH_USER'] && password_verify($_SERVER['PHP_AUTH_PW'], $row['pass']) ){
                $auth = true;
            }
        }

        mysqli_free_result($result);
        mysqli_close($link);

        if ($auth == false){
            header('WWW-Authenticate: Basic realm="Champion page"');
            header('HTTP/1.0 401 Unauthorized');
            exit("Доступ запрещен");
        }
        else
        {
            require_once ('template/table.php');
        }
    }