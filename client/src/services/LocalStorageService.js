//todo: __________________________ LOCAL STORAGE SERVICE __________________________

//? Store data in local storage
export const storeTokenByValue = (value) => {
  localStorage.setItem('token', value);
};
export const storeTokenByObj = (objParam) => {
  localStorage.setItem('token', JSON.stringify(objParam)); // JSON.stringify(objParam) to convert object to string
  // use JSON.parse to convert string back to object
};

//? Get data in local storage
export const getTokenByValue = () => {
  return localStorage.getItem('token');
};

export const getTokenByObject = () => {
  return JSON.parse(localStorage.getItem('token'));
  // use JSON.parse to convert string back to object
};

//? Remove data in local storage
export const removeToken = () => {
  localStorage.removeItem('token');
};
