$(document).ready(() => {
  /**SIGN UP BUTTON ACTION */
  $('#email').on('focusout', () => {
    if (email) {
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
    if (uname) {
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

  $('#add').on({
    mouseenter: function () {
      $(this).css("background-color", "yellow");
    }
    , mouseleave: function () {
      $(this).css("background-color", "lightgrey");
    },
    click: function (e) {
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

        if (!validatePhone(phone) || phone.length !== 14) {
          swal("Invalid Phone Number", "The phone number you entered is invalid!", "warning");
          return;
        }
        if (!validateEmail(email)) {
          swal("Invalid Email Address", "The email you entered is invalid!", "warning");
          return;
        }

        if (pwd === repeatpwd) {
          data = { "firstname": fname, "lastname": lname, "Phone": phone, "username": uname, "email": email, "password": pwd };

          $.ajax({
            url: "http://localhost:3000/users",
            type: "POST",
            data: data,
            success: function (e) {
              //TODO make a link to the login page for successful signup
              swal("Successful!", "Your account was created, Please login!", "success");

            }
          });
        } else {
          swal("ooops!", "Password do not match!", "warning");
        }

      } else {
        swal("oops!", "Please all felds are requird!", "warning");
      }
    }
  });

});
/**LOGIN BUTTON ACTION */
$('#login').on('click', (e) => {
  e.preventDefault();
  var uname = $('#uname').val();
  var pwd = $('#pwd').val();
  if (uname && pwd) {
    $.ajax({
      url: "http://localhost:3000/users?username=" + uname + "&password=" + pwd,
      type: "GET"
    })
      .done((res) => {
        if (res.length !== 0) {
          swal("Successful!", "Login Sucessful!", "success");
        } else {
          swal("Authentication Error", "Username or Password not Correct!", "warning");
        }
      });
  } else {

    swal("oops!", "Please all felds are requird!", "warning");
  }
});
$('#deposit').on('click', () => { payWithPaystack() });


function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
function validatePhone(phone) {
  var re = /\+234[789][01]\d\d\d\d\d\d\d\d/;
  return re.test(String(phone));
}
function payWithPaystack() {
  console.log("yeah");
  var handler = PaystackPop.setup({
    key: 'pk_test_b6ff1e69b9f6983bfa479e67bff6f3f7cad03c94', //put your public key here
    email: 'matthiasogbodo@email.com', //put your customer's email here
    amount: 100000, //amount the customer is supposed to pay
    metadata: {
      custom_fields: [
        {
          display_name: "Mobile Number",
          variable_name: "mobile_number",
          value: "+2347032150416" //customer's mobile number
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
  //const proxyurl = 'https://cors-anywhere.herokuapp.com/'
  const url = 'http://apilayer.net/api/live?access_key=1ff6fa7cf24a020bcfc7de477de91c91&source=NGN';
  var jsonCurrencyPrices = [];
  $.getJSON(url, function (data) {
    $.each(data, function (i, field) {
      jsonCurrencyPrices.push(JSON.stringify(field));
    });
  });

  return jsonCurrencyPrices;
}