function _$(string){
    return document.querySelector(string);
}

function _$$(string){
    return document.querySelectorAll(string);
}

function isObject(variable){
    return typeof variable === 'object' && variable !== null
}

function isSet(variable){
    return typeof variable !== 'undefined' && variable !== null
}

function sendRequest(dataName, data, dataType = 'POST+JSON') {
    let request = new XMLHttpRequest();
    request.open('POST', 'server.php');
    if (dataType === 'JSON'){
        //работает но читать данные можно только из php://input, $_POST приходит пустой, что не очень удобно
        request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        data = JSON.stringify(data);
    }
    else if (dataType === 'POST+JSON'){
        //поэтому посылаем обычный POST в котором данные в JSON
        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        data = dataName + "=" + JSON.stringify(data);
    }
    else if (dataType === 'POST'){
        //посылаем обычный POST
        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        data = dataName + "=" + data;
    }
    else {return}

    request.send(data);

    /*request.onload = function(){
        console.log(request.statusText);
        console.log(request.responseText);
        console.log(data);
    }*/
}

function Fight(FirstOpp = "firstOpp",
               SecondOpp = "secondOpp",
               HitsFrom = 1,
               HitsTo = 0,
               Warning = "",
               WarningOpp = "")
{
    this.firstOpp = FirstOpp;
    this.hitsFrom = HitsFrom;
    this.warning = Warning;
    this.secondOpp = SecondOpp;
    this.hitsTo = HitsTo;
    this.warningOpp = WarningOpp;
}


let datalist = document.getElementById('members');
db.forEach(function(member){
    let option = document.createElement('option');
    option.value = member.nick;
    datalist.appendChild(option);
});

let readyToStart = false;
let addButton = _$('.add-member-form button');
let memberInput = _$('.add-member-form input');
let tableBody = _$('.member-table > tbody');
let startButton = _$('.startButton');
let bayAddButton = _$('.bay-add-btn');

//if (!isSet(tournamentMembers))  tournamentMembers = [];
if (!isSet(tournamentMembers)) tournamentMembers = [{"id":"297","nick":"Абигор","rating":"1569","warning":0},{"id":"239","nick":"Август","rating":"1546","warning":0},{"id":"1","nick":"Агнарр","rating":"1649","warning":0},{"id":"216","nick":"Айвен","rating":"1548","warning":0},{"id":"254","nick":"Айдзен","rating":"1593","warning":0},{"id":"317","nick":"Айлин","rating":"1517","warning":0},{"id":"323","nick":"Айлиэ","rating":"1572","warning":0},{"id":"2","nick":"Айона","rating":"1506","warning":0},{"id":"172","nick":"Акир","rating":"1538","warning":0},{"id":"255","nick":"Аксинья","rating":"1565","warning":0},{"id":"265","nick":"Александров Илья","rating":"1640","warning":0},{"id":"178","nick":"Алу","rating":"1569","warning":0},{"id":"345","nick":"Аль-Шурай Александр","rating":"1646","warning":0},{"id":"415","nick":"Амаллир","rating":"1609","warning":0},{"id":"193","nick":"Андерсон","rating":"1645","warning":0},{"id":"11","nick":"Блади","rating":"1769","warning":0}];
//if (!isSet(tournamentMembers)) {tournamentMembers = [{"id":"297","nick":"1","rating":"1569","warning":0},{"id":"239","nick":"2","rating":"1546","warning":0},{"id":"1","nick":"3","rating":"1649","warning":0},{"id":"216","nick":"4","rating":"1548","warning":0},{"id":"254","nick":"5","rating":"1593","warning":0},{"id":"317","nick":"6","rating":"1517","warning":0},{"id":"323","nick":"7","rating":"1572","warning":0},{"id":"2","nick":"8","rating":"1506","warning":0},{"id":"172","nick":"9","rating":"1538","warning":0},{"id":"255","nick":"10","rating":"1565","warning":0},{"id":"265","nick":"11","rating":"1640","warning":0},{"id":"178","nick":"12","rating":"1569","warning":0},{"id":"345","nick":"13","rating":"1646","warning":0},{"id":"415","nick":"14","rating":"1609","warning":0},{"id":"193","nick":"15","rating":"1645","warning":0},{"id":"11","nick":"16","rating":"1769","warning":0}];}
else {renderingMemberTable();}

