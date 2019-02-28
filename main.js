$(document).ready(() => {
<<<<<<< HEAD

=======
  /**SIGN UP BUTTON ACTION */
>>>>>>> 85de1765aedd9dcf6526c674bc451321a95e1767


  $('#email').on('focusout', () => {
    if ($('#email').val()) {
      $.ajax({
        url: "http://localhost:3000/users?email=" + $("#email").val(),
        type: "GET"
      }).done((email_res) => {
        if (email_res.length > 0) {
          swal("Email conflict", "This email address has been taken. Please use a different one!", "warning");
          $("#email").val('');

        }

      });
    }
  });
  $('#uname').on('focusout', () => {
    if ($('#uname').val()) {
      $.ajax({
        url: "http://localhost:3000/users?username=" + $("#uname").val(),
        type: "GET"
      }).done((uname_res) => {
        if (uname_res.length > 0) {
          swal("Username conflict", "This username has been taken. Please use a different one!", "warning");
          $("#uname").val('');

        }

      });
    }
  });
  $('#add').on('click', e => {
    e.preventDefault();
    makeSignup();
  });

  /**LOGIN BUTTON ACTION */
  $('#login').on('click', (e) => {
    e.preventDefault();
    makeLogin();
  });


  /**PAYMENT BUTTON ACTION */
  $('#deposit').on('click', () => {
    /**get cached user */
    const user = getLocalStorageValue("user");
    let fundAmount = 370000.00;
    payWithPaystack(user.firstname + " " + user.lastname, user.email, user.phone)
  });
  if (isUserLogedIn()) {
    window.location.replace("user-admin.html");
  }
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
          value: phone //customer's mobile number
        }
      ]
    },
    callback: function (response) {
      /*after the transaction have been completed**/

      /**build and Post transaction history for this user */
      const user = JSON.parse(localStorage.getItem('user'));

      let transactionObject = {
        "userId": user['id'],
        "reference": response.reference,
        "transaction": response.transaction,
        "amount": fundAmount
      };

      $.ajax({
        url: 'http://localhost:5000/transaction-history',
        type: 'POST',
        data: transactionObject,
        success: function (res) {

          /**Credit this user with the amount*/
          user["naira-wallet"] += parseInt(user["naira-wallet"]) + fundAmount;

          $.ajax({
            method: "PATCH",
            url: 'http://localhost:5000/users/' + user['id'],
            data: user,
          })
            .done(function (msg) {

              /**cached this user profile */
              setLocalStorageValue("user", msg);
              swal('Successful!', 'Your account has been credited!', 'success');
              //populatWalletBalance();

            })
        },
      });

    },
    onClose: function () {
      //when the user close the payment modal
      swal("Cancelled", "Transaction cancelled!", "warning");
    }
  });
  handler.openIframe(); //open the paystack's payment modal
}


/**retrieves current currency price */
function getNairaPrize() {

  const proxyurl = 'https://cors-anywhere.herokuapp.com/'
  const url = 'https://api.binance.com/api/v1/ticker/price'
  var jsonCurrencyPrices = [];

  fetch(proxyurl + url, { 'method': 'GET' })
    .then(response => response.json())
    .then(data => console.log(data))

  return jsonCurrencyPrices;
}

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
    url: "http://localhost:5000/wallets?user-id=" + user.id,
    type: "GET"
  }).done((wallet_res) => {
    if (wallet_res.length > 0) {
      $("#amount").val(wallet_res["BTC"].total - balance);
      console.log(wallet_res["BTC"].total - balance);
    }

  });

}


/**caches user presence */
function setLocalStorageValue(key, value) {
  // Check browser support
  if (typeof (Storage) !== "undefined") {
    // Store
    localStorage.setItem(key, JSON.stringify(value));

  } else {
    swal("oops", "Sorry, your browser does not support Web Storage...!", "warning");

  }
}


/**gets cached user presence */
function getLocalStorageValue(key) {
  // Retrieve
  return JSON.parse(localStorage.getItem(key));
}

