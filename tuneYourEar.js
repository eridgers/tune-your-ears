// variables
var level = 6; //initialise page on hard
var notes = [];
var pickedNote;
var winStreak = 0;
var firstGuess;

// variables for dom manipulation
var squares = document.querySelectorAll(".square");
var displayMessage = document.querySelector("#message");
var h1 = document.querySelector("h1");
var retryButton = document.querySelector("#newNote");
var easyButton = document.querySelector("#easy");
var hardButton = document.querySelector("#hard");
var streak = document.querySelector("#streak")
var playNoteButton = document.querySelector("#playNote");

initialise();

function initialise(){
	populateNotes();
	listeners();
	retry();
}

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
		notes[pickedNote].play();
	})

	for(i=0;i<squares.length;i++){
	squares[i].addEventListener("click", function(){
		// only check if we haven't already won
		if(!winner){
			if(this.id == pickedNote){
				displayMessage.textContent = "Correct!"
				changeColors("#99ff94");  // pale green
				// reward them with some nice music
				notes.forEach(notes => {
					notes.play();
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
	notes[pickedNote].play();
}

function changeColors(color){
	for(i=0;i<level;i++){
		squares[i].style.backgroundColor = color;
	}
}

function pickNote(){
	return Math.floor(Math.random() * (level)); //notes.length);
}

function populateNotes(){
	notes = [
		new Howl({
			src: ['sounds/GuitarELow.mp3']}),
		new Howl({
			src: ['sounds/GuitarA.mp3']}),
		new Howl({
			src: ['sounds/GuitarD.mp3']}),
		new Howl({
			src: ['sounds/GuitarG.mp3']}),
		new Howl({
			src: ['sounds/GuitarB.mp3']}),
		new Howl({
			src: ['sounds/GuitarEHigh.mp3']})
	  ]
};