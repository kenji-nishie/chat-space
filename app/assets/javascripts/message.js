$(function(){
  function buildHTML(message){
    var html = `<div class="message" data-id=${message.id} data-group-id = ${message.group_id}>
                  <div class="upper-message">
                    <div class="upper-message__user-name">
                    ${message.user_name}
                    </div>
                    <div class="upper-message__date">
                    ${message.created_at}
                    </div>
                  </div>
                  <div class="lower-message">
                    <p class="lower-message__content">
                    ${message.content}
                    </p>
                  </div>
                </div>`
    html = message.image.url== null?
      $(html).append(`<div></div>`) : $(html).append(`<img class="chat__bottom__message__image" src="${message.image.url}" width="250" height="250">`)
    return html;
  }

  $("#new_message").on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action');
    $(".chat__footer__submit").removeAttr("data-disable-with");
    $.ajax({
      type: 'POST',
      url: url,
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      var html = buildHTML(data)
      $('.messages').append(html);
      $(new_message)[0].reset();
      $(".form__submit").prop('disabled', false);
      $('.messages').animate({scrollTop: $('.messages')[0].scrollHeight}, 'fast');
    })
    .fail(function(){
      alert("エラーが発生しました")
    })
  });
  var reloadMessages = function() {
    //カスタムデータ属性を利用し、ブラウザに表示されている最新メッセージのidを取得
    var last_message_id = $(".message").last().data("id");
    var last_message_group = $(".message").last().data("group-id");
    var data = {id: last_message_id}
    url = `/groups/${last_message_group}/api/messages`;
  
    $.ajax({
      //ルーティングで設定した通りのURLを指定
      url: url,
      //ルーティングで設定した通りhttpメソッドをgetに指定
      type: 'get',
      dataType: 'json',
      //dataオプションでリクエストに値を含める
      data: data
    })
    .done(function(messages) {
       //追加するHTMLの入れ物を作る
      var insertHTML = '';
       //配列messagesの中身一つ一つを取り出し、HTMLに変換したものを入れ物に足し合わせる
      messages.forEach(function(message){
        if(message.id > last_message_id && message.group_id == last_message_group){
          insertHTML = buildHTML(message); //メッセージが入ったHTMLを取得
        }
        $('.messages').append(insertHTML);
      });
    })
    .fail(function() {
      alert('error');
    });
  };
  var reg = location.href.match(/\/groups\/\d+\/messages/)
  if(reg !== null){
    setInterval(reloadMessages, 3000);
  }
});