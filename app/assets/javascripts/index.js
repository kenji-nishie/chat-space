$(function(){
  function BuildName(user){
    var html = ` <div class="chat-group-user clearfix search-user">
                  <p class="chat-group-user__name">${user.name}</p>
                  <div class="user-search-add chat-group-user__btn chat-group-user__btn--add" data-user-id="${user.id}" data-user-name="${user.name}">追加</div>
                </div>
              `
    return html;
  };
  function AddMember(id,name){
    var html2 = `<div class='chat-group-user clearfix js-chat-member' id='chat-group-user-8'>
                  <input class='member_id' name='group[user_ids][]' type='hidden' value='${id}'>
                  <p class='chat-group-user__name'>${name}</p>
                  <div class='user-search-remove chat-group-user__btn chat-group-user__btn--remove js-remove-btn'>削除</div>
                </div>
                `
    return html2;
  };

  $('#user-search-field').on('keyup', function(){
    var input = $('#user-search-field').val();
    var preInput;
    $.ajax({
      url: "/users",
      type: 'GET',
      data: {keyword: input},
      dataType: 'json'
    })
    .done(function(users){
      $(".search-user").remove();
      if (input != preInput && input != ""){
        users.forEach(function(user){
          var html = BuildName(user);
          $('#user-search-result').append(html);
        });
      }
      preInput = input;

    })
    .fail(function(){
      alert("ユーザー検索に失敗しました")
    });
  });
  var user_ids = [];
  $(document).on("click",".user-search-add",function(){
    var memberName = $(this).data('user-name');
    var memberId = $(this).data('user-id');
    html2 = AddMember(memberId,memberName);
    $('#chat-group-users').append(html2);
    user_ids.push(memberId);
    $(this).parent().remove();
  });
  $(document).on("click",".user-search-remove",function(){
    var memberId = $('.member_id').val();
    var index = user_ids.indexOf(memberId);
    user_ids.splice(index, 1);
    $(this).parent().remove();
  });
});