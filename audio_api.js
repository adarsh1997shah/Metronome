const context = new ( window.AudioContext || window.webkitAudioContext )();

const startWeb = document.querySelector('#start-beat-web')
const blinkWeb = document.querySelectorAll('.blink-web');
const formControlWeb = document.querySelector('#form-controls-web');
const beatControl = document.querySelector('.range-beat .range-feild-text');
const tempo = 60 / formControlWeb.range.value;
let intervalRef;

document.addEventListener('DOMContentLoaded', () => {
	M.FormSelect.init(formControlWeb.select);
});

class WebAudio {
	constructor( context ) {
		this.context = context;
		this.tempo = tempo;
		this.nextNoteTime = this.context.currentTime;
		this.noteLength = 0.09;
		this.beatNumber = 0;
		this.isPlaying = false;
		this.resolution = parseInt(formControlWeb.select.value);
		beatControl.textContent = `Tempo: 60 BPM`;
	}

	calculateTempo = ( e ) => {
		this.tempo = 60 / e.target.value;
		beatControl.textContent = `Tempo: ${e.target.value} BPM`;
	}

	handleSelect = ( e ) => {
		this.resolution = parseInt(e.target.value);
	}

	playSound = () => {
		// Checking for resolution.
		if( this.resolution === 8 && this.beatNumber % 2 ) { return; }
		if( this.resolution === 4 && this.beatNumber % 4 ) { return; }

		// Creating the oscillator and gain node.
		this.oscillator = this.context.createOscillator();
		this.gainNode = this.context.createGain();

		// Connecting oscillator to the destination;
		this.oscillator.connect( this.gainNode );
		this.gainNode.connect( this.context.destination );

		this.gainNode.gain.setValueAtTime(1, this.nextNoteTime);
		//this.gainNode.gain.linearRampToValueAtTime(1, this.nextNoteTime + 0.01);
		this.gainNode.gain.exponentialRampToValueAtTime(0.001, this.nextNoteTime + this.noteLength);

		// Changing beat number according to frequency.
		if( this.beatNumber % 16 === 0 ) {
			this.oscillator.frequency.value = 880; 
		}
		else if( this.beatNumber % 4 === 0 ) {
			this.oscillator.frequency.value = 440;
		}
		else {
			this.oscillator.frequency.value = 220;
		}


		//this.oscillator.frequency.exponentialRampToValueAtTime( 880, this.context.currentTime + 2 );
		// Start oscillator at 0.
		this.oscillator.start( this.nextNoteTime );
		this.oscillator.stop( this.nextNoteTime + this.noteLength );

		
	}

	blink = () => {

		blinkWeb[this.beatNumber - 1 === -1 ? blinkWeb.length - 1 : this.beatNumber - 1].classList.remove('red', 'blue');
		
		if( this.beatNumber % 4 === 0 ) {
			blinkWeb[this.beatNumber].classList.add('blue');
		}
		else {
			blinkWeb[this.beatNumber].classList.add('red');
		}

		if( this.beatNumber === blinkWeb.length - 1 ) {
			this.beatNumber = 0;
		}
		else {
			this.beatNumber++;
		}
	}

	nextNote = () => {
		this.nextNoteTime += 0.25 * this.tempo;
	}

	reset = () => {
		this.isPlaying = false;
	}

	scheduler()
	{

		if( !this.isPlaying ) {
			this.nextNoteTime = this.context.currentTime;
			this.isPlaying = true;
		}

		// while there are notes that will need to play before the next interval, schedule them and advance the pointer.
		if ( this.nextNoteTime < this.context.currentTime + 0.1 ) {
			this.playSound();

			// Add beat length to last beat time
			this.nextNote();
			this.blink();
		}
	}
}

let webaudio = new WebAudio( context );


function play() {
	if( startWeb.textContent === 'Start' ) {
		// Disabling the other play button.
		startWebAudio.disabled = true;
		start.disabled = true;

		startWeb.textContent = 'Stop';

		// Resetting the blink color.
		blinkWeb[webaudio.beatNumber - 1 === -1 ? blinkWeb.length - 1 : webaudio.beatNumber - 1].classList.remove( 'red', 'blue' );
		webaudio.beatNumber = 0;

		intervalRef = setInterval( () => {
			webaudio.scheduler();
			//console.log( 'N ',webaudio.nextNoteTime);
			//console.log( 'C ', webaudio.context.currentTime);
		}, 25 );
	}
	else {
		clearInterval( intervalRef );
		startWeb.textContent = 'Start';
		webaudio.reset();

		// Resetting the button.
		startWebAudio.disabled = false;
		start.disabled = false;
	}
}

startWeb.addEventListener( 'click', play );
formControlWeb.range.addEventListener( 'input', webaudio.calculateTempo );
formControlWeb.select.addEventListener( 'change', webaudio.handleSelect );
console.log(webaudio);