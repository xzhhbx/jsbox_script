const sougou = "https://api.ihint.me/shuang/img/sbgbudpn.jpg"
const ziranma = "https://api.ihint.me/shuang/img/zirjma.jpg"
const weiruan = "https://api.ihint.me/shuang/img/wzrrudpn.jpg"
const xiaohe = "https://api.ihint.me/shuang/img/xcheudpn.jpg"
const zhinengabc = "https://api.ihint.me/shuang/img/vingabc.jpg"

const titles = ["搜狗双拼", "自然码", "微软双拼", "小鹤双拼", "智能ABC"]
const pics = [sougou, ziranma, weiruan, xiaohe, zhinengabc]

const deviceInfo = $device.info
const screen_width = deviceInfo.screen.width
const screen_height = deviceInfo.screen.height

const img_height = 320 * screen_width / 1050

$app.tips("点击图片可以替换方案，样本文字来自剪贴板，点击样本红字开始输入")

$ui.render({
    props: {
        title: "双拼练习"
    },
    views: [{
        type: "view",
        props: {
            id: "main_view"
        },
        layout: $layout.fill,
        events: {
            
        },
        views: [{
            type: "image",
            props: {
                id: "img",
                src: weiruan
            },
            layout: (make, view) => {
                make.top.equalTo(0)
                make.size.equalTo($size(screen_width, img_height))
            },
            events: {
                tapped: sender => {
                    $ui.menu({
                        items: titles,
                        handler: function(title, idx) {
                            $ui.toast(`${title}`)
                            $("img").src = pics[idx]
                            $("img").updateLayout(make => {
                                make.top.left.equalTo(0)
                                make.size.equalTo($size(screen_width, img_height))
                            })
                        }
                    })
                }
            } 
        },{
            type: "text",
            props: {
                id: "text",
                text: $clipboard.text,
                editable: false,
                textColor: $color("red")
            },
            layout: (make, view) => {
                make.top.equalTo($("img").bottom)
                make.size.equalTo($size(screen_width, screen_height - img_height))
            }
        },{
            type: "text",
            props: {
                text: "",
                alpha: .7,
            },
            layout: (make, view) => {
                make.size.equalTo($size(screen_width, screen_height - img_height))
                make.top.equalTo($("img").bottom)
            }
        }]
    }]
})