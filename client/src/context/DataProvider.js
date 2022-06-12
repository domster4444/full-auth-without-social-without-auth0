import React from 'react';
import { Provider } from './context';

const DataProvider = ({ children }) => {
  const [data, setData] = React.useState();
  const [state, setState] = React.useState({
    loading: false,
    error: false,
    success: false,
    data: null,
  });

  // fetch data using rtk query & manupulate data state.
  // or use custom hook that utilizes services to fetch data & manupulate data state

  //   getting state data ready to pass
  const dataToPass = {
    data,
    state,
    setData,
    setState,
  };

  return <Provider value={dataToPass}>{children}</Provider>;
};
