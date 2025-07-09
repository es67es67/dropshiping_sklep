// Przykład użycia Web Speech API w przeglądarce (możesz dodać jako osobny komponent w React)
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }
  
  module.exports = speak;
  