//функция отрисовки написана с целью минимизировать время и количество кода,
//чтобы не писать функции на обновление нумерации и сортировки при удалении и добавлении элементов
//и вызывается каждый раз когда что-то меняется
function renderingMemberTable(){

    let trsExisting = _$$('.member-table > tbody > tr');
    trsExisting.forEach(function(tr){
        tr.remove();
    });

    //tournamentMembers.sort((a, b) => a.nick > b.nick ? 1 : -1);
    tournamentMembers.sort((a,b) => +a.rating < +b.rating ? 1 : -1);
    //tournamentMembers.sort((a, b) => +a.nick > +b.nick ? 1 : -1);

    let numberOfMember = 1;

    for (let member of tournamentMembers){
        let tr = document.createElement('tr');
        let tds = [document.createElement('td'),document.createElement('td'), document.createElement('td'), document.createElement('td')];
        let delButton = document.createElement('button');

        delButton.innerText = 'X';
        delButton.setAttribute("data", numberOfMember-1);
        delButton.onclick = function(){
            tournamentMembers.splice(this.getAttribute('data'),1);
            renderingMemberTable();
        };

        tds[0].innerText = numberOfMember++;
        tds[1].innerText = member.nick;
        tds[2].innerText = member.rating;
        tds[3].appendChild(delButton);

        tds.forEach(function(td){
            tr.appendChild(td);
        });

        tableBody.appendChild(tr);

    }

    if (tournamentMembers.length === 16){
        addButton.setAttribute('disabled', 'disabled');
        memberInput.setAttribute('disabled', 'disabled');
        memberInput.value = "Добавлено 16 участников";
        startButton.removeAttribute('disabled');
        readyToStart = true;
    }
    else{
        memberInput.value = "";
        if (readyToStart){
            addButton.removeAttribute('disabled');
            memberInput.removeAttribute('disabled');
            startButton.setAttribute('disabled', 'disabled');
            memberInput.value = "";
            readyToStart = false;
        }
    }

    sendRequest("memberData", tournamentMembers);
}

addButton.addEventListener('click', function(){
    let nick = memberInput.value;
    let regExp = /^[а-яё -]+$/i;

    if (nick && regExp.test(nick)){

        let uniqueNick = true;
        if (tournamentMembers.some(function(member){
            if (member.nick === nick) return true;
        })) uniqueNick = false;

        if (uniqueNick){
            for (let player of db){
                if (nick === player.nick){
                    player.warning = 0;
                    tournamentMembers.push(player);
                    break;
                }
            }
        }
        else{
            memberInput.value = '';
        }
    }
    renderingMemberTable();
});

//соотвествует именам классов инпутов в верстке
let roundNames = [
    "16",     //0
    "8-h",    //1
    "8-l-1",  //2
    "8-l-2",  //3
    "4-h" ,   //4
    "4-l-1",  //5
    "4-l-2",  //6
    "2-h" ,   //7
    "2-l-1",  //8
    "2-l-2" , //9
    "final",  //10
    "final-2" //11
];

//порядок туров и кто куда из них попадает 1-в случае победы 2-в случае поражения
let roundOrder = {
    "16" : ["8-h", "8-l-1"], //0
    "8-h": ["4-h", "8-l-2"],  //1
    "8-l-1" : ["8-l-2"],  //2
    "8-l-2" : ["4-l-1"],  //3
    "4-h" : ["2-h", "4-l-2"] ,   //4
    "4-l-1" : ["4-l-2"],  //5
    "4-l-2" : ["2-l-1"],  //6
    "2-h" : ['final', "2-l-2"] ,   //7
    "2-l-1" : ["2-l-2"],  //8
    "2-l-2" : ['final'] , //9
    "final" : ['final-2'], //10
    "final-2" : ['winner-2']
};

//количество боев в каждом раунде
let numberOfFight =  [
    8,
    4,
    4,
    4,
    2,
    2,
    2,
    1,
    1,
    1,
    1,
    1
];


let tournamentInputs = {};
let roundButtons = {};
let tournamentDataInitialized = isSet(tournamentData);
if (!tournamentDataInitialized) {
    tournamentData = {};
}
if (!warnings) {
    warnings = {};
    tournamentMembers.forEach( function(member){
        warnings[member.nick] = 0;
    })
}

