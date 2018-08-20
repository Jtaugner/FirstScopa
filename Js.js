$(function(){
	let model = {
		amountOfplayers: 2,
		players: [],
		scoreForWin: 11,
		cardsOnTable: [],
		//Карты - всего 40
		deckOfCards: ["1Т", "1Б", "1Ч", "1П", "2Т", "2Б", "2Ч", "2П", "3Т", "3Б", "3Ч", "3П", "4Т",
		"4Б", "4Ч", "4П", "5Т", "5Б", "5Ч", "5П", "6Т", "6Б", "6Ч", "6П", "7Т", "7Б",
		"7Ч", "7П", "8Т", "8Б", "8Ч", "8П", "9Т", "9Б", "9Ч", "9П", "10Т", "10Б", "10Ч", "10П"]
	};




	let view = {
		//Начать игру
		startGame: function(){
			//Анти-баг
			$("#secondPlayer").click(view.clickOnCard);
			$("#table").click(view.clickOnTable);
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
                }
                else{
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
			//Иначе на элемент <i>
            if($(el).hasClass("card")) $(el).addClass("takenCard");
			else $(el).parent().addClass("takenCard");
            view.testButtons();
		},
        clickOnTable: function (e) {
            let el = document.elementFromPoint(e.clientX, e.clientY);
            if($(el).hasClass("card")) $(el).toggleClass("takenCardOnTable");
            else $(el).parent().toggleClass("takenCardOnTable");
            view.testButtons();
        },
        clickOnGive: function () {
            if(controler.giveCard(1)){
                $(".takenCard").remove();
                view.testButtons();
            }
        },
        clickOnGet: function () {
            if(controler.getCard(1)){
                $(".takenCard").remove();
                $(".takenCardOnTable").remove();
                view.testButtons();
            }
        },
		//Выложить карту на стол
		layCardOnTable: function(card){
			let id;
			if($("#table td").length < 4) id = "#table"
			else id = "#table2"
            $(id).append("<td class='tableCards card " + this.classPeople(card)+
                "' data-value='" + card + "'>" + this.testCard(card) + "</td>");

		},
		//Выдать карту игроку
		getCardForPlayer: function(player, card){
			if(player === 1){
				$("#firstPlayer").append("<td class='notView'></td>");
			}else if(player === 2){
				$("#secondPlayer").append("<td class='peopleCards card " + this.classPeople(card)+
				"' data-value='" + card + "'>" + this.testCard(card)+"</td>");
			}
		},
		//Если дама, валет или король
		classPeople: function(card){
            let num = Number(card.match(/\d+/));
			if(num === 8) return "jack";
			if(num === 9) return "lady";
			if(num === 10) return "king";
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

			let str = "<i class='i1 " + classRed +"'>" + card + "</i>" + "<i class='i2 " + classRed + "'>" + card + "</i>";
			return str;
		},
		//Бот
		botDeleteCard: function () {
			$(".notView").last().remove();
        },
		botDeleteCardOnTable: function (val) {
			$("[data-value='" + val +"'").remove();
        }
	};





	let controler = {
		startGame: function(){
			//Задать триггеры
			view.startGame();
			//Задать игроков
			for(let i = 0; i < model.amountOfplayers; i++){
				model.players[i] = {
					deck: [],
					score: 0,
					takenCards: []
				};
			}
			//Выложить карты на стол
			for(let i = 0; i < 4; i++){
				let rand = this.getRandCard();
				this.layCardOnTable(rand);
			}
			//Раздать карты
			this.dealCards();
			console.log(model.players);
		},
		//Раздать карты игрокам
		dealCards: function(){
			for(let j = 0; j < 4; j++){
                for(let i = 0; i < model.players.length; i++){
                    let randCard = this.getRandCard();
					//console.log(randCard + " p = " + i);
                    model.players[i].deck.push(randCard);
					view.getCardForPlayer(i + 1, randCard);
                }
                if(model.deckOfCards.length === 0) return false;
			}
		},
		//Выложить карту на стол
        layCardOnTable: function (card) {
				model.cardsOnTable.push(card);
				view.layCardOnTable(card);
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
			//Безопасность
            this.testCardOnTables();
            let val = $(".takenCard").attr('data-value');
            if(val){ //Если не пусто
                this.testCardInArr(model.players[1].deck, val);
                val = this.makeNumber(val);
            }else{
            	return false;
			}
            let mycard = val;
			let arrOfTableCards = $(".takenCardOnTable").get();
			//Если выбрано и то, и то
			if(val !== undefined && arrOfTableCards.length !== 0){
                let score = 0;
                //Если на столе карта того же номинала, нельзя брать другие
                for(let i = 0; i < model.cardsOnTable.length; i++){
                    console.log(mycard);
                    if(mycard === this.makeNumber(model.cardsOnTable[i])){
                        let val = $(arrOfTableCards[0]).attr('data-value');
                        return mycard === this.makeNumber(val);;
                    }
                }
                for(let i = 0; i < arrOfTableCards.length; i++){
                    let val = $(arrOfTableCards[i]).attr('data-value');
                    //Проверка. Есть ли карта в массиве
					//Т.к. можно сменить аттрибут data-value
                    if(this.testCardInArr(model.cardsOnTable, val)){
                        val = this.makeNumber(val);
                        score += val;
                    }
                }
                return score === mycard;
			}
			return false;
        },
		testCardInArr: function(arr,card){
			if(arr.includes(card)){
				return true;
			}else{
				console.log("sss");
                this.badBoy();
			}
		},
		//Если нарушил правлиа
		badBoy: function(){
            alert("Ты жулик! Уходи из игры!");
            $("#game").remove();
            $("h1").text("Жуликам в игре не место!");
            return false;
		},
        testCardOnTables: function(){
			let arrTd = $("td.card").get();
			let arr = [];
			for(let i = 0; i < arrTd.length; i++){
				arr.push($(arrTd[i]).attr('data-value'));
			}
			arr = arr.sort();
			let prevel = arr[0];
			for(let i = 1; i < arr.length; i++){
				if(prevel === arr[i]){
					console.log(prevel, arr[i]);
					this.badBoy();
					return false;
				}else{
					prevel = arr[i];
				}
			}
			return true;
		},
		//Выложить карту
		giveCard: function (player) {
			//Если ходит бот
			if(player === 0){
				return true;
			}else if(player === 1){ //Если игрок
				//Если можно выложить карту
				if( this.testGive() ){
                    let card = $(".takenCard").attr('data-value');
                    this.deleteCard(1, card);
                    controler.layCardOnTable(card)
                }
                this.endOfPlayer();
				return true;
            }
			return false;
        },
		//Удалить карту у игрока
		deleteCard: function (player, card) {
            for (let i = 0; i < model.players[player].deck.length; i++) {
                if (model.players[player].deck[i] === card) {
                    model.players[player].deck.splice(i, 1);
                    break;
                }
            }
        },
		//Добавить в полученные игроком карты
		addCard: function(player, card){
			model.players[player].takenCards.push(card);
		},
		//Взять взятку
		getCard: function (player) {
            //Если ходит бот
			if(player === 0){
				return true;
			}else if(player === 1){
				//Если можно взять взятку
				if(this.equalsCards() ){
                    let card = $(".takenCard").attr('data-value');
                    let arrOfTableCards = $(".takenCardOnTable").get();
                    this.addCard(1, card);
                    for(let i = 0; i < arrOfTableCards.length; i++){
						let val = $(arrOfTableCards[i]).attr('data-value');
                    	this.addCard(1, val);
						this.deleteCardOnTable(val);
					}
                    this.deleteCard(1, card);
				}
                this.endOfPlayer();
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
		endOfPlayer: function(){
			console.log("End of Player");
			view.deleteAllTriggers();
			this.bot(0);
		},














		//Ход бота
		bot: function (bot) {
			//Проверка, есть ли на столе пики - за них доп. очки
			let botCards = model.players[bot].deck;
			//Если в колоде 7 пика
            let indexOf7 = this.getIndexByContent(botCards, "7П");
            if(indexOf7){
                let indexs = this.botCanTakeCard(bot, model.players[bot].deck[indexOf7]);
                if(indexs){
                    console.log("Беру!");
                    this.botGetCard(bot, indexOf7, indexs);
                    return true;
				}
			}
			//Если на столе 7 пика

			let indexsOfP
			for(let i = 0; i < model.cardsOnTable.length; i++){
				let card = model.cardsOnTable[i];
				/*if(card === "7П"){

				}

				console.log("Карта, котоаря на столе " + card);
				let cardWithoutN = String(card.match(/\D+/)) ;
				if(cardWithoutN === "П"){

				} */
			}
        },
		//Проверка, может ли бот использовать карту
		//Если не может - false, если идентичные карты - индекс карты на столе
		// если несколько карт - массив индексов
		botCanTakeCard: function (bot, card) {
			let cardsOnTable = model.cardsOnTable;
			//console.log("ИНдекс: " + indexCard + " " +cardsOnTable[indexCard]);
			let numCardsOnTable = this.makeNumberArr(model.cardsOnTable);
			card = controler.makeNumber(card);
			//Если такая же карта на столе
			for(let i = 0; i < numCardsOnTable.length; i++) {
                if (card === numCardsOnTable[i]) {
                    return i;
                }
            }
            let indexs = [];
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
                                return indexs;
                            }
						}
					}
				}
				indexs = [];
			}
			//Не выходит ничего
			return false;

        },
		//Можно ли взять определённую карту
		botCanTakeCertainCard: function(bot, card){
			let indexMyCard;
            let indexCard = this.getIndexByContent(model.cardsOnTable, card);
			let indexsTableCard = [indexCard];

            let numCardsOnTable = this.makeNumberArr(model.cardsOnTable);
            let numBotCards = this.makeNumberArr(model.players[bot].deck);


			let num = numCardsOnTable[indexCard];

			let sum = 0;
			for(let i = 0; i < numBotCards.length; i++){
				indexMyCard = i;
                if(numBotCards[i] < num){
                	sum = num;
                	for(let j = 0; j < numCardsOnTable.length; j++){

					}
				}
			}
		},
		makeNumberArr: function(arr){
            let numCards = arr.map(function (el) {
                return controler.makeNumber(el);
            })
			return numCards;
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
			model.players[bot].deck;
			//Добавить и удалить выбранную карту боту
            this.addCard(bot, model.players[bot].deck[indexMyCard]);
            this.deleteCard(bot, model.players[bot].deck[indexMyCard]);
            //Удалить видимую карту у бота
            view.botDeleteCard();
			//Добавить карты со стола боту
			if(typeof indexTableCards === "number"){
                let val = model.cardsOnTable[indexTableCards];
                this.botAllFunc(bot, val);
			}else{
                for(let i = 0; i < indexTableCards.length; i++){
                    let val = model.cardsOnTable[indexTableCards[i]];
                    this.botAllFunc(bot, val);
                }
			}
				console.log(model.players);
			},
		botAllFunc: function (bot, val) {
			//Добавить карту боту в массив
            this.addCard(bot, val);
            //Удалить карту из массива стола
            this.deleteCardOnTable(val);
            //Удалить видимую карту на столе
            view.botDeleteCardOnTable(val);
        }
		
	};
	controler.startGame();
});