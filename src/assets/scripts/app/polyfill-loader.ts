/*!
 * Polyfill Loader
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

// from:https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/remove()/remove().md
((arr: any[]) => {
    arr.forEach((item) => {
        item.remove = item.remove || function () {
          this.parentNode.removeChild(this);
        };
    });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);