function addEventOnWarningInput(roundName, n){
    tournamentInputs[roundName][n].addEventListener("focus", function(){
        tournamentInputs[roundName][n].setAttribute('data', tournamentInputs[roundName][n].value)
    });
    tournamentInputs[roundName][n].addEventListener("change", function(){
        let memberName = tournamentInputs[roundName][n-2].value;
        memberName = memberName.includes('(') ? memberName.substr(0, memberName.length-3) : memberName;
        let change = tournamentInputs[roundName][n].value - tournamentInputs[roundName][n].getAttribute('data');
        tournamentInputs[roundName][n].setAttribute('data', tournamentInputs[roundName][n].value);
        warnings[memberName] += change;
        sendRequest('warnings', warnings);
        let numberOfFight;
        let property;
        if (n % 2) {
            numberOfFight = ((n+1)/6)-1;
            property = 'warningOpp';
        }
        else{
            numberOfFight = (n-2)/6;
            property = 'warning';
        }
        tournamentData[roundName][numberOfFight][property] = tournamentInputs[roundName][n].value;
        renderingTournamentTable();
    });
}

// createArrayOfInputsButtonsAndData инициализируем таблицу данных, собираем кнопки, инпуты и вешаем обработчики предупреждений
roundNames.forEach(function(roundName){
    if (!tournamentDataInitialized) tournamentData[roundName] = [];
    tournamentInputs[roundName] = _$$(".r-" + roundName + ' input');
    for (let i = 0; i < tournamentInputs[roundName].length; i +=6 ){
        addEventOnWarningInput(roundName, i+2);
        addEventOnWarningInput(roundName, i+5);
    }
    roundButtons[roundName] =  _$('.r-' + roundName + '-btn') ;
    if (roundName !== "16") roundButtons[roundName].setAttribute("disabled", 'disabled');
});


//одна функция на отрисовка всей таблицы, вызываем каждый раз, когда поменялась дата, перерисовывает все сразу
function renderingTournamentTable(){
    for (let i = 0; i < roundNames.length ; i++){
        let roundName = roundNames[i];
        if (tournamentData[roundName].length){
               let j = 0;
               /*перебирает поля файта
               j
               0 - ник бойца 1 (достается из объекта отсюда тернарник в присвоении)
               1 - нанесенные им хиты
               2 - предупреждения 1
               3 - ник бойца 2
               4 - нанесенные им хиты
               5 - предупреждения 2
               */
               tournamentData[roundName].forEach(function(fight){
                   for (let key in fight){
                       tournamentInputs[roundName][j].value = fight[key];
                       if (/*(i > lastRoundNumber) && */warnings[fight[key]])
                       {
                           tournamentInputs[roundName][j].value += "(" + warnings[fight[key]] + ")";
                       }
                       j++;
                   }
               })
        }
    }
}

bayAddButton.onclick = function(){
    if (confirm('Вы уверены что внесли всех участников турнира в таблицу?(Все пустные места будут заполены баями)')){
        tournamentMembers.sort((a,b) => +a.rating < +b.rating ? 1 : -1);
        let bayQuantity = 16 - tournamentMembers.length;
        for (let i = 0; i < bayQuantity; i++ ){
            let rating1 = +tournamentMembers[7+i].rating;
            let rating2 = +tournamentMembers[8+i].rating;
            let newRating = Math.round((rating1 + rating2)/2);
            tournamentMembers.splice(8+i, 0, {"id":"", "nick": 'Бай', "rating": newRating})
            //tournamentMembers.push({"id":"b" + i, "nick": '_Бай' + i, "rating": newRating});
        }
    }

    renderingMemberTable();
};

startButton.addEventListener('click',function(){
    let tournamentTable = _$(".tournamentTable");
    let startScreen = _$(".startScreen");

    tournamentTable.style.display='table';
    startScreen.style.display='none';

    if (!tournamentDataInitialized){

        tournamentMembers.sort((a,b) => +a.rating < +b.rating ? 1 : -1);

        let roundNumber = 0;
        for (let i = 0; i < numberOfFight[roundNumber]; i++){
            tournamentData[roundNames[roundNumber]][i] = new Fight(tournamentMembers[i].nick, tournamentMembers[8+i].nick)
        }
    }
    else
    {
        for (let roundNumber = 0; roundNumber <= lastRoundNumber; roundNumber++){
            nextRoundButtonUnblock(roundNumber);
            previousRoundButtonBlock(roundNumber);
            if (roundNumber === 11){
                _$$('.r-final-2-hidden').forEach(function(element){
                    element.style.visibility = 'visible';
                });
                roundButtons['final-2'].removeAttribute('disabled');
                roundButtons['final-2'].classList.add('current-btn');
                roundButtons['final'].classList.remove('current-btn');
            }
        }
    }

    renderingTournamentTable();
});

