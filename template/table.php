<!DOCTYPE html>
<html lang="ru">
    <head>
        <meta charset="utf-8">
        <title>Турнир чемпионов</title>
        <link rel="stylesheet" href="template/tourneyGrid/css/tourneystyle.css" type="text/css">
    </head>
    <body>
        <div class="startScreen">
            <div>
                <div class="add-member-form">
                    <p><input list="members" type="text"></p>
                    <p>
                        <button>Добавить</button>
                    </p>
                </div>

                <div>
                    <p>
                        <button class="bay-add-btn">Добавить бои бай</button>
                    </p>
                </div>

                <table class="member-table">
                    <thead>
                    <tr>
                        <td>Номер</td><td>Ник</td><td>Рейтинг</td><td>Удалить</td>
                    </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>

                <button class="startButton" disabled>Начать турнир</button>
            </div>

            <div class = 'control-panel-top'>
                <p><button class="reload-tournament-table-btn">Очистить таблицу туринира</button></p>
                <p><button class="reload-session-btn">Очистить текущую сессию</button></p>
            </div>
        </div>

        <?require_once "template/tourneyGrid/table.html"?>

        <datalist id="members">
        </datalist>

        <script>
            let tournamentMembers, tournamentData,  warnings;
            let lastRoundNumber = 0;
        <? if (isset($_SESSION['memberData'])) { ?>
            tournamentMembers = JSON.parse('<?=$_SESSION['memberData']?>');
        <? } ?>
        <? if (isset($_SESSION['tournamentData'])) { ?>
            tournamentData = JSON.parse('<?=$_SESSION['tournamentData']?>');
        <? } ?>
        <? if (isset($_SESSION['lastRoundNumber'])) { ?>
            lastRoundNumber = <?=$_SESSION['lastRoundNumber']?>;
        <? } ?>
        <? if (isset($_SESSION['warnings'])) { ?>
            warnings = <?=$_SESSION['warnings']?>;
        <? } ?>
        </script>
        <script src = "template/db.js"></script>
        <script src = "template/script.js"></script>
    </body>
</html>