/*!
 * App Loader
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

((window, document) => {
    'use strict';

    window.addEventListener('load', () => {
        let body = document.body;
        let loader = body.querySelector('.preloader--base');
        let appRoot = body.querySelector('app-root');

        // poll if if the application has already bootstrapped.
        // remove the loader when the childElementCount is greater than 0
        let timer = setInterval(() => {
            if (appRoot.childElementCount > 0) {
                body.removeChild(loader);
                loader = null;

                clearInterval(timer);
            }
        }, 100);
    });
})(window, document);


