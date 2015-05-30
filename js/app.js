var appId = 'pimejb32ayn6tbat7aa3w2j01mwmsmdqwwhb5in5hv14jw9x'
var rt;
var clientId;
var room;
var roomId;
var userId;
AV.initialize("pimejb32ayn6tbat7aa3w2j01mwmsmdqwwhb5in5hv14jw9x", "jeb9bgsohsh55th6qyi0ngnbqhpjzc39bj68xhwo32dwi2r6");


$(function() {
  var html = $('#sign').html()

  layer.open({
      type: 1,
      skin: 'layui-layer-demo',
      closeBtn: false,
      area: '350px',
      shift: 2,
      shadeClose: true,
      content: html,
      // content: '<div style="padding:20px;">即传入skin:"样式名"，然后你就可以为所欲为了。<br>你怎么样给她整容都行<br><br><br>我是华丽的酱油==。</div>'
      success: function(layero, index){
        this.content='00'
        $('#in').on('click', function() {
          $('#sign .ai').hide()
        })
        $('#up').on('click', function() {
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
          layer.close(index);
          return false;
        })
      }
  });


})


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
        console.log(roomId);
        if (roomId) {
          rt.room(roomId, function(obj) {
            room = obj
            console.log(room);
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

var $msgs = $('#msgs')
var $msg = $('#msg')
function scroll () {
  $msgs.scrollTop($msgs[0].scrollHeight)
}

function dealRoom (room) {
  room.log(function(rs) {
    rs.forEach(function(item) {
      $msgs.append('<li><b>'+item.from+'</b>: '+item.data+'</li>')
    })
    console.log(rs);
    scroll()
  })
  room.receive(function(data) {
    // console.log(data);fromPeerId
    $msgs.append('<li><b>'+data.fromPeerId+'</b>: '+data.msg+'</li>')
    scroll()
  })
}

// $('#send').click(function() {
//    var txt = $msg.val()
//   $msgs.append('<li><b>'+clientId+'</b>: '+txt+'</li>')
//   room.send(txt)
// })

$msg.on('submit', function() {
  var txt = this.msg.value
  $msgs.append('<li><b>'+clientId+'</b>: '+txt+'</li>')
  room.send(txt)
  this.msg.value = ''
  scroll()
  return false;
})
