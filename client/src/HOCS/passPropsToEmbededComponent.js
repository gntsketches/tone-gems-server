import React, { PureComponent } from 'react';


export default function passPropsToEmbededComponent(propsObject) {
  return function (EmbedClass) {
    const klass = class extends PureComponent {

      render() {
        return <EmbedClass  {...propsObject} />;
      }
    };

    return klass;
  };
}
/* eslint-enable */
