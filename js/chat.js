
$(function() {
  var $send = $('#send')
  var $name = $('#name')
  var $msg = $('#msg')
  var $messages = $('#messages')
  var $users = $('#users')
  var to;

  var socket = io.connect('ws://ailis.aliapp.com');
  socket.on('news', function (data) {
    document.getElementById('time').innerHTML=data;
  });
  socket.on('online', function(data) {
    $users.empty()
    data.forEach(function(item) {
      $users.append('<li>'+item+'</li>')
    })
    $users.find('li').on('click', function() {
      $users.find('.active').removeClass('active')
      $(this).addClass('active')
      $msg.focus()
      to = this.innerHTML
    })
  })
  

  $name.on('blur', function() {
    socket.emit('online', {name: this.value})
  })

  $send.on('submit', function() {
    var data = {txt: $msg.val(), to: to, from: $name.val()}
    socket.emit('say', data)
    add_message(data)
    $msg.val('')
    return false;
  })

  socket.on('say', function(data) {
    $messages.append('<li><b>'+data.from+':</b> '+data.txt+'</li>')
  })

  function add_message (obj) {
    $messages.append('<li><b>'+obj.from+':</b> '+obj.txt+'</li>')
  }

  $('#connect').on('click', function() {
    socket.emit('online', {name: $name.val()})
  })

})

