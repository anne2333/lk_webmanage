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
    aspectRatio: 420 / 260,
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
    $('#coverleft').removeClass('hide')
    $('#imgpreview').removeClass('hide')
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
    try {
      $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
          width: 420,
          height: 260
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
    } catch (error) {
      layui.layer.msg("请选择封面")
    }

  })

  //删除content中上传后未使用的图片
  function deleteContentImg(fd) {
    var html = fd.get('content')
    var qs = ''
    for (i = 0; i < list.length; i++) {
      if (html.indexOf(list[i]) < 0)
        qs += list[i] + '|'
    }

    if (qs !== '') {
      var query = {
        list: qs
      }
      $.ajax({
        method: 'POST',
        url: '/my/upload/image/delete',
        data: query,
        success: function (res) {

        }

      })
    }
  }
  //发布文章
  function publishArticle(fd) {
    deleteContentImg(fd)
    $.ajax({
      method: 'POST',
      url: '/my/article/add',
      data: fd,
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) return layui.layer.msg(res.message)
        layui.layer.msg('发布文章成功')
        location.href = './art_list.html'
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
        $image
          .cropper('destroy')      // 销毁旧的裁剪区域
          .attr('src', _URL + res.data[0].cover_img)  // 重新设置图片路径
          .cropper(options)        // 重新初始化裁剪区域

        $('#coverleft').removeClass('hide')
        $('#imgpreview').removeClass('hide')

        var content = res.data[0].content

        let imgReg = /<img.*?(?:>|\/>)/gi //匹配图片中的img标签
        let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i // 匹配图片中的src
        let arr = content.match(imgReg)  //筛选出所有的img
        if (arr) {
          for (let i = 0; i < arr.length; i++) {
            let src = arr[i].match(srcReg)
            // 获取图片地址
            list.push(src[1].split('/uploads/articles/content/')[1])
          }
        }
      }
    })
  }

  //更新文章
  function updateArticle(fd) {
    deleteContentImg(fd)
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