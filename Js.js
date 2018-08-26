$(function(){
	let model = {
		amountOfplayers: 2,
		players: [],
		scoreForWin: 11,
		cardsOnTable: [],
		//Карты - всего 40
		deckOfCards: [],
        lastBribe: false,
    lastGame: false,
        playerName : "",
        playerStroke: false,
    //Классы, подлежащие удалению при уборке карты
    classes : "takenCardOnTable botTakenCardOnTable jackP jackB jackC jackT ladyP ladyB ladyC ladyT kingP kingB kingT kingC tableCards dragon"
	};







	let view = {
		//Начать игру
		startGame: function(){
			$("#secondPlayer").click(view.clickOnCard);
			$("#table, #table2").click(view.clickOnTable);
		},
		testButtons: function(){
			//Если на кнопку Выложить можно нажать
				if(controler.testGive() ) {
                    $("#give").removeClass("canNotClick").click(view.clickOnGive);
                }
				else{
					$("#give").addClass("canNotClick");
					this.deleteClickOnGive()
                }
            //Если на кнопку Взять можно нажать
				if(controler.equalsCards() ){
					$("#get").removeClass("canNotClick").click(view.clickOnGet);
				} else{
				  $("#get").addClass("canNotClick");
				  this.deleteClickOnGet()
				}
		},
		//Убрать триггеры
		deleteAllTriggers: function(){
			this.deleteClickOnCard();
			this.deleteClickOnTable();
			this.deleteClickOnGive();
			this.deleteClickOnGet();
		},
		deleteClickOnCard: function(){
            $("#secondPlayer").off('click', view.clickOnCard);
		},
        deleteClickOnTable: function(){
            $("#table").off('click', view.clickOnTable);
        },
        deleteClickOnGive: function(){
            $("#give").off('click', view.clickOnGive);
        },
        deleteClickOnGet: function(){
            $("#get").off('click', view.clickOnGet);
        },
		clickOnCard: function(e){
            let el = document.elementFromPoint(e.clientX, e.clientY);
            $(".peopleCards").removeClass("takenCard");
            //Если нажато на карточку
			//Если на элемент <i>
            if($(el).hasClass("card")) $(el).addClass("takenCard");
            else if($(el).hasClass("i1") || $(el).hasClass("i2")){
                $(el).parent().addClass("takenCard");
            }else{
                return false;
            }

            view.testButtons();
		},
        clickOnTable: function (e) {
            let el = document.elementFromPoint(e.clientX, e.clientY);
            if( $(el).hasClass("card") ){
                if($(el).hasClass("doNotTouch")){
                    return false;
                }
                $(el).toggleClass("takenCardOnTable");
            } else if($(el).hasClass("i1") || $(el).hasClass("i2")){
                $(el).parent().toggleClass("takenCardOnTable");
            }else{
                return false;
            }
            view.testButtons();
        },
        clickOnGive: function () {
		    if(model.cardsOnTable.length === 10){
		        alert("Бери!");
		        return;
            }
            controler.testArrs();
            controler.giveCard(1);
			$(".takenCard").remove();
            view.testButtons();
        },
        clickOnGet: function () {
           controler.testArrs();
            controler.getCard(1);
            $(".takenCard").remove();
            view.removeCard(".takenCardOnTable");
            view.testButtons();
        },
        clickOnLooked: function () {
            $(".statistic").removeClass("view");
            $("#looked").off('click', view.clickOnLooked);
            view.showScore();
            if(controler.testWin()){
                return true;
            }else{
                controler.startStage();
            }
        },
		//Выложить карту на стол
		layCardOnTable: function(card, time, bot){
            view.showCardsInDeck();
			let arrTd = $("#table td").get();
			for(let i = 0; i < arrTd.length; i++){
				if( $(arrTd[i]).text() === "") {
                    if(time){
                        setTimeout(function () {
                            $(arrTd[i]).removeClass("doNotTouch").addClass("tableCards " + view.classPeople(card)).attr("data-value", card).html(view.testCard(card));
                            if(bot !== undefined) controler.endOfStroke(bot);
                        }, time);
                        return true;
                    }else{
                        $(arrTd[i]).removeClass("doNotTouch").addClass("tableCards " + view.classPeople(card)).attr("data-value", card).html(view.testCard(card));
                        return true;
                    }
                }
			}
            return false;
		},
		layCardsOnTable: function(cards){
			let time = 300;
			for(let i = 0; i < cards.length; i++){
				setTimeout(function (){view.layCardOnTable(cards[i]);}, time);
				time += 300;
			}
			//Дать возможность нажатия только после "выпуска" всего контента
            if(model.playerStroke === true){
                setTimeout(function () {
                    view.startGame();
                }, time);
            }else{
                setTimeout(function () {
                    controler.bot(0);
                }, time);
            }

		},
		//Выдать карту игроку
		getCardForPlayer: function(player, card, time) {
            view.showCardsInDeck();
      if (player === 0) {
        setTimeout(function () {
          $("#firstPlayer").append("<td class='notView'></td>");
        }, time);

      } else if (player === 1) {
        setTimeout(function () {
          $("#secondPlayer").append("<td class='peopleCards card " + view.classPeople(card) +
            "' data-value='" + card + "'>" + view.testCard(card) + "</td>");
        }, time);
      }
    },
    //Если дама, валет или король
		classPeople: function(card){
		  switch (card){
        case "8П": return "jackP";
        case "8Б": return "jackB";
        case "8Ч": return "jackC";
        case "8Т": return "jackT";
        case "9П": return "ladyP";
        case "9Б": return "ladyB";
        case "9Ч": return "ladyC";
        case "9Т": return "ladyT";
        case "10П": return "kingP";
        case "10Б": return "kingB";
        case "10Ч": return "kingC";
        case "10Т": return "kingT";
        case "7П": return "dragon";
      }
			return "";
		},
		//Поставить масти к картам
		testCard: function(card){
			let sign;
			let classRed = "red";
			if(/Б/.test(card)) sign = "&#9830";
			else if(/Ч/.test(card)) sign = "&#9829";
			else if(/Т/.test(card)){
				sign = "&#9827;";
				classRed = ""
			}
			else if(/П/.test(card)){
				sign = "&#9824";
				classRed = "";
			}
			card = card.slice(0, -1) + sign;
			return "<i class='i1 " + classRed +"'>" + card + "</i>" + "<i class='i2 " + classRed + "'>" + card + "</i>";
		},
		//Бот
		botDeleteCard: function (bot, card) {
			this.showCard(card);
			setTimeout(function () {
                $(".delete").remove();
            }, 3000);
        },
		showCard: function(card){
			let notViewArr = $(".notView").get();
			let rand = Math.floor(Math.random() * notViewArr.length);
			$(notViewArr[rand]).addClass("card delete " + view.classPeople(card)).removeClass("notView").append(view.testCard(card));
		},
        botDeleteCardsOnTable: function (vals, bot) {
			for(let i = 0; i < vals.length; i++){
                $("[data-value='" + vals[i] +"'").addClass("botTakenCardOnTable");
			}
			setTimeout(function () {
                for(let i = 0; i < vals.length; i++){
                    view.removeCard("[data-value='" + vals[i] +"']");
                }
                controler.endOfStroke(bot);
            }, 3000);

        },
        removeCard: function(removeClass) {
            $(removeClass).html("").addClass("doNotTouch").removeClass(model.classes).removeAttr("data-value");
        },
        removeAllCard: function() {
            view.removeCard(".tableCards");
        },
		come: function (comeClass) {
			$("." + comeClass).addClass("view");
			setTimeout(function () {
				$("." +     comeClass).removeClass("view");
                view.showScore();
            }, 2000)
        },
        showScore: function () {
        $("#firstScore").text("Очки: " + model.players[0].score);
        $("#secondScore").text("Очки: " + model.players[1].score);
        },
        //Вывести результаты этапа
        showRes: function (arrOfNames, arrOfIndexs) {
		    let arr = $(".statRes span");
            $(arr[0]).text(arrOfNames[0]);
            $(arr[1]).text(arrOfNames[1]);
            let index = 2;
            for(let i = 0; i < arrOfIndexs.length; i++){
                    if(arrOfIndexs[i] === -1){
                        $(arr[index]).text("0");
                        $(arr[index + 1]).text("0");
                    }else if(arrOfIndexs[i] === 0){
                        $(arr[index]).text("1");
                        $(arr[index + 1]).text("0");
                    }else{
                        $(arr[index]).text("0");
                        $(arr[index + 1]).text("1");
                    }
                index += 2;
            }
            $("#res1").text(model.players[0].score);
            $("#res2").text(model.players[1].score);
            return true
        },
        //Вывести результаты
        getRes: function (arrOfNames, arrOfIndexs) {
            this.showRes(arrOfNames, arrOfIndexs);
            if($(".rules").hasClass("view")){
                $("#rules").click();
            }
            $(".statistic").addClass("view");
            $("#looked").click(view.clickOnLooked);
        },
        showCardsInDeck: function () {
            $(".cards").text("Карт в колоде: " + model.deckOfCards.length);
        },
        //Показать правила
        rules: function () {
            $("#rules").click(function () {
                if($(".rules").hasClass("view")){
                    $(".rules").removeClass("view");
                    $("#rules").text("Показать правила");
                }else{
                    $(".rules").addClass("view");
                    $("#rules").text("Скрыть правила");
                }

            });
        },
        sayWinOrLoss: function (bool) {
            let str = "";
            if(bool === true) str = "Победа! Поздравляем!";
            else if(bool === false) str = "Поражение. Попробуйте ещё.";
            else if (bool === 0) str = "Ничья. Это удивительно!";
            if($(".rules").hasClass("view")){
                $("#rules").click();
            }
            $(".end h1").text(str);
            $(".end p").html("Всего взято карт: " + model.players[1].allTakenCards + "<br>" + "Всего взяток: " + model.players[1].allBribes);
            $(".end").addClass("view");
            $("#restart").click(view.clickToRestart);
        },
        clickToRestart: function(){
            controler.restart();
            $("#resrart").off('click', view.clickToRestart);
        }
	};







	let controler = {
	  //Начало игры
		startGame: function(){
            view.rules();
			//Задать игроков
			for(let i = 0; i < model.amountOfplayers; i++){
				model.players[i] = {
					deck: [],
					score: 0,
					takenCards: [],
                    bribes: 0,
                    allTakenCards: 0,
                    allBribes: 0
				};
			}
			this.startStage();
		},
    //Начало этапа
    startStage: function(){
		    //Сменить ход
            model.playerStroke = !model.playerStroke;
		    view.deleteAllTriggers();
		    //Убрать взятые карты и взятки
		    for(let i = 0; i < model.players.length; i++){
		        model.players[i].takenCards = [];
                model.players[i].bribes = 0;
            }
            //Убрать карты на столе
		    model.cardsOnTable = [];
		    model.deckOfCards = ["1Т", "1Б", "1Ч", "1П", "2Т", "2Б", "2Ч", "2П",
                                    "3Т", "3Б", "3Ч", "3П", "4Т", "4Б", "4Ч", "4П",
                                    "5Т", "5Б", "5Ч", "5П", "6Т", "6Б", "6Ч", "6П",
                                    "7Т", "7Б", "7Ч", "7П", "8Т", "8Б", "8Ч", "8П",
                                  "9Т", "9Б", "9Ч", "9П", "10Ч", "10П", "10Т", "10Б"];
            //Раздать карты
             let time = this.dealCards();
             setTimeout(function () {
                controler.layRandCardsOnTable();
            }, time);
    },
		//Раздать карты игрокам
		dealCards: function(){
			let time = 300;
			for(let j = 0; j < 3; j++){
                for(let i = 0; i < model.players.length; i++){
                    let randCard = this.getRandCard();
                    model.players[i].deck.push(randCard);
					view.getCardForPlayer(i, randCard, time);
					time += 300;
                }
                if(model.deckOfCards.length === 0) return time;
			}
			return time;
		},
		//Выложить карту на стол
        layCardOnTable: function (card, time, bot) {
				model.cardsOnTable.push(card);
				if(time !== undefined && bot !== undefined) view.layCardOnTable(card, time, bot);
				else view.layCardOnTable(card);
        },
		layCardsOnTable: function(cards){
			for(let i = 0; i < cards.length; i++){
				model.cardsOnTable.push(cards[i]);
			}
			view.layCardsOnTable(cards);
		},
		layRandCardsOnTable: function(){
            let rands = [];
            let length = 4;
            if(model.deckOfCards.length < 4){
                length = model.deckOfCards.length;
            }
            for(let i = 0; i < length; i++){
                rands.push(this.getRandCard());
            }
            this.layCardsOnTable(rands);
		},
		//Получение рандомной карты
		getRandCard: function () {
            let rand = Math.floor(Math.random() * model.deckOfCards.length);
            let randCard = model.deckOfCards[rand];
            model.deckOfCards.splice(rand, 1); //Удалить карту из массива
            return randCard;
        },
		//ход игрока
        //Подсветить кнопку Выложить, если выбрана только карта из руки
		testGive: function(){
			let arrTable = $("#table td").get();
			let arrPeople = $("#secondPlayer td").get();
			let hasClass = false;
			let hasTakenClass = false;
			for(let i = 0; i < arrTable.length; i++){
				if($(arrTable[i]).hasClass('takenCardOnTable') ) {
                    hasClass = true;
                    break;
                }
			}
            for(let i = 0; i < arrPeople.length; i++){
                if($(arrPeople[i]).hasClass('takenCard') ) {
                    hasTakenClass = true;
                }
            }
			if(hasClass && hasTakenClass) {
				return false;
            }
			else if(hasTakenClass){
				return true;
            }
		},
		//Сравнить карту игрока и выбранные карты на столе
        equalsCards: function() {
            let val = $(".takenCard").attr('data-value');
            if(val){ //Если не пусто
                val = this.makeNumber(val);
            }else{
            	return false;
			}
            let mycard = val;
			let arrOfTableCards = $(".takenCardOnTable").get();
			//Если выбрано и то, и то
			if(mycard !== undefined && arrOfTableCards.length !== 0) {
                let score = 0;
                //Если на столе карта того же номинала, нельзя брать другие
                for(let i = 0; i < model.cardsOnTable.length; i++){
                    if(mycard === this.makeNumber(model.cardsOnTable[i])){
                        if(arrOfTableCards.length === 1){
                            let num = $(arrOfTableCards[0]).attr('data-value');
                            if(num === undefined) return false;
                            return mycard === this.makeNumber(num);
                        }else{
                            return false;
                        }
                    }
                }
                for(let i = 0; i < arrOfTableCards.length; i++){
                    let val = $(arrOfTableCards[i]).attr('data-value');
                    if(val !== undefined){
                        val = this.makeNumber(val);
                        score += val;
                    }else{
                        return false;
                    }
                }
                return score === mycard;
			}
			return false;
        },
        //Безопасность
        testArrs: function(){
		    let arr = model.cardsOnTable.concat(model.deckOfCards);
		    for(let i = 0; i < model.players.length; i++){
		        arr = arr.concat(model.players[i].deck).concat(model.players[i].takenCards);
            }
            if(this.hasDuplicates(arr)){
                this.badBoy();
		        return false;
            }
            return true;
        },
		//Если нарушил правлиа
		badBoy: function(){
            alert("Ты жулик! Уходи из игры!");
            $("#game").remove();
            $("h1").text("Жуликам в игре не место!");
            return false;
		},
		//Выложить карту
		giveCard: function (player) {
			 if(player === 1){ //Если игрок
				//Если можно выложить карту
				 let card = $(".takenCard").attr('data-value');
				 if(card !== undefined){
                     this.deleteCard(player, card);
                     controler.layCardOnTable(card);
                     this.endOfStroke(player);
                     return true;
                 }
            }
            return false;
        },
		//Удалить карту у игрока
		deleteCard: function (player, card) {
            for (let i = 0; i < model.players[player].deck.length; i++) {
                if (model.players[player].deck[i] === card) {
                    model.players[player].deck.splice(i, 1);
                    return true;
                }
            }
            return false;
        },
		//Добавить в полученные игроком карты
		addCard: function(player, card){
			model.players[player].takenCards.push(card);
		},
		//Взять взятку
		getCard: function (player) {
			 if(player === 1){
				//Если можно взять взятку
                    let card = $(".takenCard").attr('data-value');
                    let arrOfTableCards = $(".takenCardOnTable").get();
                    this.addCard(player, card);
                    for(let i = 0; i < arrOfTableCards.length; i++){
						let val = $(arrOfTableCards[i]).attr('data-value');
                    	this.addCard(player, val);
						this.deleteCardOnTable(val);
					}
					this.deleteCard(player, card);
                    model.lastBribe = player;
                 //Добавить взятку
                 model.players[player].bribes++;
                    this.endOfStroke(player);
				return true;
			}
			return false;
        },
		//Убрать карту со стола
		deleteCardOnTable: function(val){
			for(let i = 0; i < model.cardsOnTable.length; i++){
				if(model.cardsOnTable[i] === val){
					model.cardsOnTable.splice(i, 1);
					break;
				}
			}
		},
		deleteCardsOnTable: function(vals){
			for(let i = 0; i < vals.length; i++){
				this.deleteCardOnTable(vals[i]);
			}
		},
    //Конец хода
		endOfStroke: function(player){
			//Если карты у игроков закончились == 0
      let length = 0;
      for(let i = 0; i < model.players.length; i++){
        length += model.players[i].deck.length;
        }
        /*Скопа*/
        if(model.cardsOnTable.length === 0){
        model.players[player].score++;
            	view.come("scopa");
			}
			/*Меняем ход*/
            if(player === model.players.length - 1){
                player = 0;
            }else{
                player++;
            }
			//Если колода не закончилась
			if(model.deckOfCards.length !== 0){
                //Если карты у игроков закончились
                if(length === 0){
                    let time = this.dealCards();
                    setTimeout(function () {
                        if(player === 1){
                            view.deleteAllTriggers();
                            view.startGame();
                        }else{
                            view.deleteAllTriggers();
                            controler.bot(player);
                        }
                    }, time);
                    return true;
                }
			}else{
                //Конец этапа
				if(length === 0) {
                    //Удалить все видимые карты со стола
                    view.removeAllCard();
                    /*Игрок, последний получивший взятку, получает все карты со стола*/
                    model.players[model.lastBribe].takenCards = model.players[model.lastBribe].takenCards.concat(model.cardsOnTable);
                    //Подсчёт очков
                    this.calculatePoints();
                    return true;
                }
			}
			//Если сходил последний игрок, начинаем сначала
			if(player === 1){
                view.deleteAllTriggers();
                view.startGame();
			}else{
                view.deleteAllTriggers();
                this.bot(player);
			}
		},
    // Подсчитать очки
    calculatePoints: function(){
      let peaks = [];
      let bribes = [];
      let scores = [];
      //Массив, который будет передан в showRes();
      let indexArr = [];
      for(let i = 0; i < model.players.length; i++) {
        peaks.push(0);
        scores.push(0);
        /*За 7 пику очко*/
        if(model.players[i].takenCards.includes("7П")){
            indexArr.push(i);
          model.players[i].score++;
        }
        /*Пики в колоде*/
        for(let j = 0; j < model.players[i].takenCards.length; j++){
          let card = model.players[i].takenCards[j];
          let cardStr = String(card.match(/\D+/));
          let cardNum = this.makeNumber(card);
          //Подсчёт очков
          switch (cardNum){
            case 1: scores[i] += 4; break;
            case 2: scores[i] += 5;break;
            case 3: scores[i] += 6;break;
            case 4: scores[i] += 7;break;
            case 5: scores[i] += 8;break;
            case 6: scores[i] += 9; break;
            case 7: scores[i] += 10; break;
            case 8: scores[i] += 3; break;
            case 9: scores[i] += 2; break;
            case 10: scores[i] += 1;
          }
          if(cardStr === "П"){
            peaks[i]++;
          }
        }
        //Взятки
        bribes.push(model.players[i].bribes);
      }
      //Очко за пики в колоде
        if(peaks[0] === peaks[1]){
            indexArr.push(-1);
        }else{
            let indexOfPeaks = peaks.indexOf(Math.max.apply(Math, peaks));
            indexArr.push(indexOfPeaks);
            model.players[indexOfPeaks].score++;
        }
      //Очко за взятки
        if(bribes[0] === bribes[1]){
            indexArr.push(-1);
        }else{
            let indexOfBribes = bribes.indexOf(Math.max.apply(Math, bribes));
            indexArr.push(indexOfBribes);
            model.players[indexOfBribes].score++;
        }
        //Очко за количество очков
        if(scores[0] === scores[1]){
            indexArr.push(-1);
        }else{
            let indexOfScores = scores.indexOf(Math.max.apply(Math, scores));
            indexArr.push(indexOfScores);
            model.players[indexOfScores].score++;
        }
        /*Добавить общие взятки  и карты*/
        for(let i = 0; i < model.players.length; i++){
            model.players[i].allTakenCards +=  model.players[i].takenCards.length;
            model.players[i].allBribes +=  model.players[i].bribes;
        }
      //Проверка на победу
      //Показать результаты.
        setTimeout(function (){
            view.getRes(["Ботиус",model.playerName], indexArr);
        }, 2000);

    },
        testWin: function(){
            let winnersScore = [];
            let indexsWinners = [];
            for(let i = 0; i < model.players.length; i++){
                if(model.players[i].score >= model.scoreForWin){
                    winnersScore.push(model.players[i].score);
                    indexsWinners.push(i);
                }
            }
            //Если последняя игра
            if(model.lastGame === true){
                if(winnersScore[0] === winnersScore[1]){
                    this.sayWinOrLoss(0);
                }else if(winnersScore[0] > winnersScore[1]){
                    this.sayWinOrLoss(false);
                }else{
                    this.sayWinOrLoss(true);
                }
            }
            if(indexsWinners.length > 1){
                if(winnersScore[0] === winnersScore[1]){
                    model.lastGame = true;
                }else if(winnersScore[0] > winnersScore[1]){
                    if(indexsWinners[0] === 1){
                        this.sayWinOrLoss(true);
                        return true;
                    }else{
                        this.sayWinOrLoss(false);
                        return true;
                    }
                }

            }else if(indexsWinners.length === 1){
                if(indexsWinners[0] === 0){
                    this.sayWinOrLoss(false);
                    return true;
                }else{
                    this.sayWinOrLoss(true);
                    return true;
                }
            }
            return false;
        },
        sayWinOrLoss: function(bool){
            view.sayWinOrLoss(bool);
		    console.log("Молодца!");
        },













		//Ход бота
		bot: function (bot) {
            let botCards = model.players[bot].deck;
			//Проверка, есть ли на столе пики - за них доп. очки
			//Если в своей колоде 7 пика
			if(this.findSevenPeak(bot, botCards, this.botCanUseCard)){
                return true;
			}
			//Если на столе 7 пика
			if(this.findSevenPeak(bot, model.cardsOnTable, this.botCanTakeCard)){
                return true;
			}
			//Ищем пики на столе
			for(let i = 0; i < model.cardsOnTable.length; i++){
                if(this.findPeak(bot, model.cardsOnTable[i], this.botCanTakeCard)) return true;
			}
			//Ищем пики в своей колоде
            cards = [];
			for(let i = 0; i < botCards.length; i++){
                if(this.isPeak(botCards[i])) cards.push(botCards[i]);
                else cards.push(0);
			}
            if(this.bestVariant(bot, cards, this.botCanUseCard)) return true;
			//Перебираем оставшиеся варианты в своей колоде
            if(this.bestVariant(bot, botCards, this.botCanUseCard)) return true;
            this.botGiveCard(bot);
            return true;
        },
        bestVariant: function(bot, cards, func){
            let arr = [];
            for(let i = 0; i < cards.length; i++){
                if(cards[i] === 0) {
                    arr.push(0);
                    break;
                }
                let indexs = func(bot, cards[i]);
                if(indexs){
                    arr.push(indexs[1]);
                }else{
                    arr.push(0);
                }
            }
            let indexCard = -1;
            let prevarr = [];
            for(let i = 0; i < arr.length; i++){
                if(arr[i] !== 0){
                    if(arr[i].length > prevarr.length){
                        indexCard = i;
                        prevarr = arr[i];
                    }
                }
            }
            if(indexCard !== -1){
                this.botGetCard(bot, indexCard, prevarr);
                return true;
            }
            return false;
        },
		findPeak: function(bot, card, func){
            let cardWithoutN = String(card.match(/\D+/)) ;
            if(cardWithoutN === "П"){
                if(this.testIndexs(bot, func, card)) return true;
            }
            return false;
        },
        isPeak: function(card){
            let cardWithoutN = String(card.match(/\D+/)) ;
            if(cardWithoutN === "П"){
                return true;
            }
            return false;
        },
		findSevenPeak: function(bot, arr, func) {
            if (arr.includes("7П")) {
                if (this.testIndexs(bot, func, "7П")) return true;
            }
			return false;
		},
		testIndexs: function(bot, func, card){
            let indexs = func(bot, card);
            if(indexs){
                this.botGetCard(bot, indexs[0], indexs[1]);
                return true;
            }
            return false;
		},
		//Проверка, может ли бот использовать карту
		//Если не может - false, если может - [индекс его карты. [индексы карт на столе] ]
        botCanUseCard: function(bot, card) {
			let numCardsOnTable = controler.makeNumberArr(model.cardsOnTable);
			let indexBotCard = controler.getIndexByContent(model.players[bot].deck, card);
			let arrIndexs = [indexBotCard];
			card = controler.makeNumber(card);
            let indexs = [];
			//Если такая же карта на столе
			for(let i = 0; i < numCardsOnTable.length; i++) {
                if (card === numCardsOnTable[i]) {
                    indexs.push(i);
                    arrIndexs.push(indexs);
                    return arrIndexs;
                }
            }
            let sum = 0;
			for(let i = 0; i < numCardsOnTable.length; i++){
				if(numCardsOnTable[i] < card){
					indexs.push(i);
					sum = numCardsOnTable[i];
					for(let j = 0; j < numCardsOnTable.length; j++){
						//Если это не та же карта
						if(i !== j){
                            sum += numCardsOnTable[j];
                            indexs.push(j);
                            if(sum > card){
                                sum -= numCardsOnTable[j];
                                indexs.pop();
                            }else if(sum === card){
                            	arrIndexs.push(indexs);
                                return arrIndexs;
                            }
						}
					}
					indexs = [];
					indexs.push(i);
					sum = numCardsOnTable[i];
					for(let j = i+1; j < numCardsOnTable.length; j++){
						//Если это не та же карта
                            sum += numCardsOnTable[j];
                            indexs.push(j);
                            if(sum > card){
                                sum -= numCardsOnTable[j];
                                indexs.pop();
                            }else if(sum === card){
                            	arrIndexs.push(indexs);
                                return arrIndexs;
                            }
					}
				}
				indexs = [];
			}
			//Не выходит ничего
			return false;

        },
        //Проверка, может ли бот взять карту со стола
        //Если не может - false, если может - [индекс его карты. [индексы карт на столе] ]
		botCanTakeCard: function(bot, card){
			let arrIndexs  = [];
			let indexMyCard;
            let indexCard = controler.getIndexByContent(model.cardsOnTable, card);
			let indexTableCard = [indexCard];

            let numCardsOnTable = controler.makeNumberArr(model.cardsOnTable);
            let numBotCards = controler.makeNumberArr(model.players[bot].deck);


			let num = numCardsOnTable[indexCard];

			let sum = 0;
			//Если такая же карта в руке
			for(let i = 0; i < numBotCards.length; i++){
				indexMyCard = i;
				if(numBotCards[i] === num){
                    arrIndexs.push(indexMyCard);
                    arrIndexs.push(indexTableCard);
                    return arrIndexs;
				}
			}
			//Суммы очков карт
			for(let i = 0; i < numBotCards.length; i++){
				let haveCard = false;
			    //Если на столе карта того же номинала
			    for(let k = 0; k < numCardsOnTable.length; k++){	
			        if(numBotCards[i] === numCardsOnTable[k]){
						haveCard = true;
					}
                }
				if(haveCard) break;
				//Если на столе нет такой же карты
				indexMyCard = i;
                if(numBotCards[i] > num){
                	sum = num;
                	for(let j = 0; j < numCardsOnTable.length; j++){
                        //Если это не та же карта
                        if(indexCard !== j){
                            sum += numCardsOnTable[j];
                            indexTableCard.push(j);
                            if(sum > numBotCards[i]){
                                sum -= numCardsOnTable[j];
                                indexTableCard.pop();
                            }else if(sum === numBotCards[i]){
                                arrIndexs.push(indexMyCard);
							    arrIndexs.push(indexTableCard);
                                return arrIndexs;
                            }
                        }
					}
				}
				indexTableCard = [indexCard];
			}
			//Если карту никак не взять - false
			return false;
		},
		makeNumberArr: function(arr){
			return arr.map(function (el) {
                return controler.makeNumber(el);
            });
		},
		makeNumber: function (card) {
			return Number(card.match(/\d+/));
        },
		getIndexByContent: function (arr, content) {
			if(!arr.includes(content)) return false;
			for(let i = 0; i < arr.length; i++){
				if(content === arr[i]) return i;
			}
    	},
		botGetCard(bot, indexMyCard, indexTableCards){
			//Добавить и удалить выбранную карту боту
			let mycard = model.players[bot].deck[indexMyCard];
            this.addCard(bot, mycard);
            this.deleteCard(bot, mycard);
			//Добавить карты со стола боту
			let vals = [];
			for(let i = 0; i < indexTableCards.length; i++){
				let val = model.cardsOnTable[indexTableCards[i]];
				//Добавить карту боту в массив
				this.addCard(bot, val);
				//Добавить карту в массив удалений
				vals.push(val);
			}
            model.lastBribe = bot;
            //Добавить взятку
            model.players[bot].bribes++;
			//Карты удаляются после всего для убоства
			this.deleteCardsOnTable(vals);
            //Удалить видимую карту у бота
            view.botDeleteCard(bot, mycard);
			//Удалить видимые карты на столе
			view.botDeleteCardsOnTable(vals, bot);
        },
		botGiveCard: function (bot) {
            let numArr = this.makeNumberArr(model.players[bot].deck);
            let index = numArr.indexOf(Math.min.apply(Math, numArr));
            let card = model.players[bot].deck[index];
            this.deleteCard(bot, card);
            view.botDeleteCard(bot, card);
            this.layCardOnTable(card, 3100, bot);
            return true;
        },
        //Есть ли повторы массиве
        hasDuplicates: function (arr) {
            let vals = Object.create(null);
            for(let i = 0; i < arr.length; i++){
                let val = arr[i];
                if(val in vals){
                    return true
                }
                vals[val] = true;
            }
            return false;
        },
        restart: function(){
            model.players = [];
            model.lastBribe = false;
            model.lastGame = false;
            model.playerStroke = false;
            $(".end").removeClass("view");
            $("#rules").off('click', view.rules());
            controler.startGame();
            view.showScore();
        }
	};
	function start(){
        $("#game").addClass("view");
        let val = $(".getGame input").val();
        if(val.length > 20){
            alert("Уходи");
        }else{
            if(val === "") val = "Безликий";
            $(".getGame").remove();
            controler.startGame();
            $(".playerName").text(val);
            model.playerName = val;
        }
    }
	//Задать начало игры
        $(".getGame input").keypress(function(e){
            if(e.keyCode === 13){
                //нажата клавиша enter
                start();
            }
        });
	//Клик по кнопке
	$("#getGame").click(function () {
        start();
    });
});
