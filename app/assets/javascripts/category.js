$(function(){
  $(function(){
    function appendOption(category){
      let html = `<option value="${category.id}" data-category="${category.id}">${category.name}</option>`;
      return html;
    }
    // 子カテゴリーを表示させる。
    function appendChildrenBox(insertHTML){
      let childSelectHtml = '';

      childSelectHtml = `<div class="item-detail__inner__box" id= "child_category_box_id">
                          <div class="item-detail__inner__box__select">
                            <select class="item-detail__inner__box--select" id="child_category_id" name="item[category_id]">
                              <option value="---" data-category="---">---</option>
                              ${insertHTML}
                            </select>
                          </div>
                        </div>`;

      $('.item-detail__inner_category').append(childSelectHtml);
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
      let parent_category_id = document.getElementById
      ('parent_category').value; 
      if (parent_category_id != "---"){ 
        $.ajax({
          url: '/items/category/get_category_children',
          type: 'GET',
          data: { parent_id: parent_category_id },
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
        .fail(function(){
          $("#child_category_box_id").remove();
          $("#grandchild_category_box_id").remove(); 
          alert('カテゴリーを選択してください');
        })
      }else{
        $("#child_category_box_id").remove(); 
        $("#grandchild_category_box_id").remove();
      }
    });
    $('.content-sale__main__box__form').on('change', '#child_category_id', function(){
      let child_category_id = document.getElementById('child_category_id').value; 
      // データが取得できていないからチェック#child_category option:selected

      if (child_category_id != "---"){ 
        $.ajax({
          url: '/items/category/get_category_grandchildren',
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