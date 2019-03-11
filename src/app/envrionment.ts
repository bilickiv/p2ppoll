export const CONFIG = {
    apiKey: "AIzaSyCdzaz74d4zeRsMA8AwU3habEqnIguhXEU",
    authDomain: "connect-74f3a.firebaseapp.com",
    databaseURL: "https://connect-74f3a.firebaseio.com",
    projectId: "connect-74f3a",
    storageBucket: "connect-74f3a.appspot.com",
    messagingSenderId: "499926086518"
  };

  export const convertArray = value => {
      let vArray = [];
      value.forEach(element => {
        let item = element.val();
        item.key = element.key;
        vArray.push(item);
      });
      return vArray;
  }