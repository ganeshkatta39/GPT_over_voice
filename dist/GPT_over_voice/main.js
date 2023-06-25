// adding the speak function for the GPT
const synth = window.speechSynthesis;
let voices = [];

function populateVoiceList() {
  voices = synth.getVoices();
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

function speak(phrase) {
  const utterThis = new SpeechSynthesisUtterance(phrase);
  utterThis.onend = () => {
    recognition.start();
  };
  utterThis.onerror = (e) => {
    console.log(e);
  };
  utterThis.voice = voices[3];
  utterThis.pitch = 0.8;
  utterThis.rate = 1;
  synth.speak(utterThis);
}

// adding a button to have user interaction so that the app works
const start_button = document.getElementById("start");
start_button.addEventListener("click", () => {
  recognition.start();
  start_button.parentNode.removeChild(start_button);
});

// loding animation
// Show the loading animation
function showLoadingAnimation() {
  document.getElementById("loading-animation").style.display = "flex";
}
// Hide the loading animation
function hideLoadingAnimation() {
  document.getElementById("loading-animation").style.display = "none";
}

const texts = document.querySelector(".texts");
let p = document.createElement("p");

// sends the post request to the server to get the response from the GPT api.
async function Call_GPT(prompt) {
  showLoadingAnimation();
  try {
    const response = await axios.post("https://gpt-over-voice.onrender.com", {
      prompt: prompt,
    });
    console.log(response.data.message.content);
    hideLoadingAnimation();
    // console.log();
    speak(response.data.message.content);
    p.innerText = "";
  } catch (error) {
    console.error("Error:", error);
  }
}

// speech recognition using webspeech api
window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;

recognition.addEventListener("result", (e) => {
  texts.appendChild(p);
  const text = Array.from(e.results)
    .map((result) => result[0])
    .map((result) => result.transcript)
    .join("");

  p.innerText = text;
});

recognition.addEventListener("end", () => {
  if (p.innerHTML != "") {
    Call_GPT(p.innerHTML);
  } else {
    recognition.start();
  }
});
