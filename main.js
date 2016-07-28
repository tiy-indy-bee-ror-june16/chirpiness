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

  // Config vars
  var api_root = 'https://serene-basin-53447.herokuapp.com/'

  function auth_token(){
    sessionStorage.getItem('auth_token')
  }

  function fetchChirps() {
    $.getJSON(api_root + "posts", {auth_token: auth_token()}).success(function(data){
      console.log(data)
      if(data.length === 0){
          $('#stuff').html("<h1>No chirps yet. Why not post one?</h1>")
      } else {
        $.each(data, function(i, chirp){
          $('#stuff').append(chirp_template(chirp))
        })
      }
    })
  }

  function postChirpForm() {
    $.post({
        url: api_root + "posts",
        data: {auth_token: auth_token(),  body: $('#chirp-body').val()},
        success: function(data){
                  console.log(data)
                  $('#stuff').prepend(chirp_template(data))
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

  fetchChirps()

  // Event Handlers
  $('#new-post').on('click', function(ev){
    populateModal(form_template)
    $('#myModal').modal('show')
  })

  $(document.body).on('submit', '#chirp-form', function(ev){
    ev.preventDefault()
    postChirpForm()
  })









})
