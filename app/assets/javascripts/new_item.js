$(function(){ //rubyでいうdefからend functionで{}で囲った間の処理を行うという宣言、発火の後に書かれていたら発火した後に動くアクションがfunctionの後に書かれている。

  // 画像用のinputを生成する関数
  const buildFileField = (num)=> { //buildFileFieldはメソッド名、(num)は引数、=> {で、${}の中で引数を参照出来る様にしている。（num）はfileIndex = [1,2,3,4,5,6,7,8,9,10]から取り出された数字。
    const html = `<div data-index="${num}" class="js-file_group">
                    <input class="js-file" type="file"
                    name="item[item_imgs_attributes][${num}][image]"
                    id="item_imgs_attributes_${num}_image"><br>
                    <div class="js-remove">削除</div>
                  </div>`;
    return html;  //5~11行目の説明、html変数にHTMLのDOM要素を生成している。returnで終わらせる。さらにreturnで呼び出し元に（呼び出し元＝buildFileField、例えば４０行目）htmlという変数をに返す。returnには２つ意味がありreturnの横に記述してある変数がに対して戻り値を返す。
  }
  // プレビュー用のimgタグを生成する関数
  const buildImg = (index, url)=> {  //buildFileFieldはメソッド名、(index,url)は引数、=> {で、${}の中で引数を参照出来る様にしている。
    const html = `<img data-index="${index}" src="${url}" width="100px" height="100px">`;
    return html; //11行目に同じ
  }

 
  // file_fieldのnameに動的なindexをつける為の配列
  let fileIndex = [1,2,3,4,5,6,7,8,9,10]; //ここでいうindexはカスタムデータにつける番号
  // 既に使われているindexを除外
  lastIndex = $('.js-file_group:last').data('index');// data('index')は5行目の<div data-index="${num}" class="js-file_group"> の${num}を指している。.js-file_groupは画像を選択する度に増える、その最後を$('.js-file_group:last')の記述で表示されている画像の最後のindexを取得してくる。
  fileIndex.splice(0, lastIndex);//spliceメソッドで[1,2,3,4,5,6,7,8,9,10]の中、21行目をどんどん更新して行く記述、(0, lastIndex)０に１が入って（０は${num}、数字を渡す）lastIndexで[1,2,3,4,5,6,7,8,9,10]の配列で用意している１０の後ろに入れ替わりで数字を追加するループ

  $('.hidden-destroy').hide();//display:noneと同様の役割、'.hidden-destroy'のclassを消している。この場所に記述すると発火にかかわらず動作している。

  $('#image-box').on('change', '.js-file', function(e) { //JSが作用する前の'#image-box'には'.js-file'は無い、JSで用意している上の記述（HTML)の中の.js-fileが変わる度に発火させるにはこの様に書く。
    const targetIndex = $(this).parent().data('index');//(this)発火元は.js-file、.parent()で発火元の親要素を指定している、.data('index')でその指定された親要素のindexを取得してくる。
    // ファイルのブラウザ上でのURLを取得する
    const file = e.target.files[0];//ここのeは(e)つまりイベント自体なので新しく選択した画像を指している。その中の起こったイベントの中の対象がtarget（thisみたいなもの）（画像を選択した）、今回のイベントはファイルを選択するイベントなのでfiles[0]が選択したイベントの画像自体３段構造この全てを引き連れて変数に代入している。
    const blobUrl = window.URL.createObjectURL(file);//window=wrapperみたいなもの、JSの全ての親要素と考えて良い。(file)はまだhtmlで表示出来る状態では無い。URL.createObjectURLのメソッドでhtmlで表示出来る様に翻訳をしている。blobUrlは一般的に画像を表示できる様にする記述の変数名として使われる。

    // 該当indexを持つimgがあれば取得して変数imgに入れる(画像変更の処理)
    if (img = $(`img[data-index="${targetIndex}"]`)[0]) {//既存の画像を変更するとき、アクセプトアトリビュートネステッドフォーにデータを送るためにはこの様な形で記述しなければならない、[data-index=でカスタムデータを付与している。
      img.setAttribute('src', blobUrl);//imgはsrc属性を持っていないため、setAttributeでsrc属性を付与している、('src', blobUrl)でキーとバリューの様な関係性になっていて、blobUrlを表示させる事ができる様になる。
    } else {  // 新規画像追加の処理
      $('#previews').append(buildImg(targetIndex, blobUrl));//画像を追加するとき、
      // fileIndexの先頭の数字を使ってinputを作る
      $('#image-box').append(buildFileField(fileIndex[0])); //4~11行目の処理が実行される&
      fileIndex.shift();//24の記述の配列の中の最初の要素を入れ替えるために.shiftで最初の要素を取り除いている。21行目と24行目と繋がっている記述。
      // 末尾の数に1足した数を追加する
      fileIndex.push(fileIndex[fileIndex.length - 1] + 1);//fileIndex[fileIndex.length - 1]が最後の要素である10を指している、つまり[1,2,3,4,5,6,7,8,9,10]の最後の10に＋１をして１１にしている。.pushでfileIndexに１１を追加している。21行目と24行目と繋がっている記述。
    }
  });

  $('#image-box').on('click', '.js-remove', function() {//new.html.hamlの38行目であるが、この場合はnew_items.jsの9行目が発火元。
    const targetIndex = $(this).parent().data('index');//new.html.hamlの34行目であるが、この場合はnew_items.jsの5行目のindexのidを取得している。
    // 該当indexを振られているチェックボックスを取得する
    const hiddenCheck = $(`input[data-index="${targetIndex}"].hidden-destroy`);//inputタグの中のdata-indexの番号が${targetIndex}、48行目で取得してきたindexのid番号[0]とかだよ。.hidden-destroyはedit.html.hamlの42行目で命名している。この(`input[data-index="${targetIndex}"].hidden-destroy`)はedit.html.hamlの42行目の= image.check_boxである。
    // もしチェックボックスが存在すればチェックを入れる
    if (hiddenCheck) hiddenCheck.prop('checked', true);//if (hiddenCheck)は削除のボタンのこと（ボタンにはなってないけどね）で、その削除があれば！がifの条件分岐である。それをチェック（クリック）すると.propで属性を変化させる。('checked', true)でチェックしたという属性に変化させる。

    $(this).parent().remove();//.js-removeの親要素を指定して、その親要素ごと削除する。親要素は、new.html.hamlの34行目の.js-file_group。
    $(`img[data-index="${targetIndex}"]`).remove();//表示されている画像自体を削除している。edit.html.hamlの33行目でアール。

    // 画像入力欄が0個にならないようにしておく
    if ($('.js-file').length == 0) $('#image-box').append(buildFileField(fileIndex[0]));//初期値の（ファイルを選択）の状態で削除をクリックしても（ファイルを選択）の表示がなくならない様にしている。($('.js-file').length == 0)で0になった場合の条件分岐。１０個用意しているfileIndex = [1,2,3,4,5,6,7,8,9,10]は付け足す画像の数に応じて一番若い数字を付け足して行く。今回は１つになってしまうので一番若い数字として[0]を渡す必要がある。
  });
});