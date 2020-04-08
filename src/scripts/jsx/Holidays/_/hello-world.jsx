import React from 'react';
import Button from "style-guide/src/components/buttons/Button";
//import Button from "../../../../../node_modules/style-guide/src/components/buttons/Button"
//import ButtonSecondary, { BUTTON_SECONDARY_TYPE } from "../../../../../node_modules/style-guide/src/components/buttons/ButtonSecondary";
//import ButtonSecondary, { BUTTON_SECONDARY_TYPE } from "style-guide/src/components/buttons/ButtonSecondary";
//let btn = require("../../../../../node_modules/style-guide/src/components/buttons/ButtonSecondary");

class HelloWorld extends React.Component {
  render() {
    return <div>
      <Button type="solid-blue" size="small">
        I am primary small button
      </Button>
    </div>;
  }
}

export default HelloWorld;
