import { useState } from 'react';

const recognition = new window.webkitSpeechRecognition();
recognition.continuous = true;
recognition.lang = 'es-AR';

function App() {
  const [isRecording, setIsRecording] = useState<boolean>(false);

  async function handleBot(text: string) {
    try {
      const res = await fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: text
            }
          ]
        })
      });

      const data = await res.json();

      const response = data.choices
        ? data.choices[0].message.content
        : data.message || 'No response';

      reproducirVoz(response);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  function reproducirVoz(texto: string) {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(texto);

      speech.lang = 'es-AR';
      speech.pitch = 1.1;
      speech.rate = 1.1;
      window.speechSynthesis.speak(speech);
    } else {
      console.error(
        'La API de Speech Synthesis no es compatible con este navegador.'
      );
    }
  }

  function handleStartRecording() {
    setIsRecording(true);

    recognition.start();
    recognition.addEventListener(
      'result',
      (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join(' ');

        handleBot(transcript);
        console.log(transcript);
      },
      { once: true }
    );
  }
  function handleEndRecording() {
    setIsRecording(false);

    recognition.stop();
  }

  return (
    <section className="h-screen w-screen grid place-content-center gap-12">
      <h1 className="text-center font-semibold text-3xl">Sara</h1>
      <div
        className={`transition-colors w-72 h-72 rounded-full ${
          isRecording ? 'bg-red-500' : 'bg-red-600'
        } cursor-pointer`}
        onClick={isRecording ? handleEndRecording : handleStartRecording}
      ></div>
    </section>
  );
}

export default App;
