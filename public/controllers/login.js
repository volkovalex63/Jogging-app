
$(document).ready(function(){
  $("#submit").click(function(){
    event.preventDefault();

    let email = $("#email").val();
    let password = $("#password").val();
    if(!email || !password)return;
    let encryptpwd = encrypt("20", password);

    $.post('/login',{
        email: email,
        password: encryptpwd
      },
      function(data, status){
        console.log(data);
        if(data["result"] == "success"){
          window.location = '/dashboard';
        }
        else {
          $('#incorrectMsg').text("Please input again.");
          console.log("error");
        }
      }
    );
  });
});
