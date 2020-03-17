import React, { FunctionComponent, useState, useMemo } from 'react';
import { Button } from '@blueprintjs/core';
import classNames from 'classnames';
import styles from './styles.scss';

export interface AppProps {
  count: number;
}

export const App: FunctionComponent<AppProps> = ({ count }) => {
  const range = useMemo(() => {
    //equivalent of System.Linq.Enumerable.Range
    const output = [] as number[];
    for (let index = 0; index < count; index++) {
      output.push(index);
    }
    return output;
  }, [count]);

  const [selection, setSelection] = useState(0);

  const onClick = (index: number) => setSelection(index);

  const items = useMemo(() => {
    return range.map(index => (
      <li
        key={index}
        className={classNames(styles.li, {
          [styles.active]: selection === index
        })}
      >
        <Button
          key={index}
          text={`Button #${index + 1}`}
          onClick={onClick.bind(undefined, index)}
        />
      </li>
    ));
  }, [range, selection]);

  return <ul className={styles.container}>{items}</ul>;
};
