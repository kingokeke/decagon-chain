/* eslint-disable no-undef, no-unused-vars */
//if (isUserLogedIn()) {
// window.location.replace('user-admin.html');
//}
$(document).ready(() => {
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
    makeSignup();
  });

  /**LOGIN BUTTON ACTION */
  $('#login').on('click', e => {
    e.preventDefault();
    makeLogin();
  });

  /**PAYMENT BUTTON ACTION */
  $('#deposit').on('click', () => {
    /**get cached user */
    const user = getLocalStorageValue('user');
    payWithPaystack(user.firstname + ' ' + user.lastname, user.email, user.phone);
  });
});

/**pastack sanbox Payment processor gateway*/
function payWithPaystack(name, email, phone, fundAmount) {
  var handler = PaystackPop.setup({
    key: 'pk_test_b6ff1e69b9f6983bfa479e67bff6f3f7cad03c94', //public key
    email: email, //customer's email
    amount: fundAmount, //amount the customer is supposed to pay
    metadata: {
      custom_fields: [
        {
          display_name: name,
          variable_name: phone,
          value: phone, //customer's mobile number
        },
      ],
    },
    callback: function(response) {
      /*after the transaction have been completed**/

      /**build and Post transaction history for this user */
      const user = JSON.parse(localStorage.getItem('user'));

      let transactionObject = {
        userId: user['id'],
        reference: response.reference,
        transaction: response.transaction,
        amount: fundAmount,
      };

      $.ajax({
        url: 'http://localhost:5000/transaction-history',
        type: 'POST',
        data: transactionObject,
        success: function(res) {
          /**Credit this user with the amount*/
          user['naira-wallet'] += parseInt(user['naira-wallet']) + fundAmount;

          $.ajax({
            method: 'PATCH',
            url: 'http://localhost:5000/users/' + user['id'],
            data: user,
          }).done(function(msg) {
            /**cached this user profile */
            setLocalStorageValue('user', msg);
            swal('Successful!', 'Your account has been credited!', 'success');
            //populatWalletBalance();
          });
        },
      });
    },
    onClose: function() {
      //when the user close the payment modal
      swal('Cancelled', 'Transaction cancelled!', 'warning');
    },
  });
  handler.openIframe(); //open the paystack's payment modal
}

/**retrieves current currency price */
function getBTCPrices() {
  const proxyurl = 'https://cors-anywhere.herokuapp.com/';
  const url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd';
  let btcPrice = 0;
  fetch(proxyurl + url, { method: 'GET' })
    .then(response => response.json())
    .then(data => {
      btcPrice = data.bitcoin.usd;
      const btcNairaPrice = Number(btcPrice * 360).toFixed(2);
      let btcUSDPrice = document.querySelector('#bitcoin-usd-price');
      let btcNGNPrice = document.querySelector('#bitcoin-ngn-price');
      btcUSDPrice.innerHTML = `<div class="bitcoin-usd-price">&#36;${Number(btcPrice)}</div>`;
      btcNGNPrice.innerHTML = `<div class="bitcoin-naira-price">&#8358;${btcNairaPrice}</div>`;
    });
}

getBTCPrices();
setInterval(() => {
  getBTCPrices();
}, 10000);

/**email validator */
function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

/**phone number validator */
function validatePhone(phone) {
  var re = /\+234[789][01]\d\d\d\d\d\d\d\d/;
  return re.test(String(phone));
}

/**retrieves user wallets */
function populatWalletBalance() {
  const user = JSON.parse(localStorage.getItem('user'));
  $.ajax({
    url: 'http://localhost:5000/wallets?user-id=' + user.id,
    type: 'GET',
  }).done(wallet_res => {
    if (wallet_res.length > 0) {
      $('#amount').val(wallet_res['BTC'].total - balance);
      console.log(wallet_res['BTC'].total - balance);
    }
  });
}

/**caches user presence */
function setLocalStorageValue(key, value) {
  // Check browser support
  if (typeof Storage !== 'undefined') {
    // Store
    localStorage.setItem(key, JSON.stringify(value));
  } else {
    swal('oops', 'Sorry, your browser does not support Web Storage...!', 'warning');
  }
}

