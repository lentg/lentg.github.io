var appId = 'pimejb32ayn6tbat7aa3w2j01mwmsmdqwwhb5in5hv14jw9x'
var clientId;
var room;
var roomId;
var userId;
var from;
AV.initialize("pimejb32ayn6tbat7aa3w2j01mwmsmdqwwhb5in5hv14jw9x", "jeb9bgsohsh55th6qyi0ngnbqhpjzc39bj68xhwo32dwi2r6");
var rt = AV.realtime({
    appId: appId,
    clientId: 'admin',
    encodeHTML: true
  })


$(function() {
  var $users = $('#users')
  var $msgs = $('#msgs')
  var $msg = $('#msg')
  var $input = $('#input')
  var html = $('#sign').html()

  layer.open({
      type: 1,
      skin: 'layui-layer-demo',
      closeBtn: false,
      area: '350px',
      shift: 2,
      title: '登录',
      shadeClose: true,
      content: html,
      success: function(layero, index){
        $('#sign form').on('submit', function() {
          var obj = {
            username: this.username.value,
            password: this.password.value,
          }
          clientId = 'admin'
          listUsers()
          layer.close(index);
          return false;
        })
      }
  });

  function listUsers () {
    var query = new AV.Query(AV.User);
    query.notEqualTo('username', 'admin')
    query.find({
      success: function(rs) {
        rs.forEach(function(item) {
          $users.append('<li id="'+item.get('room')+'">'+item.get('username')+'</li>')
        })
        $users.find('li').on('click', function() {
          from = this.innerHTML
          $users.find('.active').removeClass('active')
          $(this).removeClass('unread').addClass('active')
          rt.room(this.id, function(obj) {
            room = obj
            $input.focus()
            room.log(function(logs) {
              showLogs(logs)
            })
          })
        })
      }
    })
  }

  function scroll () {
    $msgs.scrollTop($msgs[0].scrollHeight)
  }

  function showLogs (logs) {
    $msgs.empty()
    // logs.forEach(function(log) {
    //   $msgs.append('<li><b>'+log.from+'</b>: '+log.data+'</li>')
    // })
    logs.forEach(function(log) {
      if (clientId != log.from) {
        $msgs.append('<li class="from">'+log.data+' :<b>'+log.from+'</b></li>')
      } else {
        $msgs.append('<li><b>'+log.from+'</b>: '+log.data+'</li>')
      }
      // var klass = log.from == 'clientId' ? 'class="to"' : ''
    })
    $msgs.scrollTop($msgs[0].scrollHeight)
  }

  $msg.on('submit', function() {
    var txt = this.msg.value
    $msgs.append('<li><b>'+clientId+'</b>: '+txt+'</li>')
    room.send(txt)
    $input.val('').focus()
    scroll()
    return false;
  })
  
  rt.on('message', function(data) {
    if (from == data.fromPeerId) {
      $msgs.append('<li class="from">'+data.msg+' :<b>'+from+'</b></li>')
      scroll()
      return;
    };
    from = data.fromPeerId
    $users.find("#"+data.cid).addClass('unread')
  })
})


