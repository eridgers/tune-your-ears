// variables
var level = 6; //initialise page on hard
var spriteNotes = [];
var pickedNote;
var winStreak = 0;
var firstGuess;
var instrument;
var instrumentNames = [];

// variables for dom manipulation
var squares = document.querySelectorAll(".square");
var displayMessage = document.querySelector("#message");
var h1 = document.querySelector("h1");
var retryButton = document.querySelector("#newNote");
var easyButton = document.querySelector("#easy");
var hardButton = document.querySelector("#hard");
var streak = document.querySelector("#streak")
var playNoteButton = document.querySelector("#playNote");
var instrumentSelect = document.querySelector("#instrument-select");

class Instrument {
	constructor(name, spriteNotes, source, spriteObj, labels) {
		this.name = name;
		this.length = spriteNotes.length;
		this.spriteNotes = spriteNotes;
		this.sound = new Howl({
			src: [source],
			sprite: spriteObj
		});
		this.labels = labels;
		// add name to array of available instruments
		instrumentNames.push(this.name);
	};

};


initialise();

function initialise(){
	createIntruments();
	populateDropDown();
	instrument = guitarStrings; //initialise game with acoustic guitar
	listeners();
	retry();
}

function populateDropDown(){
	// clear options
	instrumentSelect.innerHtml = "";
	// loop through Instruments to populate dropdown
	for (let i = 0; i < instrumentNames.length; i++) {
		name = instrumentNames[i];
		instrumentSelect.innerHTML += "<option value=\"" + name + "\">" + name + "</option>"
	};
};

function listeners(){
	retryButton.addEventListener("click", function(){
		if(firstGuess){
			winStreak = 0;
			streak.textContent = winStreak;
		}
		retry();
	})
	easyButton.addEventListener("click", function(){
		this.classList.add("difficulty");
		hardButton.classList.remove("difficulty");
		if (checkLength()){
			level = (instrument.length) /2;
		}else{
		level = 3;
		};
		retry();
	})

	hardButton.addEventListener("click", function(){
		easyButton.classList.remove("difficulty");
		this.classList.add("difficulty");
		if (checkLength()){
			level = instrument.length;
		}else{
		level = 6;
		};
		retry();
	})

	playNoteButton.addEventListener("click", function(){
		instrument.sound.play(instrument.spriteNotes[pickedNote]);
	})

	instrumentSelect.addEventListener("change",	changeInstrument);

	for(i=0;i<squares.length;i++){
	squares[i].addEventListener("click", function(){
		// only check if we haven't already won
		if(!winner){
			if(this.id == pickedNote){
				displayMessage.textContent = "Correct!"
				changeColors("#99ff94");  // pale green
				// reward them with some nice music
				instrument.spriteNotes.forEach(spriteNotes => {
					instrument.sound.play(spriteNotes);
				});
				retryButton.textContent = "Play Again";
				winner = true;
				if(firstGuess){
					winStreak += 1;
				}
			// if playing on easy don't run for invisible guess
			}else if(this.id < level){
				this.style.backgroundColor="#232323";
				displayMessage.textContent = "Try Again";
				winStreak = 0;
				firstGuess = false;
			}
			if(this.id < level){
				if(firstGuess){
					streak.textContent = winStreak;
					firstGuess = false;
				}
				else{
					streak.textContent = 0;
				}
			}
		}
	})}
}

function changeInstrument(){
	switch (instrumentSelect.value) {
		case "Guitar Chords":
			instrument = guitarChords;
			break;
		case "Cello Strings":
			instrument = celloStrings;
			break;	
		default:
			instrument = guitarStrings;
			break;
	}
	if (checkLength()){
		level = instrument.length;
	};
	updateDisplay();
	retry();
};

function updateDisplay(){
	for (let i = 0; i < squares.length; i++) {
		squares[i].textContent = instrument.labels[i];
	};
};

function retry(){
	retryButton.textContent = "New Note";
	pickedNote = pickNote();
	displayMessage.textContent = "";
	for(i=0;i<squares.length;i++){
		if(i < level){
			squares[i].style.backgroundColor = "#949fff";  //pale blue
		}
		else{
			squares[i].style.backgroundColor ="#232323";
		}
	}
	firstGuess = true;
	winner = false;
	instrument.sound.play(instrument.spriteNotes[pickedNote]);
}

function changeColors(color){
	for(i=0;i<level;i++){
		squares[i].style.backgroundColor = color;
	}
}

function pickNote(){
	return Math.floor(Math.random() * (level)); //notes.length);
}

function checkLength(){
	if (instrument.length === undefined || instrument.length < 1){
		console.log("instrument has no length!");
		return false;
	}
	return true;
};

function createIntruments(){
	// Acoustic Guitar Sprite & Instrument instantiation
	let guitarStringsSprite = {
		elow: [16000, 3000],
		a: [0, 3000],
		b: [4000, 3000],
		d: [8000, 3000],
		g: [20000, 3000],
		b: [4000, 3000],
		ehigh: [12000, 3000]
	};
	guitarStrings = new Instrument(
		"Guitar Strings",
		["elow", "a", "d", "g", "b", "ehigh"], 
		"Sounds/guitar-strings/acoustic.mp3", 
		guitarStringsSprite,
		["E", "A", "D", "G", "B", "E"]
		);
	
	// Acoustic Guitar Chords Sprite & Intrument instantiation
	let guitarChordsSprite = {
		emajor: [16000, 3000],
		gmajor: [20000, 3000],
		aminor: [4000, 3000],
		amajor: [0, 3000],
		aminor: [4000, 3000],
		cmajor: [8000, 3000],
		dmajor: [12000, 3000]
	};
	// emajor, gmajor, aminor, amajor, cmajor, dmajor
	guitarChords = new Instrument(
		"Guitar Chords", 
		["emajor", "gmajor", "aminor", "amajor", "cmajor", "dmajor"], 
		"Sounds/guitar-chords/chords.mp3", 
		guitarChordsSprite,
		["E", "G", "Am", "A", "C", "D"]
		);

	// Cello open strings sprite and Intrument instantiation
	let celloStringsSprite = {
		celloC: [0, 3000],
		celloG: [4000, 3000],
		celloD: [8000, 3000],
		celloA: [12000, 3000]
	};

	celloStrings = new Instrument(
		"Cello Strings",
		["celloC", "celloG", "celloD", "celloA"],
		"Sounds/cello-strings/cello-strings.mp3",
		celloStringsSprite,
		["C", "G", "D", "A"]
	);
};