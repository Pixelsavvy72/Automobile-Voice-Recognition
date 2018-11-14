'use strict';


const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = 'en-US';
// recognition.lang = 'ja-JP';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const outputYou = document.querySelector('.output-you');
const outputBot = document.querySelector('.output-bot');
let currentSpeed = 0;
let currentlyPassing = false;
var distanceToNextVehicle = getRandomDistanceToNextVehicle();

document.querySelector('button').addEventListener('click', () => {
  recognition.start();
});

recognition.addEventListener('speechstart', () => {
  console.log('Speech has been detected.');
});

recognition.addEventListener('result', (e) => {
  console.log('Result has been detected.');

  let last = e.results.length - 1;
  let text = e.results[last][0].transcript;

  outputYou.textContent = text;
  console.log('Confidence: ' + e.results[0][0].confidence);
  doStuff(e);
});

recognition.addEventListener('speechend', (e) => {
  recognition.stop();
});

recognition.addEventListener('error', (e) => {
  outputBot.textContent = 'Error: ' + e.error;
});

function synthVoice(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance();
  utterance.text = text;
  synth.speak(utterance);
};

// Control logic
const doStuff = (e) => {
  let transcript = e.results[0][0].transcript;
  let distanceNumber;
  let speedNumber;
  
  // Set the distance to user specified or default.
  let distanceStr = (transcript.match(/^distance/));
  if(distanceStr !== null) {
    let newDistanceStr = distanceStr.input.split('');
    distanceNumber =
      (newDistanceStr[newDistanceStr.length-2] +
      newDistanceStr[newDistanceStr.length-1]);

  };
  // Set the distance to user specified or default.
  let speedStr = (transcript.match(/^speed/));
  if(speedStr !== null) {
    let newSpeedStr = speedStr.input.split('');
    speedNumber =
      (newSpeedStr[newSpeedStr.length-2] +
      newSpeedStr[newSpeedStr.length-1]);

  };


  switch (transcript.trim()) {
    
    case 'start simulation':
      currentSpeed = 55;
      outputBot.innerHTML = `Simulation started. Accelerated to 55.`;
      // synthVoice(`Simulation started. Accelerated to 55.`);
      break;
    case 'how fast am I going':
      if (currentSpeed === 0) {
        outputBot.innerHTML = "Um, you're not moving, Einstein.";
        // synthVoice(`Um, you're not moving, Einstein.`);
      } else {
        outputBot.innerHTML = `Your current speed is ${currentSpeed}.`;
        // synthVoice(`Your current speed is ${currentSpeed}.`);
      }
      break;
    // TODO: Check safe distance.
    case 'go faster':
      currentSpeed += 10;
      outputBot.innerHTML = `Ok, your current speed is now ${currentSpeed}.`;
      // synthVoice(`Ok, your current speed is now ${currentSpeed}.`);
      break;
    case 'slow down':
      currentSpeed -= 10;
      outputBot.innerHTML = `Your speed has been reduced to ${currentSpeed}.`;
      // synthVoice(`Your speed has been reduced to ${currentSpeed}.`);
      break;
    case 'speed ' + speedNumber:
      currentSpeed = speedNumber;
      outputBot.innerHTML = `Target speed set to ${currentSpeed}.`;
      passData('speedDoc', currentlyPassing, distanceToNextVehicle, currentSpeed);
      break;
    case 'stop':
      currentSpeed = 0;
      outputBot.innerHTML = `Ok, you have stopped.`;
      // synthVoice(`Ok, you have stopped.`);
      break;
    case 'State distance':
      outputBot.innerHTML =`You are currently ${distanceToNextVehicle} meters from the vehicle in front of you.`;
      // synthVoice(`You are currently ${distanceToNextVehicle} meters from the vehicle in front of you.`);
      break;
    case 'increase distance':
      distanceToNextVehicle += 5;
      outputBot.innerHTML = `Distance between vehicles increased to ${distanceToNextVehicle} meters.`;
      // synthVoice(`Distance between vehicles increased to ${distanceToNextVehicle} meters.`);
      break;
    case 'decrease distance':
      if(distanceToNextVehicle >= 8) {
        distanceToNextVehicle -= 5;
        outputBot.innerHTML = `Distance between vehicles decreased to ${distanceToNextVehicle} meters.`;
        // synthVoice(`Distance between vehicles decreased to ${distanceToNextVehicle} meters.`);

      } else {
        outputBot.innerHTML = `Current distance between vehicles is too small. No action taken.`;
        // synthVoice(`Current distance between vehicles is too small. No action taken.`);
      }
        break;

    // Get user specified distance
    case 'distance ' + distanceNumber:
      distanceToNextVehicle = distanceNumber;
      outputBot.innerHTML = `Distance to next vehicle set to ${distanceNumber} meters.`;
      passData('distanceDoc', currentlyPassing, distanceToNextVehicle, currentSpeed);
      break;
    case 'go around that car':
      outputBot.innerHTML = `Zoom zoom zoom!! Begining to pass vehicle.`;
      // synthVoice(`Zoom zoom zoom!! Begining to pass vehicle.`);
      currentlyPassing = true;
      passData('passingDoc', currentlyPassing, distanceToNextVehicle, currentSpeed);
      console.log(currentlyPassing);
      // Simulates the time it takes to complete the action.
      setTimeout(() => {
        currentlyPassing = false;
        outputBot.innerHTML = `Pass completed.`;
        // synthVoice(`Pass completed.`);
        console.log(currentlyPassing);
        passData('speedDoc', currentlyPassing, distanceToNextVehicle, currentSpeed);
      }, 10000);

      break;
    default:
      outputBot.innerHTML = `Beep bop boop! I didn't catch that. Try again.`;
      // synthVoice(`Beep bop boop! I didn't catch that. Try again.`);
      break;
  }
};

// Simulates a random distance between vehicles.
function getRandomDistanceToNextVehicle() {
  return Math.floor(Math.random() * 20) + 10;
};

let passData = (documentToSave, currentlyPassing, distanceToNextVehicle, currentSpeed) => {
  let data = {
    document: documentToSave,
    pass: currentlyPassing,
    distanceTo: distanceToNextVehicle,
    currentSpeed: currentSpeed
  }
  // $.post('saveDocument', data);
  console.log(data);
}




