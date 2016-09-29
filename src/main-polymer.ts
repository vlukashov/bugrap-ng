/**
 * Created by viktor on 29/09/16.
 */

// We have to wait for the Polymer elements to be loaded and registered before running the application code.
// Therefore, we have to postpone the Angular application import until the WebComponentsReady event is dispatched.
document.addEventListener('WebComponentsReady', () => {
  require('./main.ts');
});
