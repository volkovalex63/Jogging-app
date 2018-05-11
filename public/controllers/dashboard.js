$(document).ready(function(){
  function getDisplayFromTo()
  {
    let from=$('#from').val();
    let to=$('#to').val();

    let d1 = Date.parse(from);
    let d2 = Date.parse(to);

    if (d1 > d2) return;

    $.get('/users/getname', function(data){
      let addName = "<select class='form-control' id='addName' name='name'>";
      for(let i in data){
        addName+="<option user-id="+data[i]['_id']+">"+data[i]['name']+"</option>";
      }
      addName += "</select>";
      $('#selectName').html(addName);
    });

    $.get('/dashboard/'+from+'/'+to, function(data){
      console.log(data);
      let innerHtml='';

      for(let i = 0; i < data.length-1; i++)
      {
        innerHtml+="<tr><td>"+data[i]['userid']['name']+"</td>";
        innerHtml+="<td><input type='date' id='inputDate' class='form-control' value="+formatDate(new Date(data[i].inputdate))+"></input></td>";
        innerHtml+="<td><input type='number' id='distance' class='form-control' value="+data[i].distance+"></input></td>";
        innerHtml+="<td><input type='number' id='time' class='form-control' value="+data[i].time+"></input></td>";
        innerHtml+="<td>"+precisionRound(data[i].distance / data[i].time, 3)+"<i list-id="+data[i]._id+" class='fa fa-trash' style='float: right; padding-left: 20px;'></i><i list-id="+data[i]._id+" class='fa fa-save' style='float: right'></i></td></tr>";
      }

      localStorage.setItem('authority', data[data.length-1]['authority']);

      // $('#selectName').html(addName);
      $('#list').html(innerHtml);
    });
  }
  //initalization
  let today = formatDate(new Date());
  let tmp = today.split('-');
  let from = [tmp[0], tmp[1],"01"].join("-");
  let to = [tmp[0], tmp[1],"31"].join("-");
  $('#from').val(from);
  $('#to').val(to);
  $('#addDate').val(today);
  getDisplayFromTo();

  //event changed.
  $('#from').on('change',function(){getDisplayFromTo()});
  $('#to').on('change',function(){getDisplayFromTo()});

  $('#save').on('click', function(event){
    event.preventDefault();
    let name = $('#addName').val();
    // console.log($("#addName").children());
    let date = $('#addDate').val();
    let distance = $('#addDistance').val();
    let time = $('#addTime').val();
    let dd = new Date(date);
    let tmp = date.split("-");
    let week = tmp[0]+"-"+tmp[1]+"-"+getMonthWeek(dd);
    if(date=='' || distance=='' || time=='' || parseFloat(distance) < 0 || parseFloat(time) <0){
      $('#addDistance').val("");
      $('#addTime').val("");
      return;
    }

    $.post('/dashboard/save',
      {
        name: name,
        date: date,
        distance: distance,
        time: time,
        week: week
      },
      function(result){
        $('#addDistance').val("");
        $('#addTime').val("");
        getDisplayFromTo();
    });
  });


  $(document).on('click', '#list tr td i.fa-trash', function(event){
    let trElement=$(this).parent().parent();
    let entryId=$(this).attr('list-id');
    $.ajax({
        url: '/dashboard/'+entryId,
        type: 'DELETE',
        success: function(result) {
          console.log(result);
          trElement.remove();
        }
    });
  });

  $(document).on('click', '#list tr td i.fa-save', function(event){
    let entryId=$(this).attr('list-id');
    let trElement=$(this).parent().parent();
    let username=trElement.children(":eq(0)").children().val();
    let date=trElement.children(":eq(1)").children().val();
    let distance=trElement.children(":eq(2)").children().val();
    let time=trElement.children(":eq(3)").children().val();
    let dd = new Date(date);
    let tmp = date.split("-");
    let week = tmp[0]+"-"+tmp[1]+"-"+getMonthWeek(dd);

    $.ajax({
        url: '/dashboard/update/'+entryId,
        data: {
          name: username,
          date: date,
          distance: distance,
          time: time,
          week: week
        },
        type: 'PUT',
        success: function(result) {
          getDisplayFromTo();
          $('#resultMsg').text("Update successfully.");
          setTimeout(function(){
            $('#resultMsg').text("");
          }, 3000);
        }
    });
  });

  //this show entry list.

});
