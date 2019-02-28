$(document).ready(() => {
  let user = {};
  /**SIGN UP BUTTON ACTION */
  $('#email').on('focusout', () => {
    if ($('#email').val()) {
      $.ajax({
        url: 'http://localhost:3000/users?email=' + $('#email').val(),
        type: 'GET',
      }).done(email_res => {
        if (email_res.length > 0) {
          swal(
            'Email conflict',
            'This email address has been taken. Please use a different one!',
            'warning'
          );
          $('#email').val('');
        }
      });
    }
  });
  $('#uname').on('focusout', () => {
    if ($('#uname').val()) {
      $.ajax({
        url: 'http://localhost:3000/users?username=' + $('#uname').val(),
        type: 'GET',
      }).done(uname_res => {
        if (uname_res.length > 0) {
          swal(
            'Username conflict',
            'This username has been taken. Please use a different one!',
            'warning'
          );
          $('#uname').val('');
        }
      });
    }
  });
  $('#add').on('click', e => {
    e.preventDefault();

    var fname = $('#fname').val();
    var lname = $('#lname').val();
    var uname = $('#uname').val();
    var phone = $('#phone').val();
    var email = $('#email').val();
    var pwd = $('#pwd').val();
    var repeatpwd = $('#re-pwd').val();
    var data = {};

    if (fname && lname && uname && pwd && repeatpwd && email && phone) {
      if (validateEmail(email)) {
        if (pwd === repeatpwd) {
          data = {
            firstname: fname,
            lastname: lname,
            Phone: phone,
            username: uname,
            email: email,
            password: pwd,
          };

          $.ajax({
            url: 'http://localhost:3000/users',
            type: 'POST',
            data: data,
            beforeSend: function(e) {
              if (!validateEmail(email)) {
                swal('Invalid', 'The email you entered is invalid!', 'warning');
                return;
              }
            },
            success: function(e) {
              /**cached this user profile */
              user = e;

              window.location.href = 'user-admin.html';
              swal('Successful!', 'Your account was created, Please login!', 'success');
            },
          });
        } else {
          swal('ooops!', 'Password do not match!', 'warning');
        }
      } else {
        swal('Invalid', 'The email you entered is invalid!', 'warning');
      }
    } else {
      swal('Error!', 'Please all fields are required!', 'warning');
    }
  });
  /**LOGIN BUTTON ACTION */
  $('#login').on('click', e => {
    e.preventDefault();
    var uname = $('#uname-login').val();
    var pwd = $('#pwd').val();
    if (uname && pwd) {
      $.ajax({
        url: 'http://localhost:3000/users?username=' + uname + '&password=' + pwd,
        type: 'GET',
      }).done(res => {
        if (res.length !== 0) {
          /**cached this user profile */
          user = res;
          window.location.href = 'user-admin.html';
          swal('Successful!', 'Login Sucessful!', 'success');
        } else {
          swal('Authentication Error', 'Username or Password not Correct!', 'warning');
        }
      });
    } else {
      swal('oops!', 'Please all felds are requird!', 'warning');
    }
    $('#deposit').on('click', () => {
      payWithPaystack();
    });
  });
});

function getCryptoPrices() {
  const proxyurl = 'https://cors-anywhere.herokuapp.com/';
  const url = 'https://api.binance.com/api/v1/ticker/price';
  let btcPrice = 0;
  fetch(proxyurl + url, { method: 'GET' })
    .then(response => response.json())
    .then(data => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].symbol == 'BTCUSDT') {
          btcPrice = Number(data[i].price).toFixed(2);
        }
      }
      const btcNairaPrice = Number(btcPrice * 360)
        .toFixed(2)
        .toLocaleString(undefined, { maximumFractionDigits: 2 });
      let btcUSDPrice = document.querySelector('#bitcoin-usd-price');
      let btcNGNPrice = document.querySelector('#bitcoin-ngn-price');
      btcUSDPrice.innerHTML = `<div class="bitcoin-usd-price">&#36;${Number(btcPrice)}</div>`;
      btcNGNPrice.innerHTML = `<div class="bitcoin-naira-price">&#8358;${btcNairaPrice}</div>`;
    });
}

getCryptoPrices();
setInterval(() => {
  getCryptoPrices();
}, 10000);

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
function validatePhone(phone) {
  var re = /\+234[789][01]\d\d\d\d\d\d\d\d/;
  return re.test(String(phone));
}

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

const charList = generateCharacterList();
function btcAddress(characterArray) {
  let address = '1';
  for (let i = 30; i--; ) {
    address += characterArray[getRandomInteger(0, charList.length)];
  }
  return address;
}

function ethAddress(characterArray) {
  let address = '0x';
  for (let i = 40; i--; ) {
    address += characterArray[getRandomInteger(0, charList.length)];
  }
  return address;
}

const btcAdd = btcAddress();
const ethAdd = ethAddress();

console.log(btcAdd);
console.log(ethAdd);
