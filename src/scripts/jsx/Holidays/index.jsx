import React from 'react';
import ReactDom from 'react-dom';
import HelloWorld from "./_/hello-world.jsx";
import WaitForElement from '../../helpers/WaitForElement.js';

(async () => {
  let _contentOld = await WaitForElement("#content-old");

  if (_contentOld.length > 0) {
    let contentOld = _contentOld[0];


    ReactDom.render(
      <HelloWorld />,
      contentOld
    );
  }
})();