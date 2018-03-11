$app.autoKeyboardEnabled = true

$app.tips("点击图标即可预览")

$ui.render({
    props: {
        title: "JSBox图标生成"
    },
    views: [{
        type: "view",
        props: {
            id: ""
        },
        layout: $layout.fill,
        events: {
        },
        views: [{
            type: "view",
            props: {
                id: "icon_view",
                bgcolor: $color("#505050"),
                radius: 30
            },
            layout: (make, view) => {
                make.height.equalTo(220)
                make.width.equalTo(200)
                make.centerX.equalTo(view.super)
                make.top.equalTo(20)
            },
            views: [{
                type: "label",
                props: {
                    id: "icon_font_view",
                    text: "{}",
                    font: $font("CourierNewPS-BoldMT", 125),  // Courier
                    textColor: $color("#fff"),
                },
                layout: $layout.center
            }],
            events: {
                tapped: sender => {
                    $quicklook.open({
                        image: $("icon_view").snapshot
                    })
                }
            }
        }, {
            type: "input",
            props: {
                text: "#",
                placeholder: "背景色 #xxxxxx",
                id: "color_input",
                align: $align.center
            },
            layout: (make, view) => {
                make.width.equalTo($("icon_view").width)
                make.height.equalTo(40)
                make.top.equalTo($("icon_view").bottom).inset(30)
                make.centerX.equalTo(view.super)
            },
            events: {
                returned: sender => {
                    $("icon_view").bgcolor = $color($("color_input").text)
                    $("color_input").blur()
                }
            }
        }, {
            type: "input",
            props: {
                text: "#",
                id: "font_color_input",
                placeholder: "前景色 #yyyyyy",
                align: $align.center
            },
            layout: (make, view) => {
                make.width.equalTo($("icon_view").width)
                make.height.equalTo(40)
                make.top.equalTo($("color_input").bottom).inset(10)
                make.centerX.equalTo(view.super)
            },
            events: {
                returned: sender => {
                    $("icon_font_view").textColor = $color($("font_color_input").text)
                    $("font_color_input").blur()
                }
            }
        }]
    }]
})