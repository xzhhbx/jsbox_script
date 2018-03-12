const FILE = "urls.js"



function save(data) {
    let urls = JSON.stringify(data)
    let success = $file.write({
        data: $data({ string: urls }),
        path: FILE
    })
}

function decode(base64) {
    // Add removed at end '='
    base64 += Array(5 - base64.length % 4).join('=');
    base64 = base64
        .replace(/\-/g, '+') // Convert '-' to '+'
        .replace(/\_/g, '/'); // Convert '_' to '/'
    return $text.base64Decode(base64);
};

function refreshUI() {
    let data = {
        urls: []
    }
    if ($file.exists(FILE)) {
        data = JSON.parse($file.read(FILE).string)
    }

    let ui_data = []

    for (d in data.urls) {
        ui_data.push({
            url: { text: data.urls[d].url },
            name: { text: data.urls[d].name }
        })
    }

    $ui.render({
        props: {
            title: "SS(R)订阅",
        },
        views: [{
            type: "list",
            props: {
                data: ui_data,
                id: "urls_list",
                rowHeight: 60,
                footer: {
                    type: "label",
                    props: {
                        height: 50,
                        text: "添加订阅",
                        align: $align.center,
                        textColor: $color("#3333ee"),
                        font: $font(20)
                    },
                    events: {
                        tapped: sender => {
                            $input.text({
                                placeholder: "订阅名称",
                                handler: title => {
                                    $input.text({
                                        type: $kbType.url,
                                        placeholder: "订阅地址",
                                        text: $clipboard.text,
                                        handler: url => {
                                            let new_data = data
                                            new_data.urls.push({
                                                url: url,
                                                name: title
                                            })
                                            save(new_data)
                                            refreshUI()
                                        }
                                    })
                                }
                            })
                        }
                    }
                },
                actions: [{
                    title: "delete",
                    handler: (sender, indexPath) => {
                        let new_data = data
                        data.urls.splice(indexPath.row, 1)
                        save(new_data)
                        refreshUI()
                    }
                }],
                template: {
                    views: [{
                        type: "label",
                        props: {
                            id: "name",
                            font: $font(20)
                        },
                        layout: (make, view) => {
                            make.width.equalTo(view.super.width)
                            make.top.left.equalTo(view.super).with.offset(5)
                            make.right.equalTo(view.super).with.offset(-5)
                        }
                    }, {
                        type: "label",
                        props: {
                            id: "url",
                            font: $font(15)
                        },
                        layout: (make, view) => {
                            make.top.equalTo(view.prev.bottom)
                            make.bottom.equalTo(view.super).with.offset(-5)
                            make.left.equalTo(view.super).offset(5)
                        }
                    }]
                }
            },
            layout: $layout.fill,
            events: {
                didSelect: (sender, indexPath, data) => {
                    $ui.loading(true)
                    let url = data.url.text
                    $http.get({
                        url: url,
                        handler: function (resp) {
                            $ui.loading(false)
                            let d = resp.data
                            let ssrs = $text.base64Decode(d).split('\n').filter(item => item)
                            let links = []
                            for (i in ssrs) {
                                $console.info(ssrs[i])
                                if (ssrs[i].startsWith("ssr://")) {
                                    let content = ssrs[i].replace(/ssr:\/\//, "")
                                    let content_decode = decode(content)
                                    let remark = content_decode.match(/remarks=(.*?)&/)
                                    links.push({
                                        title: decode(remark[1]),
                                        url: ssrs[i]
                                    })
                                } else if (ssrs[i].startsWith("ss://")) {
                                    let tag = ssrs[i].match(/#(.*?)$/)[1]
                                    links.push({
                                        title: $text.URLDecode(tag),
                                        url: ssrs[i]
                                    })
                                }
                            }
                            if (links.length == 0) {
                                $ui.error("没有检测到SS(R)链接")
                            }
                            let top_menu = links.map(item => item.title)
                            let top_menu_length = top_menu.push("复制所有链接")
                            $ui.menu({
                                items: top_menu,
                                handler: function (title1, idx1) {
                                    if (idx1 == top_menu_length - 1) {
                                        let res = ""
                                        for (var i = 0; i < top_menu_length - 1; i++) {
                                            res += `${links[i].url}\n`
                                        }
                                        $console.info(res)
                                        $clipboard.text = res
                                    } else {
                                        $ui.menu({
                                            items: ["打开SS(R)链接", "复制SS(R)链接", "保存二维码"],
                                            handler: function (title2, idx2) {
                                                if (idx2 == 1) {
                                                    $clipboard.text = links[idx1].url
                                                    $ui.toast("链接已经复制到剪贴板")
                                                } else if (idx2 == 2) {
                                                    $photo.save({
                                                        image: $qrcode.encode(links[idx1].url),
                                                        handler: function (success) {
                                                            if (success) {
                                                                $ui.toast("二维码保存成功")
                                                            } else {
                                                                $ui.error("二维码保存失败")
                                                            }
                                                        }
                                                    })
                                                } else if (idx2 == 0) {
                                                    $app.openURL(links[idx1].url)
                                                }
                                            }
                                        })
                                    }

                                }
                            })
                        }
                    })
                }
            }
        }]
    })
}

// save()
refreshUI()