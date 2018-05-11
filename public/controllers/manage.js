$(document).ready(function(){
  let action = localStorage.getItem('authority');
  getDisplay = function(){
    let addAction = "<label for='action' class='text-primary'>authority :</label> <select class='form-control' id='authority'>";
    addAction+="<option>1</option>";
    addAction+="<option>2</option>";
    if(action == 3){
      addAction+="<option>3</option>";
    }
    addAction += "</select>";

    $('#partAuthority').html(addAction);

    let addPassword = "";
    if(action == 3){
      addPassword = "<input class='form-control' type='text' id='password'></input>";
    }
    else {
      addPassword = "<input class='form-control' type='password' id='password'></input>";
    }

    $('#partPassword').html(addPassword);

    $.get('/users/getall', function(data){

      let innerHtml='';

      for(let i in data)
      {
        innerHtml+="<tr><td><input type='text' id='listName' class='form-control' value="+data[i]['name']+"></input></td>";
        innerHtml+="<td><input type='email' id='listEmail' class='form-control' value="+data[i]['email']+"></input></td>";
        innerHtml+="<td><input type='text' id='listpassword' class='form-control' value="+data[i]['password']+"></input></td>";
        innerHtml+="<td>"+data[i]['authority']+"<i list-id="+data[i]['_id']+" class='fa fa-trash' style='float: right; padding-left: 20px;'></i><i list-id="+data[i]['_id']+" class='fa fa-save' style='float: right'></i></td></tr>";
      }
      $('#list').html(innerHtml);
    });
  }
  getDisplay();

  $("#save").on('click', function(e){
    event.preventDefault();

    let name = $('#name').val();
    let email = $('#email').val();
    let password = $('#password').val();
    let authority  = $('#authority').val();
    let encryptpwd = encrypt("20", password);
    $.ajax({
        url: '/users/save',
        data: {
          name: name,
          email: email,
          password: encryptpwd,
          authority: authority
        },
        type: 'POST',
        success: function(result) {
          getDisplay();
          $('#resultMsg').text("Save successfully.");
          setTimeout(function(){
            $('#resultMsg').text("");
          }, 3000);
        }
    });
  });

  $(document).on('click', '#list tr td i.fa-save', function(event){
    let entryId=$(this).attr('list-id');
    let trElement=$(this).parent().parent();
    let name=trElement.children(":eq(0)").children().val();
    let email=trElement.children(":eq(1)").children().val();
    let password=trElement.children(":eq(2)").children().val();
    let encryptpwd = encrypt('20', password);
    let authority=trElement.children(":eq(3)").text();
    $.ajax({
        url: '/users/update/'+entryId,
        data: {
          name: name,
          email: email,
          password: encryptpwd,
          authority: authority,
        },
        type: 'PUT',
        success: function(result) {
          getDisplay();
          $('#resultMsg').text("Update successfully.");
          setTimeout(function(){
            $('#resultMsg').text("");
          }, 3000);
        }
    });
  });

  $(document).on('click', '#list tr td i.fa-trash', function(event){
    let trElement=$(this).parent().parent();
    let entryId=$(this).attr('list-id');
    $.ajax({
        url: '/users/'+entryId,
        type: 'DELETE',
        success: function(result) {
          console.log(result);
          trElement.remove();
          $('#resultMsg').text("Delete successfully.");
          setTimeout(function(){
            $('#resultMsg').text("");
          }, 3000);
        }
    });
  });
});
