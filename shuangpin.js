const picURL = "https://api.ihint.me/shuang/img/sbgbudpn.jpg"

const deviceInfo = $device.info
const screen_width = deviceInfo.screen.width
const screen_height = deviceInfo.screen.height

const img_height = 320 * screen_width / 1050

$console.info(screen_width)

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
                src: picURL
            },
            layout: (make, view) => {
                make.top.equalTo(0)
                make.size.equalTo($size(screen_width, img_height))
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