function isUserLogedIn() {
  return getLocalStorageValue("user");

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
          country: "Nigeria",
          language: "English",
          "naira-wallet": 0,
          verification: 0

        };

        $.ajax({
          url: 'http://localhost:5000/users',
          type: 'POST',
          data: data,
          beforeSend: function (e) {
            if (!validateEmail(email)) {
              swal('Invalid', 'The email you entered is invalid!', 'warning');
              return;
            }
          },
          success: function (res) {
            /**cached this user profile */
            setLocalStorageValue("user", res);

            window.location.href = "user-admin.html";
            swal('Successful!', 'Your account was created, Please login!', 'success');
            //populatWalletBalance();
          },
        });
      } else {
<<<<<<< HEAD
        swal('ooops!', 'Password do not match!', 'warning');
      }

    } else {
      swal('Invalid', 'The email you entered is invalid!', 'warning');
=======
        swal("oops!", "Please all felds are requird!", "warning");
      }
>>>>>>> 85de1765aedd9dcf6526c674bc451321a95e1767
    }
  } else {
    swal('Error!', 'Please all fields are required!', 'warning');
  }
}

<<<<<<< HEAD

/**sigin button function */
function makeLogin() {
  var uname = $('#uname-login').val();
=======
});
/**LOGIN BUTTON ACTION */
$('#login').on('click', (e) => {
  e.preventDefault();
  var uname = $('#uname').val();
>>>>>>> 85de1765aedd9dcf6526c674bc451321a95e1767
  var pwd = $('#pwd').val();
  if (uname && pwd) {
    $.ajax({
      url: "http://localhost:5000/users?username=" + uname + "&password=" + pwd,
      type: "GET"
    })
      .done((res) => {
        if (res.length !== 0) {
          /**cached this user profile */
          setLocalStorageValue("user", res);

          window.location.href = "user-admin.html";
          swal("Successful!", "Login Sucessful!", "success");
          //populatWalletBalance();

        } else {
          swal("Authentication Error", "Username or Password not Correct!", "warning");
        }
      });
  } else {

    swal("oops!", "Please all felds are requird!", "warning");
  }
<<<<<<< HEAD

}

function registerListeners() {

}
=======
});
$('#deposit').on('click', () => { payWithPaystack() });

/**forgot password */
$('#uname').on('focusout', () => {
  if ($("#uname").val()) {
    $.ajax({
      url: "http://localhost:3000/users?username=" + $("#uname").val(),
      type: "GET"
    }).done((uname_res) => {
      if (uname_res.length > 0) {
        swal("Username conflict", "This username has been taken. Please use a different one!", "warning");
        $("#uname").val('');

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

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
function validatePhone(phone) {
  var re = /\+234[789][01]\d\d\d\d\d\d\d\d/;
  return re.test(String(phone));
}
function payWithPaystack(phone, email, amount, name) {
  console.log("yeah");
  var handler = PaystackPop.setup({
    key: 'pk_test_b6ff1e69b9f6983bfa479e67bff6f3f7cad03c94', //put your public key here
    email: email, //put your customer's email here
    amount: amount, //amount the customer is supposed to pay
    metadata: {
      custom_fields: [
        {
          display_name: name,
          variable_name: name,
          value: phone //customer's mobile number
        }
      ]
    },
    callback: function (response) {
      //after the transaction have been completed
      //make post call  to the server with to verify payment 
      //using transaction reference as post data
      $.post("verify.php", { reference: response.reference }, function (status) {
        if (status == "success")
          swal("Successful!", "Transaction was Sucessful!", "success");

        else
          //transaction failed
          alert(response);
      });
    },
    onClose: function () {
      //when the user close the payment modal
      swal("Cancelled", "Transaction cancelled!", "warning");
    }
  });
  handler.openIframe(); //open the paystack's payment modal
}
function getNairaPrize() {
  const Http = new XMLHttpRequest();
  // const proxyurl = 'https://cors-anywhere.herokuapp.com/'
  const url = 'http://apilayer.net/api/live?access_key=1ff6fa7cf24a020bcfc7de477de91c91&source=NGN';
  var jsonCurrencyPrices = [];
  $.getJSON(url, function (data) {
    $.each(data, function (i, field) {
      jsonCurrencyPrices.push(JSON.stringify(field));
    });
  });

  return jsonCurrencyPrices;
}

function chagePassword(userId, pwd) {
  $.ajax({
    url: "http://localhost:3000/users/" + userId,
    type: "PUT",
    data: { "password": pwd }
  })
    .done((res) => {
      //if (res.length !== 0) {
      swal("Successful!", "password changed Sucessful!", "success");
      //}
    });
} 
>>>>>>> 85de1765aedd9dcf6526c674bc451321a95e1767
