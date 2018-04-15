async function decodeScheme(url, cb) {
  let method, password, hostname, port, plugin, tag

  let getServerName = function () {
    return new Promise((resolve, reject) => {
      $input.text({
        type: $kbType.default,
        placeholder: "检测到节点无名称，请先设置",
        text: "",
        handler: function (text) {
          resolve(text)
        }
      })
    })
  }

  if (!url.includes('#')) {
    let name = await getServerName()
    url += `#${name}`
  }

  console.log(url)

  tag = $text.URLDecode(url.match(/#(.*?)$/)[1])
  if (url.includes('?')) {
    // tag = $text.URLDecode(url.match(/#(.*?)$/)[1])
    let mdps = url.match(/ss:\/\/(.*?)@/)[1]
    let padding = 4 - mdps.length % 4
    if (padding < 4) {
      mdps += Array(padding + 1).join('=')
    }
    let userinfo = $text.base64Decode(mdps)
    method = userinfo.split(':')[0]
    password = userinfo.split(':')[1]
    let htpr = url.match(/@(.*?)\?/)[1].replace('\/', '')
    hostname = htpr.split(':')[0]
    port = htpr.split(':')[1]
    let ps = $text.URLDecode(url.match(/\?(.*?)#/)[1])
    let obfs = ps.match(/obfs=(.*?);/)[1]
    let obfsHost = ps.match(/obfs-host=(.*?)$/)[1]
    plugin = `obfs=${obfs}, obfs-host=${obfsHost}`
  } else {
    let mdps = url.match(/ss:\/\/(.*?)#/)[1]
    let padding = 4 - mdps.length % 4
    if (padding < 4) {
      mdps += Array(padding + 1).join('=')
    }
    [method, password, hostname, port] = $text.base64Decode(mdps).split(/[:,@]/)
  }
  let proxy = `${tag} = custom, ${hostname}, ${port}, ${method}, ${password}, http://omgib13x8.bkt.clouddn.com/SSEncrypt.module`
  if (plugin != undefined) {
    proxy += `, ${plugin}`
  }
  // return `${proxy}`
  cb(proxy)
}

function getServersFromConfFile(fileURL) {
  new Promise((resolve, reject) => {
    $http.get({
      url: fileURL,
      handler: function (resp) {
        let data = resp.data
        let servers = data.match(/\[Proxy\]\n([\s\S]*?)\n\[Proxy Group\]/)
        if (servers != null) {
          resolve(servers[1])
        } else {
          reject()
        }
      }
    })
  }).then(res => {
    let servers = res.split(/[\n]+/).filter(item => item != '')
    let nd = $("serverEditor").data.concat(servers)
    $("serverEditor").data = nd
  }).catch(reason => {
    $ui.alert('无法解析托管')
  })
}

function renderUI() {
  $ui.render({
    props: {
      title: "SurgeConfig"
    },
    views: [{
      type: "view",
      props: {
        id: "mainView"
      },
      layout: $layout.fill,
      views: [{
        type: "input",
        props: {
          id: "fileName",
          text: $cache.get("fileName") || '',
          placeholder: "文件名，不用写后缀"
        },
        layout: (make, view) => {
          make.width.equalTo(view.super).offset(-20)
          make.centerX.equalTo(view.super)
          make.height.equalTo(40)
          make.top.equalTo(10)
        },
        events: {
          returned: sender => {
            $cache.set("fileName", $('fileName').text)
            $("fileName").blur()
          }
        }
      },{
        type: "input",
        props: {
          id: "rulesURL",
          text: $cache.get("rulesURL").trim() || '',
          placeholder: "规则地址"
        },
        layout: (make, view) => {
          make.width.equalTo(view.super).offset(-20)
          make.centerX.equalTo(view.super)
          make.height.equalTo(40)
          make.top.equalTo($("fileName").bottom).offset(10)
        },
        events: {
          returned: sender => {
            $cache.set("rulesURL", $("rulesURL").text)
            $("rulesURL").blur()
          }
        }
      }, {
        type: "button",
        props: {
          id: "serverURL",
          title: "导入节点"
        },
        layout: (make, view) => {
          make.width.equalTo(view.super).offset(-20)
          make.centerX.equalTo(view.super)
          make.height.equalTo(40)
          make.top.equalTo($("rulesURL").bottom).offset(10)
        },
        events: {
          tapped: sender => {
            $ui.menu({
              items: ['剪贴板导入', '二维码导入'],
              handler: function (title, idx) {
                if (idx == 0) {
                  let url = $clipboard.text
                  if (url.startsWith('http')) {
                    getServersFromConfFile(url)
                  } else {
                    decodeScheme(url, proxy => {
                      console.log(proxy)
                      let nd = $("serverEditor").data.slice()
                      nd.push(proxy)
                      $("serverEditor").data = nd
                    })
                  }
                } else {
                  $qrcode.scan({
                    handler(string) {
                      decodeScheme(string, proxy => {
                        let nd = $("serverEditor").data.slice()
                        nd.push(proxy)
                        $("serverEditor").data = nd
                      })
                    }
                  })
                }
              }
            })
          }
        }
      }]
    }, {
      type: "list",
      props: {
        id: "serverEditor",
        data: [],
        actions: [{
          title: "delete"
        }]
      },
      layout: (make, view) => {
        make.width.equalTo(view.super).offset(-20)
        make.centerX.equalTo(view.super)
        make.height.equalTo(200)
        make.top.equalTo($("serverURL").bottom).offset(10)
      },
      events: {

      }
    }, {
      type: "switch",
      props: {
        id: "ignoreReject",
        on: $cache.get('ignoreReject') || false
      },
      layout: (make, view) => {
        make.width.equalTo(40)
        make.height.equalTo(40)
        make.top.equalTo($("serverEditor").bottom).offset(10)
        make.right.equalTo(-20)
      },
      events: {
        changed: sender => {
          $cache.set("ignoreReject", $("ignoreReject").on)
        }
      }
    }, {
      type: "label",
      props: {
        text: "忽略Reject规则",
      },
      layout: (make, view) => {
        make.width.equalTo(250)
        make.height.equalTo(40)
        make.left.equalTo(10)
        make.top.equalTo($("serverEditor").bottom).offset(6)
      }
    }, {
      type: "button",
      props: {
        id: "genBtn",
        title: "生成"
      },
      layout: (make, view) => {
        make.width.equalTo(view.super).offset(-20)
        make.centerX.equalTo(view.super)
        make.height.equalTo(40)
        make.top.equalTo($("ignoreReject").bottom).offset(10)
      },
      events: {
        tapped: sender => {
          let rulesURL = $("rulesURL").text
          let fileName = $("fileName").text
          if (rulesURL.startsWith('http') && fileName != '') {
            $http.get({
              url: rulesURL,
              handler: function (resp) {
                let data = resp.data
                let serversData = $("serverEditor").data
                let serverNames = serversData.map(item => item.split('=')[0])
                let newConfig = null
                // 判断是否有Proxy节点
                if (/\[Proxy\]\n[\s\S]*?\n\[Proxy Group\]/.test(data)) {
                  newConfig = data.replace(/\[Proxy\]\n[\s\S]*?\n\[Proxy Group\]/, `[Proxy]\n${serversData.join('\n')}\n\n[Proxy Group]`)
                } else {
                  newConfig = data + `\n\n[Proxy]\n${serversData.join('\n')}\n` 
                }
                // 判断是否有ProxyGroup节点
                if (/\[Proxy Group\]([\s\S]*?)\[/.test(newConfig)){
                  let proxyGroup = newConfig.match(/\[Proxy Group\]([\s\S]*?)\[/)[1].split(/[\t\n]/).filter(item => item != '')
                  let newGroup = []
                  for (let i in proxyGroup) {
                    let groupName = proxyGroup[i].split('=')[0]
                    newGroup.push(`${groupName} = select, DIRECT, ${serverNames.join(',')}`)
                  }
                  newConfig = newConfig.replace(/\[Proxy Group\][\s\S]*?\[/, `[Proxy Group]\n${newGroup.join('\n')}\n\n[`)
                } else {
                  let proxyGroup = `Proxy = select, ${serverNames.join(',')}`
                  newConfig = newConfig + `[Proxy Group]\n${proxyGroup}\n\n`
                }
                if ($("ignoreReject").on) {
                  let rules = newConfig.match(/\[Rule\]([\s\S]*?)\[/)[1].split(/[\t\n]/).filter(item => !/REJECT/.test(item))
                  newConfig = newConfig.replace(/\[Rule\][\s\S]*?\[/, `[Rule]\n${rules.join('\n')}\n\n[`)
                }
                console.log('haha')
                $share.sheet([`${$("fileName").text}.conf`, $data({"string": newConfig})])
              }
            })
          } else {
            $ui.alert("请检查文件名是否填入，规则地址是否正确")
          }
        }
      }
    }]
  })
}

module.exports = {
  renderUI: renderUI
}