// script.js
document
  .getElementById('text-to-speech-form')
  .addEventListener('submit', async function (event) {
    event.preventDefault();
    const text = document.getElementById('text-input').value;

    const voice = document.getElementById('voice-select').value;

    const fileNameInput = document.getElementById('file-name');
    let fileName = fileNameInput.value.trim();
    fileName = fileName || 'speech'; // Default file name if none is entered

    // Send text and voice to the server to synthesize speech
    const response = await fetch('/synthesize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, voice }),
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      // Create an audio element and set its source to the blob URL
      const audio = new Audio(url);
      audio.controls = true;

      // Optionally, set the audio to autoplay or provide a play button
      audio.autoplay = true; // or set to false and create a play button for the user to press

      // Append the audio element to the DOM for playback
      const audioContainer = document.getElementById('audio-container');
      audioContainer.innerHTML = ''; // Clear any previous audio elements
      audioContainer.appendChild(audio);

      // Update the download link to use the blob URL and the custom file name
      const downloadLink = document.getElementById('download-link');
      downloadLink.href = url;
      downloadLink.download = `${fileName}.mp3`; // Use the custom file name
      downloadLink.textContent = 'Download Speech';
      downloadLink.style.display = 'inline-block'; // Make the download link visible

      // Clear the file name input after setting the download link
      fileNameInput.value = '';
    } else {
      alert('Failed to convert text to speech. Please try again.');
    }
  });
