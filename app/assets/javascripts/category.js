$(function(){
  $(function(){
    function appendOption(category){ //appendOptionの命名はなんでも良い。defのインスタンスメソッドの命名と同様。(category)の時はまだカテゴリーIDのデータしか無い状態なので、15行目にカテゴリーを表示させられるデータの形としていれるために、一度3~5行目でElementと同じ形にする必要がある。（検証ツールでカテゴリーを見てみよう！）
      let html = `<option value="${category.id}" data-category="${category.id}">${category.name}</option>`;
      return html;//戻り値、これはrubyには必要ない、Jsは明示的にリータン場所を書かなければ、ここで処理が終わってしまう。htmlが仕上がった変数、それを持ってreturnで直前の作業していたappendOptionに戻り、続きの処理が実行される。
    }
    // 子カテゴリーを表示させる。
    function appendChildrenBox(insertHTML){// 3~5行目の記述によって15行目に表示出来るElementとして挿入する事ができる！
      let childSelectHtml = '';//下の11~18行目で用意しているElememtsをHTMLに移動させるために、箱にいれる必要がある。'  'の箱にいれるイメージ。

      childSelectHtml = `<div class="item-detail__inner__box" id= "child_category_box_id">
                          <div class="item-detail__inner__box__select">
                            <select class="item-detail__inner__box--select" id="child_category_id" name="item[category_id]">
                              <option value="---" data-category="---">---</option>
                              ${insertHTML}
                            </select>
                          </div>
                        </div>`;

      $('.item-detail__inner_category').append(childSelectHtml);//.item-detail__inner_categoryのclassに11〜１８行目の完成したElementを追加する。完了
    }
    // 孫カテゴリーを表示させる。
    function appendGrandchildrenBox(insertHTML){
      let grandchildSelectHtml = '';

      grandchildSelectHtml =`<div class="item-detail__inner__box" id= "grandchild_category_box_id">
                                <div class="item-detail__inner__box__select">
                                  <select class="item-detail__inner__box__select" id="grandchild_category" name="item[category_id]">
                                    <option value="---" data-category="---">---</option>
                                    ${insertHTML}
                                  </select>
                                </div>
                              </div>`;

      $('.item-detail__inner_category').append(grandchildSelectHtml);
    }
    
    // 親カテゴリーを選択した後にイベント発火させる。
    $('#parent_category').on('change', function(){
      // 選択された親カテゴリーのidを取得
      let parent_category_id = document.getElementById('parent_category').value; //documentはページ全体を指している。.getElementByIdで、その沢山ある中から('parent_category')を取得してきている。その('parent_category')から.value;を取得してきている。
      if (parent_category_id != "---"){ 
        $.ajax({
          url: '/items/category/get_category_children',
          type: 'GET',
          data: { parent_id: parent_category_id },//例えばレディースだった場合は、parent_id:（レディースのID）になって'/items/category/get_category_children'のコントローラーに送られる。
          dataType: 'json'
        })
        .done(function(children){         
          // 親カテゴリー削除された時、子・孫カテゴリーを削除する。

          $("#child_category_box_id").remove(); 
          $("#grandchild_category_box_id").remove();
          let insertHTML = '';
          children.forEach(function(child){
            insertHTML += appendOption(child);
          });
          appendChildrenBox(insertHTML);
        })
        // エラー警告
        .fail(function(){//.failは間違った情報になった時、通信が走らなかった時、バリデーションに引っ掛かった時など
          $("#child_category_box_id").remove();
          $("#grandchild_category_box_id").remove(); 
          alert('カテゴリーを選択してください'); //alertはjsのメソッド（'')の中に任意の文字列を用意する事ができる。
        })
      }else{
        $("#child_category_box_id").remove(); //ajaxから外れた所にあるので、ajaxが走らなかった時のためでは無いか？サーバーとやりとりが出来なかった時、後で消してみる
        $("#grandchild_category_box_id").remove();//ajaxが走らなかったということは、jsがサーバーと通信できなかったということだよ！
      }
    });
    $('.content-sale__main__box__form').on('change', '#child_category_id', function(){//今度は孫カテゴリーに対しての発火
      let child_category_id = document.getElementById('child_category_id').value; 
      // データが取得できていないからチェック#child_category option:selected

      if (child_category_id != "---"){ 
        $.ajax({
          url: '/items/category/get_category_grandchildren',//今度はcategory_grandchildrenのコントローラー
          type: 'GET',
          data: { child_id: child_category_id },
          dataType: 'json'
        })
      
        .done(function(grandchildren){

          if (grandchildren.length != 0) {
            // 子カテゴリーが変更された時、孫カテゴリーを削除する。
            $("#grandchild_category_box_id").remove(); 
            let insertHTML = '';
            grandchildren.forEach(function(grandchild){
              insertHTML += appendOption(grandchild);
            });
            appendGrandchildrenBox(insertHTML);
          }
        })
        // エラー警告
        .fail(function(){
          $("#grandchild_category_box_id").remove(); 
          alert('カテゴリーを選択してください');
        })
      }else{
        $("#grandchild_category_box_id").remove(); 
      }
    });
  });
});