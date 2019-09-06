import React, { FC } from 'react';

import './style.css';

import { IProps } from './types';

const Loader: FC<IProps> = ({
  height = 500,
  width = 500
}) => (
  <div className="loader" style={{ height, width }} />
);

export default Loader;

