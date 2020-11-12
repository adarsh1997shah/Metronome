const audioContext = new ( window.AudioContext || window.webkitAudioContext )();

// Getting html element.
const apiFormControl = document.querySelector('#api-form-controls');
const startWebAudio = document.querySelector('#start-beat-web-audio');
const frequencyTextFeild = document.querySelector('.range-frequency .range-feild-text');
const volumeTextFeild = document.querySelector('.range-volume .range-feild-text');


class AudioApiControls{
	constructor( context ) {
		this.context = context;
		frequencyTextFeild.textContent = `Frequency: ${apiFormControl.frequency.value}`;
		volumeTextFeild.textContent = `Volume: ${apiFormControl.volume.value * 100}`
	}

	playSound = () => {
		if( startWebAudio.textContent === 'Start' ) {
			// Disabling the button.
			start.disabled = true;
			startWeb.disabled = true;

			startWebAudio.textContent = 'Stop';

			this.oscillator = this.context.createOscillator();
			this.gainNode = this.context.createGain();
			console.log(this.gainNode);
			this.oscillator.connect( this.gainNode );
			this.gainNode.connect( this.context.destination );

			this.oscillator.start( this.context.currentTime );
		}
		else {
			startWebAudio.textContent = 'Start';
			this.oscillator.stop();

			start.disabled = false;
			startWeb.disabled = false;
		}
	}

	frequency = ( e ) => {
		let val = e.target.value;

		frequencyTextFeild.textContent = `Frequency: ${val}`;

		if( this.oscillator ) {
			this.oscillator.frequency.value = val;
		}
		else {
			console.log('Please start the web audio with start button');
		}
	}

	volume = ( e ) => {
		let val = e.target.value;

		volumeTextFeild.textContent = `Volume: ${Math.floor(val * 100)}`;

		if( this.oscillator ) {
			this.gainNode.gain.value = val;
		}
		else{
			console.log('Please start the web audio with start button');
		}

	}


}

const audioapicontrols = new AudioApiControls( audioContext );

apiFormControl.frequency.addEventListener( 'input', audioapicontrols.frequency );
apiFormControl.volume.addEventListener( 'input', audioapicontrols.volume );
startWebAudio.addEventListener( 'click', audioapicontrols.playSound );