$(function () {

  $('.layui-form').on('submit', function (e) {
    e.preventDefault()
    var fd = new FormData($(this)[0])
    addProduct(fd)
  })
  //添加产品图片
  function addProduct(fd) {
    $.ajax({
      method: 'POST',
      url: '/my/upload/products',
      data: fd,
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) return layui.layer.msg(res.message)
        layer.open({
          type: 1,
          title: ['文本', 'font-size:18px;'],
          skin: 'layui-layer-molv',
          content: '上传产品成功，请选择继续上传或返回产品列表',
          area: ['400px', '250px'],
          btn: ['继续添加', '返回列表']
          , yes: function (index, layero) {
            //按钮【按钮一】的回调
            layui.form.val('form-product', {
              "title": ""
              , "file": ""
            });
            $('#container').children().eq(-1).remove()
            $('#container').append(`<img class="layui-upload-img" id="preview">`)
            //表单取值
            layer.close(index);
          }
          , btn2: function (index, layero) {
            //按钮【按钮二】的回调
            //return false 开启该代码可禁止点击该按钮关闭
            // $('#container').children().eq(-1).remove()
            // $('#container').append(`<img class="layui-upload-img" id="preview">`)
            // $('#reset').click()
            location.href = './pdt_list.html'
          }
          , btnAlign: 'c',
          shade: [0.8, '#393D49']
        });
        // location.href = './art_list.html'
        // window.parent.articleListClick()
      }

    })
  }

})