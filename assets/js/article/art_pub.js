$(function () {

  var q = location.search.substring(1)

  if (q && q != '') {
    q = q.split('=')[1]
    editArticle(q)
  }

  //图片裁剪初始化
  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 520 / 680,
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)

  //加载文章分类

  //选择封面按钮
  $('#btn_cover_file').on('click', function () {
    $('#cover_file').click()
  })

  //监听文件选择按钮的change事件，获取选择的元素
  $('#cover_file').on('change', function (e) {
    var files = e.target.files
    if (files.length === 0) return
    var newImgURL = URL.createObjectURL(files[0])
    $image
      .cropper('destroy')      // 销毁旧的裁剪区域
      .attr('src', newImgURL)  // 重新设置图片路径
      .cropper(options)        // 重新初始化裁剪区域
  })

  //提交
  var state = '已发布'
  $('#btnSave2').on('click', function () {
    state = '草稿'
  })

  //监听表单的submit事件
  $('.layui-form').on('submit', function (e) {
    e.preventDefault()
    var fd = new FormData($(this)[0])
    //发布状态
    fd.append('state', state)
    //封面
    $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 520,
        height: 680
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        fd.append('cover_img', blob)
        if (q && q != '') {
          //更新文章
          fd.append('id', q)
          updateArticle(fd)
        }
        else publishArticle(fd)

      })
  })

  //发布文章
  function publishArticle(fd) {
    $.ajax({
      method: 'POST',
      url: '/my/article/add',
      data: fd,
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) return layui.layer.msg(res.message)
        layui.layer.msg('发布文章成功')
        location.href = '/article/art_list.html'
        window.parent.articleListClick()
      }

    })
  }

  //编辑文章,获取文章内容
  function editArticle(id) {
    $.ajax({
      method: 'GET',
      url: '/my/article/' + id,
      success: function (res) {
        layui.form.val('form-article', res.data[0])
      }
    })
  }

  //更新文章
  function updateArticle(fd) {
    $.ajax({
      method: 'POST',
      url: '/my/article/update',
      data: fd,
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) return layui.layer.msg(res.message)
        layui.layer.msg('更新文章成功')
        location.href = '/article/art_list.html'
        window.parent.articleListClick()
      }

    })
  }
})