function nextRoundButtonUnblock(roundNumber){
    let nextRoundNumber = roundNumber + 1;
    if (roundNames[nextRoundNumber] && roundNames[nextRoundNumber] !== "final-2") {
        roundButtons[roundNames[nextRoundNumber]].removeAttribute('disabled');
        roundButtons[roundNames[nextRoundNumber]].classList.add('current-btn');
        roundButtons[roundNames[roundNumber]].classList.remove('current-btn');
    }
}

function previousRoundButtonBlock(roundNumber){
    let roundName = roundNames[roundNumber];
    switch (roundName) {
        case '8-h' :
            roundButtons['16'].setAttribute("disabled", 'disabled');
            break;
        case '8-l-2' :
            roundButtons['8-h'].setAttribute("disabled", 'disabled');
            roundButtons['8-l-1'].setAttribute("disabled", 'disabled');
            break;
        case '4-l-1' :
            roundButtons['8-l-2'].setAttribute("disabled", 'disabled');
            break;
        case '4-l-2' :
            roundButtons['4-l-1'].setAttribute("disabled", 'disabled');
            roundButtons['4-h'].setAttribute("disabled", 'disabled');
            break;
        case '2-l-1' :
            roundButtons['4-l-2'].setAttribute("disabled", 'disabled');
            break;
        case '2-l-2' :
            roundButtons['2-l-1'].setAttribute("disabled", 'disabled');
            roundButtons['2-h'].setAttribute("disabled", 'disabled');
            break;
        case 'final' :
            roundButtons['2-l-2'].setAttribute("disabled", 'disabled');
            break;
    }
}

let buttonDisableLogicOn = true;

