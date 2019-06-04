export const CONFIG = {
    apiKey: "AIzaSyBv-Hs4Jzb5cNJlsa6010iyjuGVWiZWg4s",
    authDomain: "connect-project-5565a.firebaseapp.com",
    databaseURL: "https://connect-project-5565a.firebaseio.com",
    projectId: "connect-project-5565a",
    storageBucket: "connect-74f3a.appspot.com",
    messagingSenderId: "831530669975"
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