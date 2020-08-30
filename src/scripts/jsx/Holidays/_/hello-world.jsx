import React from 'react';
import Button from "@components/buttons/Button";
//import Button from "@components/buttons/Button"
//import ButtonSecondary, { BUTTON_SECONDARY_TYPE } from "@components/buttons/ButtonSecondary";
//import ButtonSecondary, { BUTTON_SECONDARY_TYPE } from "@components/buttons/ButtonSecondary";
//let btn = require("@components/buttons/ButtonSecondary");

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