for (let roundNumber = 0; roundNumber < roundNames.length; roundNumber++){
    let roundName = roundNames[roundNumber];
    let nextRoundLose = roundOrder[roundName][1] ? roundOrder[roundName][1] : '';
    roundButtons[roundName].onclick = function(){

        let roundInputs = tournamentInputs[roundName];
        let roundData = tournamentData[roundName];
        let j = 0;
        let roundFinished = false;

        for (let i = 0; i < numberOfFight[roundNumber]; i++){
            let fight =  roundData[i];
            if(roundInputs[j+1].value != 0 || roundInputs[j+4].value != 0){
                for (let key in fight){
                    if (roundInputs[j].value.includes('(')){
                        fight[key] =  roundInputs[j].value.substr(0, roundInputs[j].value.length-3)
                    } else {
                        fight[key] = roundInputs[j].value;
                    }
                    j++;
                }
                if (i === numberOfFight[roundNumber]-1){roundFinished = true}
            }
            else {
                alert('Тур еще не закончен!!!');
                break;
            }
        }

        if (roundFinished) {
            // финальный тур 1 или 2 боя
            if (roundName === "final" || roundName ==="final-2"){
                let fight = roundData[0];
                if (roundName === "final"){
                    if (fight.hitsFrom > fight.hitsTo){
                        _$(".winner-1 input").value = fight.firstOpp;
                        roundButtons['final'].classList.remove('current-btn');
                        if (tournamentData['final-2'][0]){
                            tournamentData['final-2'][0] = undefined;
                            _$$('.r-final-2-hidden').forEach(function(element){
                                element.style.visibility = 'hidden';
                            });
                            roundButtons['final-2'].setAttribute('disabled','disabled');
                            roundButtons['final-2'].classList.remove('current-btn');
                            roundButtons['final'].classList.add('current-btn');
                        }
                    }
                    else {
                        _$(".winner-1 input").value = fight.secondOpp;
                        _$$('.r-final-2-hidden').forEach(function(element){
                            element.style.visibility = 'visible';
                        });
                        roundButtons['final-2'].removeAttribute('disabled');
                        roundButtons['final-2'].classList.add('current-btn');
                        roundButtons['final'].classList.remove('current-btn');
                        tournamentData['final-2'][0] = new Fight(fight.firstOpp, fight.secondOpp);
                    }
                }
                else{//второй бой финала
                    _$(".winner-2 input").value = (fight.hitsFrom > fight.hitsTo) ? fight.firstOpp : fight.secondOpp;
                    roundButtons['final-2'].classList.remove('current-btn');
                }
            }
            else{//все туры кроме финала

                let nextRoundWinData = tournamentData[roundOrder[roundName][0]];
                if (!(roundName === "8-l-1" || roundName === '4-l-1' || roundName === '2-l-1' || roundName === '2-l-2'))
                    nextRoundWinData.length = 0;
                if (nextRoundLose){
                    var nextRoundLoseData = tournamentData[nextRoundLose];
                    nextRoundLoseData.length = 0;
                }

                let winners = [];
                let losers = [];

                //формируем массивы победителей и проигравших в этом раунде
                roundData.forEach(function (fight) {
                    if (fight.hitsFrom > fight.hitsTo) {
                        winners.push(fight.firstOpp);
                        if (roundOrder[roundName][1])
                            losers.push(fight.secondOpp);
                    }
                    else
                    {
                        winners.push(fight.secondOpp);
                        if (roundOrder[roundName][1])
                            losers.push(fight.firstOpp);
                    }

                });

                //Обработка победителей в верхней и нижней сетках
                //сначала в в нижней : добавление победителей из этого раунда в уже сформированные бои следующего тура
                if (roundName === "8-l-1" || roundName === '4-l-1' || roundName === '2-l-1' || roundName === '2-l-2'){
                    if (nextRoundWinData[0])
                        if (roundName === '2-l-2'){//добавление второго участника в финал
                            nextRoundWinData[0].secondOpp = winners[0];
                        }
                        else{
                            //добавление второго участника(победителя нижней сетки) в бои нижней сетки второй части тура
                            for (let i = 0; i < winners.length; i++) {
                                nextRoundWinData[i].firstOpp = winners[i];
                            }
                        }
                }
                else{
                    //верхняя сетка формирование следующего раунда
                    for (let i = 0; i < winners.length; i += 2){
                        nextRoundWinData.push(new Fight(winners[i], winners[i+1]))
                    }
                }

                //создание боев тура нижней сетки, если такой есть у текущего(тур верхней сетки)
                if (nextRoundLose){
                    if (nextRoundLose === "8-l-1"){
                        for (let i = 0; i < losers.length; i += 2){
                            nextRoundLoseData.unshift(new Fight( losers[i], losers[i+1]));
                        }
                    }
                    else{
                        for (let i = 0; i < losers.length; i += 2){
                            nextRoundLoseData.push(new Fight("", losers[i]));
                            if (losers[i+1])
                                nextRoundLoseData.push(new Fight("", losers[i+1]))
                        }
                    }
                }
            }

            sendRequest('tournamentData', tournamentData);
            sendRequest('lastRoundNumber', roundNumber, "POST");
            if (lastRoundNumber < roundNumber) {lastRoundNumber = roundNumber}

            renderingTournamentTable();

            if (buttonDisableLogicOn) {
                previousRoundButtonBlock(roundNumber);
            }

            nextRoundButtonUnblock(roundNumber);

        }
    };
}

let unblockButton = _$('.unblock-btn');
let buttonLogicChkbx = _$('#button-logic-chkbx');
buttonLogicChkbx.onchange = function(){
  if (this.checked) {
      buttonDisableLogicOn = true;
      unblockButton.setAttribute("disabled", 'disabled')
  }
    else {
        buttonDisableLogicOn = false;
        unblockButton.removeAttribute("disabled")
    }
};

unblockButton.onclick = function(){
    buttonLogicChkbx.checked = false;
    buttonDisableLogicOn = false;
    for (let key in roundButtons)
    {
        roundButtons[key].removeAttribute("disabled");
    }
};

let reloadTournamentBtns = _$$('.reload-tournament-table-btn');
let reloadSessionBtns = _$$('.reload-session-btn');

reloadSessionBtns.forEach(function(reloadSessionBtn){
    reloadSessionBtn.onclick = function(){
        sendRequest('resetSession', 'true');
        if (confirm('Перезагрузить страницу?')){
            window.location.reload();
        }
    };
});

reloadTournamentBtns.forEach(function(reloadTournamentBtn){
    reloadTournamentBtn.onclick = function(){
        sendRequest('resetTournamentData', 'true');
        if (confirm('Перезагрузить страницу?')){
            window.location.reload();
        }
    };
});