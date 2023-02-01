$(function () {

  //定义请求参数
  var q = {
    pagenum: 1,
    pagesize: 5,
    sd: '',
    xl: '',
  }
  initTable()
  //获取文章列表数据
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/product/list',
      data: q,
      success: function (res) {
        if (res.status !== 0) return layui.layer.msg('获取产品列表失败')
        //使用模板引擎渲染数据

        res.data.map(item => {
          return item.image = _URL + item.image
        })
        var htmlStr = template('tpl-table', res)
        $('tbody').empty().html(htmlStr)
        renderPage(res.total)
      }
    })
  }

  //美化时间过滤器
  template.defaults.imports.dateFormat = function (date) {
    const dt = new Date(date)

    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())
    return y + '-' + m + '-' + d + '  ' + hh + ':' + mm + ':' + ss
  }

  function padZero(n) {
    return n > 9 ? n : '0' + n
  }

  //筛序功能
  $('#form-search').on('submit', function (e) {
    e.preventDefault()
    var sd = $('[name=sd]').val()
    var xl = $('[name=xl]').val()
    q.sd = sd
    q.xl = xl
    initTable()
  })

  //渲染分页
  function renderPage(total) {
    //执行一个laypage实例
    layui.laypage.render({
      elem: 'pageBox', //注意，不用加 # 号
      count: total, //数据总数，从服务端得到
      limit: 5,
      curr: q.pagenum,
      layout: ['count', 'prev', 'page', 'next', 'skip'],
      // limits: [2, 3, 5, 10],
      jump: function (obj, first) {
        //obj包含了当前分页的所有参数，比如：
        //obj.curr //得到当前页，以便向服务端请求对应页的数据。
        //obj.limit; //得到每页显示的条数
        q.pagenum = obj.curr
        q.pagesize = obj.limit
        //首次不执行
        if (!first) {
          //do something
          initTable()
        }
      }
    });
  }

  //删除图片
  $('body').on('click', '.btn-delete', function () {
    var count = $('.btn-delete').length
    var id = $(this).attr('data-id')
    layui.layer.confirm('确认删除?', { icon: 3, title: '提示' },
      function (index) {
        //do something
        console.log(id);
        $.ajax({
          method: 'GET',
          url: '/my/product/delete/' + id,
          success: function (res) {
            if (res.status !== 0) return layui.layer.msg('删除产品失败')

            if (count === 1) {
              q.pagenum === 1 ? q.pagenum = 1 : q.pagenum--

            }
            initTable()

          }
        })
        layer.close(index);
      });
  })

  //预览图片
  $('body').on('click', '.btn-edit', function () {
    var image = $(this).attr('data-image')
    var title = $(this).attr('data-title')
    layer.open({
      type: 1,
      area: '500px',
      content: `
       <div class="layui-card">
      <div class="layui-card-header">`+ title + `</div>
      <div class="layui-card-body yl">
        <img  src="`+ image + `"></img>
      </div>
    </div>
      `//这里content是一个普通的String
    });
  })
})