let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault(); // Browser-eigenes Prompt unterdrücken
  deferredPrompt = e;

  const installButton = document.getElementById('installButton');
  if (installButton) {
    installButton.style.display = 'inline-block';

    installButton.addEventListener('click', () => {
      installButton.style.display = 'none';
      deferredPrompt.prompt();

      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        deferredPrompt = null;
      });
    });
  }
});
