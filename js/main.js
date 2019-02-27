$(document).ready(function() {
  const $emailLogin = document.querySelector('#input');
  const $passwordLogin = document.querySelector('#password-login');
  const $submitLogin = document.querySelector('#submit-login');
  const charList = generateCharacterList();

  //

  //

  //

  // Function Declarations

  function generateCharacterList() {
    const array = [];
    for (let i = 48; i <= 57; i++) {
      array[array.length] = String.fromCharCode(i);
    }
    for (let i = 65; i <= 90; i++) {
      array[array.length] = String.fromCharCode(i);
    }
    for (let i = 97; i <= 122; i++) {
      array[array.length] = String.fromCharCode(i);
    }
    return array;
  }

  function getRandomInteger(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function btcAddress(characterArray) {
    let address = '1';
    for (let i = 30; i--; ) {
      address += characterArray[getRandomInteger(0, charList.length)];
    }
    return address;
  }
});

// // const btcAdd = btcAddress();
// // console.log(btcAdd);
// // console.log(Date.now());
