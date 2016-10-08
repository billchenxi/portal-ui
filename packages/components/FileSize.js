/* @flow */
/* eslint flowtype/no-weak-types:0 */

import React from 'react';
import filesize from 'filesize';

type TProps = {|
  bytes: number,
  options?: {|
    base?: number,
    bits?: boolean,
    exponent?: number,
    output?: string,
    round?: number,
    spacer?: string,
    standard?: string,
    symbols?: Object,
    unix?: boolean,
  |},
|};

const FileSize = (props: TProps) => (
  <span>{filesize(props.bytes, {
    base: 10,
    ...props.options,
  })}</span>
);

export default FileSize;
