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
			$("#table").append("<td class='tableCards card " + this.classPeople(card)+
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
		peopleCard: function(card){
			let num = Number(card.match(/\d+/));
			if(num === 8) return "В";
			if(num === 9) return "Д";
			if(num === 10) return "К";
			return false;
		},
		classPeople: function(card){
			let s = this.peopleCard(card);
			if(s === "В") return "jack";
			if(s === "Д") return "lady";
			if(s === "К") return "king";
			return "";
		},
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
		//Кнопки
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
                	console.log("hc");
                    hasTakenClass = true;
                }
            }
			if(hasClass && hasTakenClass) {
				console.log(false);
				return false;
            }
			else if(hasTakenClass){
                console.log(true);
				return true;
            }
		},
		//Сравнить карту игрока и выбранные карты на столе
        equalsCards: function() {
            this.testCardOnTables();
            let val = $(".takenCard").attr('data-value');
            if(val){ //Если не пусто
                console.log(val);
                this.testCardInArr(model.players[1].deck, val);
                val = val.match(/\d+/);
            }else{
            	return false;
			}
            let mycard = Number(val);
			let arrOfTableCards = $(".takenCardOnTable").get();
			//Если выбрано и то, и то
			if(val !== undefined && arrOfTableCards.length !== 0){
                let score = 0;
                //Если на столе карта того же номинала, нельзя брать другие
                for(let i = 0; i < model.cardsOnTable.length; i++){
                    console.log(mycard);
                    if(mycard === Number(model.cardsOnTable[i].match(/\d+/))){
                        let val = $(arrOfTableCards[0]).attr('data-value');
                        return mycard === Number(val.match(/\d+/));
                    }
                }
                for(let i = 0; i < arrOfTableCards.length; i++){
                    let val = $(arrOfTableCards[i]).attr('data-value');
                    //Проверка. Есть ли карта в массиве
					//Т.к. можно сменить аттрибут data-value
                    if(this.testCardInArr(model.cardsOnTable, val)){
                        val = Number(val.match(/\d+/));
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
			view.deleteAllTriggers();
			this.bot();
		},
		//Ход бота
		bot: function (bot) {
			for(let i = 0; i < model.cardsOnTable.length; i++){
				let card = model.cardsOnTable[i];
				let n = card.match(/\d+/);
				console.log(n);
			}
			let botCards = model.players[bot].deck;
        }
	};
	controler.startGame();
});