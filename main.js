// Handlebars helpers

Handlebars.registerHelper('paragraphSplit', function(plaintext) {
  var i, output = '',
      lines = plaintext.split(/\r\n|\r|\n/g);
  for (i = 0; i < lines.length; i++) {
      if(lines[i]) {
          output += '<p>' + lines[i] + '</p>';
      }
  }
  return new Handlebars.SafeString(output);
});

$(document).ready(function(){

  // Handlebars templates
  var form_source   = $("#post-form").html();
  var form_template = Handlebars.compile(form_source);
  var chirp_source   = $("#chirp-display").html();
  var chirp_template = Handlebars.compile(chirp_source);
  var login_source   = $("#login-form").html();
  var login_template = Handlebars.compile(login_source);

  // Config vars
  var api_root = 'https://serene-basin-53447.herokuapp.com/'
  // var api_root = 'http://localhost:3000/'


  function auth_token(){
    return sessionStorage.getItem('auth_token')
  }

  function setToken(token){
    sessionStorage.setItem('auth_token', token)
    return sessionStorage.getItem('auth_token')
  }

  function logOut(){
    sessionStorage.removeItem('auth_token')
  }

  function loggedIn() {
    if(auth_token()){
      return true
    } else {
      return false
    }
  }

  function adjustNav() {
    if(loggedIn()){
      $('#new-post').show()
      $('#signout').show()
      $('#signup').hide()
      $('#signin').hide()
    } else {
      $('#new-post').hide()
      $('#signout').hide()
      $('#signup').show()
      $('#signin').show()
    }
  }

  function fetchChirps() {
    $.getJSON(api_root + "posts", {auth_token: auth_token()}).success(function(data){
      console.log(data)
      if(data.posts.length === 0){
          $('#stuff').html("<h1>No chirps yet. Why not post one?</h1>")
      } else {
        $.each(data.posts, function(i, chirp){
          $('#stuff').append(chirp_template(chirp))
        })
      }
    })
  }

  function ChirpFormData() {
    form = document.getElementById('chirp-form')
    console.log(form)
    var data = new FormData(form)
    console.log(data)
    // data.append('body', $('#chirp-body').val())
    // data.append('photo', $('#chirp-photo').val())
    data.append('auth_token', auth_token())
    console.log(data)
    console.log(data.entries())
    return data
  }

  function postChirpForm() {
    $.post({
        url: api_root + "posts",
        processData: false,
        contentType: false,
        // data: {auth_token: auth_token(),  body: $('#chirp-body').val(), photo: $('#chirp-photo').val()},
        data: ChirpFormData(),
        success: function(data){
                  console.log(data)
                  $('#stuff').prepend(chirp_template(data.post))
                  $('#myModal').modal('hide')
                },
        error: function(data){
                  console.log(data)
                }
    })
  }

  function postLoginForm() {
    $.post({
        url: api_root + "signin",
        data: {username: $('#user-email').val(), password: $('#user-password').val()},
        success: function(data){
                  console.log(data)
                  setToken(data.user.auth_token)
                  adjustNav()
                  $('#stuff').html('')
                  fetchChirps()
                  $('#myModal').modal('hide')
                },
        error: function(data){
                  console.log(data)
                }
    })
  }

  function populateModal(template, context, title) {
    $('#myModal .modal-title').text(title || "Our title")
    $('#myModal .modal-body').html(template(context || {}))
  }

  adjustNav()
  fetchChirps()

  // Event Handlers
  $('#new-post').on('click', function(ev){
    populateModal(form_template, '', "New chirp!")
    $('#myModal').modal('show')
  })

  $('#signin').on('click', function(ev){
    populateModal(login_template, '', "Log in")
    $('#myModal').modal('show')
  })

  $('#signout').on('click', function(ev){
    logOut()
    adjustNav()
    $('#stuff').html('')
    fetchChirps()
  })

  $(document.body).on('submit', '#chirp-form', function(ev){
    ev.preventDefault()
    postChirpForm()
  })

  $(document.body).on('submit', '#login-user-form', function(ev){
    ev.preventDefault()
    postLoginForm()
  })

})
