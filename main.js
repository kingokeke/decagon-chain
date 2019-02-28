$(document).ready(() => {
  let user = {};
  /**SIGN UP BUTTON ACTION */
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
            beforeSend: function (e) {
              if (!validateEmail(email)) {
                swal('Invalid', 'The email you entered is invalid!', 'warning');
                return;
              }
            },
            success: function (e) {
              /**cached this user profile */
              user = e;

              window.location.href = "user-admin.html";
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
  $('#login').on('click', (e) => {
    e.preventDefault();
    var uname = $('#uname-login').val();
    var pwd = $('#pwd').val();
    if (uname && pwd) {
      $.ajax({
        url: "http://localhost:5000/users?username=" + uname + "&password=" + pwd,
        type: "GET"
      })
        .done((res) => {
          if (res.length !== 0) {
            /**cached this user profile */
            user = res;
            window.location.href = "user-admin.html";
            swal("Successful!", "Login Sucessful!", "success");

          } else {
            swal("Authentication Error", "Username or Password not Correct!", "warning");
          }
        });
    } else {

      swal("oops!", "Please all felds are requird!", "warning");
    }
    $('#deposit').on('click', () => { payWithPaystack() });
  });
});



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

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
function validatePhone(phone) {
  var re = /\+234[789][01]\d\d\d\d\d\d\d\d/;
  return re.test(String(phone));
}

function pullWalletBalance() {

}