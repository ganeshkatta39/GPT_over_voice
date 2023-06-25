async function Call_GPT(prompt) {
  try {
    const response = await axios.post("http://localhost:3000", {
      prompt: prompt,
    });
    console.log(response.data.message.content);
    speak(response.data.message.content);
  } catch (error) {
    console.error("Error:", error);
  }
}

// form submition
const Form = document
  .getElementById("Form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission and page refresh
    var input = document.getElementById("prompt_input");
    Call_GPT(input.value);
    input.value = "";
    // Perform additional actions or submit the form to the server
  });

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
  utterThis.onerror = function (event) {
    console.error("SpeechSynthesisUtterance.onerror");
  };

  utterThis.voice = voices[3];
  utterThis.pitch = 0.8;
  utterThis.rate = 1;
  synth.speak(utterThis);
}
