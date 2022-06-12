import React from 'react';

const useCustomHook = () => {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    //fetch value using serviceFunctionCall o directly use axios
  }, []);
};

export default useCustomHook;