/**gets cached user presence */
function getLocalStorageValue(key) {
  // Retrieve
  return JSON.parse(localStorage.getItem(key));
}

function isUserLogedIn() {
  return getLocalStorageValue('user');
}

/**signup button function */
function makeSignup() {
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
          phone: phone,
          username: uname,
          email: email,
          password: pwd,
          country: 'Nigeria',
          language: 'English',
          'naira-wallet': 0,
          verification: 0,
        };

        $.ajax({
          url: 'http://localhost:5000/users',
          type: 'POST',
          data: data,
          beforeSend: function(e) {
            if (!validateEmail(email)) {
              swal('Invalid', 'The email you entered is invalid!', 'warning');
              return;
            }
          },
          success: function(res) {
            /**cached this user profile */
            setLocalStorageValue('user', res);

            window.location.href = 'user-admin.html';
            swal('Successful!', 'Your account was created, Please login!', 'success');
            //populatWalletBalance();
          },
        });
      } else {
        swal('oops!', 'Please all fields are required!', 'warning');
      }
    }
  } else {
    swal('Error!', 'Please all fields are required!', 'warning');
  }
}

/**login button function */
function makeLogin() {
  var uname = $('#uname-login').val();
  var pwd = $('#pwd').val();
  if (uname && pwd) {
    $.ajax({
      url: 'http://localhost:5000/users?username=' + uname + '&password=' + pwd,
      type: 'GET',
    }).done(res => {
      if (res.length !== 0) {
        /**cached this user profile */
        setLocalStorageValue('user', res);

        window.location.href = 'user-admin.html';
        swal('Successful!', 'Login Sucessful!', 'success');
        //populatWalletBalance();
      } else {
        swal('Authentication Error', 'Username or Password not Correct!', 'warning');
      }
    });
  } else {
    swal('oops!', 'Please all fields are required!', 'warning');
  }
}

/**forgot password */
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

/**change password */
$('#chanFgePwd').on('click', () => {
  var pwd = $('#pwd').val();
  var repeatPwd = $('#re-pwd').val();

  if (pwd && repeatPwd) {
    chagePassword(pwd);
  }
});

function chagePassword(userId, pwd) {
  $.ajax({
    url: 'http://localhost:3000/users/' + userId,
    type: 'PUT',
    data: { password: pwd },
  }).done(res => {
    swal('Successful!', 'password changed Sucessful!', 'success');
  });
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

// Kingsley Edit
const editProfileFirstName = document.querySelector('#edit-profile-firstname');
const editProfileLastName = document.querySelector('#edit-profile-lastname');
const editProfilePhone = document.querySelector('#edit-profile-phone');
const editProfilePicture = document.querySelector('#edit-profile-picture');
const editProfilePassword = document.querySelector('#edit-profile-password');
const editProfileConfirm = document.querySelector('#edit-profile-confirm');
const editProfileCountry = document.querySelector('#edit-profile-country');

fetch(`http://localhost:3000/users?first-name=Kingsley`)
  .then(response => response.json())
  .then(data => {
    document.querySelector('#profile-user-fullname').innerHTML = `${data[0]['first-name']} ${
      data[0]['last-name']
    }`;
    document.querySelector('#profile-user-email').innerHTML = `${data[0]['email']}`;
    document.querySelector('#profile-user-phone').innerHTML = `${data[0]['phone-number']}`;
    document.querySelector('#profile-user-country').innerHTML = `${data[0]['country']}`;
    document.querySelector('#edit-profile-firstname').value = `${data[0]['first-name']}`;
    document.querySelector('#edit-profile-lastname').value = `${data[0]['last-name']}`;
    document.querySelector('#edit-profile-phone').value = `${data[0]['phone-number']}`;
    document.querySelector('#edit-profile-password').value = `${data[0]['password']}`;
    document.querySelector('#edit-profile-confirm').value = `${data[0]['password']}`;
    document.querySelector('#edit-profile-country').value = `${data[0]['country']}`;
  });
