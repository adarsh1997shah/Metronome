// Getting html element.
const blink = document.querySelectorAll('.blink');
const form = document.querySelector('#form-controls');
const kick = document.querySelector('.kick-sound');
const boom = document.querySelector('.boom-sound');
const start = document.querySelector('#start-beat');
const rangeText = document.querySelector('.range-feild-text');

// Declaring variables.
let interval;
let beats = form.range.value;
let time = 60;  // Time is seconds.
let count = 0;

let repeat = Math.floor((time / beats) * 250);
rangeText.textContent = `Tempo: ${form.range.value} BPM`;


function Blink( repeat ) {
	clearInterval( interval );

	interval = setInterval( () => {
		kick.currentTime = 0;
		boom.currentTime = 0;

		blink[count - 1 === -1? 15 : count-1].classList.remove('red', 'blue');

		if( count % 4 === 0 ) {
			kick.play();
			blink[count].classList.add('blue');
		}
		else {
			boom.play();
			blink[count].classList.add('red');
		}

		if( count === 15 ) {
			count = 0;
		}
		else {
			count++;
		}
		console.log(count);
	}, repeat );
}


function Stop() {
	clearInterval( interval );
}



function handleRange( e ) {
	beats = e.target.value;
	rangeText.textContent = `Tempo: ${form.range.value} BPM`;
	repeat = Math.floor((time / beats) * 250);

	// Start only for button.
	if( start.textContent === 'Stop' ) {
		Blink( repeat );
	}
}


function handleStart() {
	if( start.textContent === 'Start' ) {
		// Disabling the other button.
		startWebAudio.disabled = true;
		startWeb.disabled = true;

		start.textContent = 'Stop';
		Blink( repeat );
	}
	else {
		start.textContent = 'Start';
		Stop();

		startWebAudio.disabled = false;
		startWeb.disabled = false;
	}
}


// Event listener.
form.range.addEventListener( 'input', handleRange );
start.addEventListener( 'click', handleStart )