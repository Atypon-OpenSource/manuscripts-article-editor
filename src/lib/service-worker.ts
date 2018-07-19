import config from '../config'

if (config.serviceworker) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(registration => {
          // tslint:disable-next-line:no-console
          console.log('ServiceWorker registered: ', registration)
        })
        .catch(error => {
          // tslint:disable-next-line:no-console
          console.error('ServiceWorker registration failed: ', error)
        })
    })
  }
}
