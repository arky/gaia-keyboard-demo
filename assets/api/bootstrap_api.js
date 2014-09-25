'use strict';

(function(exports) {

var starter = exports.__starter = new KeyboardAppStarter();
starter.start();

}(window));

window.onmessage = function(e) {
  if (e.data.type === 'custom-layout') {
    if ('LayoutLoader' in window) {
      var layout = JSON.parse(e.data.layout);

      layout.autoCorrectLanguage = 'en';
      Object.keys(layout.alt).forEach(function(k) {
        if (typeof layout.alt[k] === 'string') {
          layout.alt[k] = layout.alt[k].split('');
        }
      });

      console.log('layout is', layout);

      LayoutLoader.prototype.getLayoutAsync = function() {
        return new Promise(function(res, rej) {
          res(layout);
        });
      };

      navigator.mozInputMethod.mgmt.next();

      var dictUrl = e.data.dict;
      setTimeout(function() {
        window.latinWorker.postMessage({ cmd: 'setLanguageByFullUrl', args: [
          layout.shortLabel.toLowerCase(),
          dictUrl
        ]});
      }, 1000);
    }
  }
};
