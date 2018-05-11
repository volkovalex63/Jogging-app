$(document).ready(function(){
  let action = localStorage.getItem('authority');

  $.ajax({
      url: '/reports/getweek',
      type: 'get',
      success: function(result) {
        let addWeek = "<option></option>";
        for(i in result){
          addWeek += "<option>"+result[i]+"</option>";
        }
        $('#weeks').html(addWeek);
      }

  });
  // getDisplay = function(){
  //   let addAction = "<label for='action' class='text-primary'>authority :</label> <select class='form-control' id='authority'>";
  //   addAction+="<option>1</option>";
  //   addAction+="<option>2</option>";
  //   if(action == 3){
  //     addAction+="<option>3</option>";
  //   }
  //   addAction += "</select>";
  //
  //   $('#partAuthority').html(addAction);
  //
  //   let addPassword = "";
  //   if(action == 3){
  //     addPassword = "<input class='form-control' type='text' id='password'></input>";
  //   }
  //   else {
  //     addPassword = "<input class='form-control' type='password' id='password'></input>";
  //   }
  //
  //   $('#partPassword').html(addPassword);
  //
  //   $.get('/users/getall', function(data){
  //
  //     let innerHtml='';
  //
  //     for(let i in data)
  //     {
  //       innerHtml+="<tr><td><input type='text' id='listName' class='form-control' value="+data[i]['name']+"></input></td>";
  //       innerHtml+="<td><input type='email' id='listEmail' class='form-control' value="+data[i]['email']+"></input></td>";
  //       innerHtml+="<td><input type='text' id='listpassword' class='form-control' value="+data[i]['password']+"></input></td>";
  //       innerHtml+="<td>"+data[i]['authority']+"<i list-id="+data[i]['_id']+" class='fa fa-trash' style='float: right; padding-left: 20px;'></i><i list-id="+data[i]['_id']+" class='fa fa-save' style='float: right'></i></td></tr>";
  //     }
  //     $('#list').html(innerHtml);
  //   });
  // }
//   getDisplay();
//
  $('#weeks').on('change', function(){
    $.ajax({
      url: '/reports/getweekdata',
      type: 'post',
      data: {
        week: $(this).val()
      },
      success: function(data) {
        let innerHtml='';

        let resultSum = [];
        for(let i in data)
        {
          resultSum[data[i]['userid']['name']] = !resultSum[data[i]['userid']['name']]?[]:resultSum[data[i]['userid']['name']];
          resultSum[data[i]['userid']['name']]['count'] = !resultSum[data[i]['userid']['name']]['count']?0:resultSum[data[i]['userid']['name']]['count'];
          let tmp = precisionRound(data[i]['time']==0?0:data[i]['distance']/data[i]['time'], 3);
          // resultSum[data[i]['userid']['name']]['distance'] += precisionRound(parseFloat(data[i]['distance'])+resultSum[data[i]['userid']['name']]['distance'], 3);
          let speed = !resultSum[data[i]['userid']['name']]['speed']?0: resultSum[data[i]['userid']['name']]['speed'];
          let distance = !resultSum[data[i]['userid']['name']]['distance']?0: resultSum[data[i]['userid']['name']]['distance'];
          resultSum[data[i]['userid']['name']]['speed'] = parseFloat(tmp)+speed;
          resultSum[data[i]['userid']['name']]['distance'] = parseFloat(data[i]['distance'])+distance;
          resultSum[data[i]['userid']['name']]['count']++;
        }
        console.log(resultSum);

        $.ajax({
            url: '/users/getdistinctname',
            type: 'get',
            success: function(result) {
              let innerHtml = "";
              for(i in result){
                innerHtml+="<tr><td>"+result[i]+"</td>";
                if(!resultSum[result[i]])continue;
                let tmpspeed = !resultSum[result[i]]['speed']?0:resultSum[result[i]]['speed'];
                let tmpdistance = !resultSum[result[i]]['distance']?0:resultSum[result[i]]['distance'];
                let tmpcount = !resultSum[result[i]]['count']?1:resultSum[result[i]]['count'];
                innerHtml+="<td>"+precisionRound(tmpspeed/(tmpcount),3)+"</td>";
                innerHtml+="<td>"+precisionRound(tmpdistance/(tmpcount),3)+"</td></tr>";
              }
              $('#list').html(innerHtml);
            }
        });
      }
    });
  });
});
