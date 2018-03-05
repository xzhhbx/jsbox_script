FILE = "password.js"

if ($file.exists(FILE)) {
  let pass = $file.read(FILE).string
  $input.text({
    type: $kbType.number,
    placeholder: "请输入密码",
    text: "",
    handler: function (text) {
      if ($text.MD5(text) == pass) {
        $app.openURL("wechat://")
      } else {
        $ui.alert({
          title: "哎哟",
          message: "谁让你偷看我手机",
        })
      }
    }
  })
} else {
  $input.text({
    type: $kbType.number,
    placeholder: "首次进入,请设置密码",
    handler: function (text) {
      $file.write({
        data: $data({"string": $text.MD5(text)}),
        path: FILE
      })
    }
  })
}
