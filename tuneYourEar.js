// variables
var level = 6; //initialise page on hard
var notes = [];
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
	constructor(name, notes, source, spriteObj) {
		this.name = name;
		this.length = notes.length;
		this.notes = notes;
		this.sound = new Howl({
			src: [source],
			sprite: spriteObj
		});
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
		level = 3;
		retry();
	})

	hardButton.addEventListener("click", function(){
		easyButton.classList.remove("difficulty");
		this.classList.add("difficulty");
		level = 6;
		retry();
	})

	playNoteButton.addEventListener("click", function(){
		instrument.sound.play(instrument.notes[pickedNote]);
	})

	for(i=0;i<squares.length;i++){
	squares[i].addEventListener("click", function(){
		// only check if we haven't already won
		if(!winner){
			if(this.id == pickedNote){
				displayMessage.textContent = "Correct!"
				changeColors("#99ff94");  // pale green
				// reward them with some nice music
				instrument.notes.forEach(notes => {
					instrument.sound.play(notes);
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
	instrument.sound.play(instrument.notes[pickedNote]);
}

function changeColors(color){
	for(i=0;i<level;i++){
		squares[i].style.backgroundColor = color;
	}
}

function pickNote(){
	return Math.floor(Math.random() * (level)); //notes.length);
}

function createIntruments(){
	// Acoustic Guitar Sprite & Instrument instantiation
	let guitarStringsSprite = {
		a: [0, 3000],
		b: [4000, 3000],
		d: [8000, 3000],
		ehigh: [12000, 3000],
		elow: [16000, 3000],
		g: [20000, 3000]
	};
	guitarStrings = new Instrument("Guitar Strings", ["a","b","d","ehigh","elow","g"], "Sounds/guitar-strings/acoustic.mp3", guitarStringsSprite);
	
	// Acoustic Guitar Chords Sprite & Intrument instantiation
	let guitarChordsSprite = {
		amajor: [0, 3000],
		aminor: [4000, 3000],
		cmajor: [8000, 3000],
		dmajor: [12000, 3000],
		emajor: [16000, 3000],
		gmajor: [20000, 3000]
	};
	guitarChords = new Instrument("Guitar Chords", ["amajor","aminor","cmajor","dmajor","emajor","gmajor"], "Sounds/guitar-chords/chords.mp3", guitarChordsSprite);
};