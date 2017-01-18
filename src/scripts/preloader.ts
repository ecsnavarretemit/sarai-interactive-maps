/*!
 * App Loader
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

((window, document) => {
    'use strict';

    window.addEventListener('load', () => {
        const body = document.body;
        const appRoot = body.querySelector('app-root');
        let loader = body.querySelector('.preloader--base');

        // poll if if the application has already bootstrapped.
        // remove the loader when the childElementCount is greater than 0
        const timer = setInterval(() => {
          if (appRoot !== null && appRoot.childElementCount > 0) {
            body.removeChild(loader);
            loader = null;

            clearInterval(timer);
          }
        }, 100);
    });
})(window, document);


