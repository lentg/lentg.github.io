var appId = 'pimejb32ayn6tbat7aa3w2j01mwmsmdqwwhb5in5hv14jw9x'
var rt;
var clientId;
var room;
var roomId;
var userId;
AV.initialize("pimejb32ayn6tbat7aa3w2j01mwmsmdqwwhb5in5hv14jw9x", "jeb9bgsohsh55th6qyi0ngnbqhpjzc39bj68xhwo32dwi2r6");


$(function() {
  var $msgs = $('#msgs')
  var $msg = $('#msg')
  var $input = $('#input')

  layer.open({
      type: 1,
      title: 'Sign',
      skin: 'layui-layer-demo',
      closeBtn: false,
      area: '350px',
      shift: 2,
      shadeClose: true,
      content: $('#sign').html(),
      success: function(layero, index){
        $('#in').on('click', function() {
          $('#up').removeClass('active')
          $(this).addClass('active')
          $('#sign .ai').hide()
        })
        $('#up').on('click', function() {
          $('#in').removeClass('active')
          $(this).addClass('active')
          $('#sign .ai').show()
        })
        $('#sign form').on('submit', function() {
          var obj = {
            username: this.username.value,
            password: this.password.value,
            email: this.email.value,
            phone: this.phone.value,
            room: ''
          }
          clientId = obj.username
          if (obj.email) {
            signup(obj, function() {
              getRoom(obj.username)
            })
          } else{
            getRoom(obj.username)            
          };
          $input.focus()
          layer.close(index);
          return false;
        })
      }
  });



  function signup (obj, cb) {
    var user = new AV.User();
    user.set('username', obj.username)
    user.set('password', obj.password)
    user.set('email', obj.email)
    user.set('phone', obj.phone)
    user.set('room', obj.room)
    user.signUp(null, {
      success: function(user) {
        userId = user.id
        cb()  
      },
      error: function(user, error) {
        console.log('1.....');
        alert("Error: " + error.code + " " + error.message);
      }
    })
  }


  function getRoom (clientId) {
    rt = AV.realtime({
      appId: appId,
      clientId: clientId,
      encodeHTML: true
    })
    rt.on('open', function() {
      var query = new AV.Query(AV.User);
      query.equalTo('username', clientId)
      query.find({
        success: function(rs) {
          var user = rs[0]
          if (!user) {
            console.log('用户不存在');
            return;
          };
          function buildRoom () {
            rt.room({
              members: ['admin', clientId]
            }, function(obj) {
              room = obj
              user.set('room', room.id)
              user.save()
            })
          }
          roomId = user.get('room')
          if (roomId) {
            rt.room(roomId, function(obj) {
              room = obj
              if (!room) {
                buildRoom()
              };
              dealRoom(room)
            })
          } else{
            buildRoom()
          };
        }
      })
    })
  }

  function scroll () {
    $msgs.scrollTop($msgs[0].scrollHeight)
  }

  function dealRoom (room) {
    room.log(function(rs) {
      $msgs.empty()
      rs.forEach(function(item) {
        if (clientId != item.from) {
          $msgs.append('<li class="from">'+item.data+' :<b>'+item.from+'</b></li>')
        } else {
          $msgs.append('<li><b>'+item.from+'</b>: '+item.data+'</li>')
        }
        // var klass = item.from == 'clientId' ? 'class="to"' : ''
      })
      scroll()
    })
    room.receive(function(data) {
      $msgs.append('<li class="from">'+data.msg+' :<b>'+data.fromPeerId+'</b></li>')
      scroll()
    })
  }

  $msg.on('submit', function() {
    var txt = this.msg.value
    $msgs.append('<li><b>'+clientId+'</b>: '+txt+'</li>')
    room.send(txt)
    $input.val('').focus()
    scroll()
    return false;
  })

})

