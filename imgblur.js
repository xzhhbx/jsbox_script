
let dvinfo = $device.info

let s_w = dvinfo.screen.width
let s_h = dvinfo.screen.height

$app.strings = {
    "en": {
        "title": "Image Blur",
        "extralight": "Extra Light",
        "light": "Light",
        "dark": "Dark",
        "savetips": "Click to save.",
        "author": "Author: Fndroid",
        "savedone": "Image saved!",
        "savefail": "Image can not be saved!"
    },
    "zh-Hans": {
        "title": "图片模糊",
        "extralight": "极亮",
        "light": "明亮",
        "dark": "黑暗",
        "savetips": "点击图片即可保存！",
        "author": "作者：Fndroid",
        "savedone": "图片保存成功！",
        "savefail": "图片保存失败！"
    }
}


if ($app.env != $env.app) {
    $app.openURL("jsbox://run?name=" + encodeURI($addin.current.name));
    return;
}

$ui.menu({
    items: [$l10n("extralight"), $l10n("light"), $l10n("dark")],
    handler: function (title, idx) {
        $photo.pick({
            format: "data",
            handler: function (image) {
                $app.tips($l10n("savetips"))
                let metadata = image.metadata
                $console.info(metadata)
                let img_w = metadata.PixelWidth
                let img_h = metadata.PixelHeight
                let orientation = metadata.Orientation
                if (orientation && orientation == 6) {
                    let tmp = img_w
                    img_w = img_h
                    img_h = tmp
                    $console.info("shit")
                }
                let sc_w = img_w / s_w
                let sc_h = img_h / s_h
                let final = Math.max(sc_h, sc_w)
                $ui.render({
                    props: {
                        title: $l10n("title")
                    },
                    views: [{
                        type: "image",
                        props: {
                            id: "img",
                            data: image.data
                        },
                        views: [{
                            type: "blur",
                            props: {
                                id: "bb",
                                style: idx,
                                alpha: 0.5
                            },
                            layout: $layout.fill
                        }],
                        layout: function (make, view) {
                            make.centerX.equalTo(view.super)
                            make.size.equalTo($size(img_w / final, img_h / final))
                        },
                        events: {
                            tapped: sender => {
                                $photo.save({
                                    image: $("img").snapshot,
                                    handler: function (success) {
                                        if (success){
                                            $ui.toast($l10n("savedone"))
                                        }else{
                                            $ui.error($l10n("savefail"))
                                        }
                                    }
                                })

                            }
                        }
                    }, {
                        type: "slider",
                        props: {
                            id: "alpha_val",
                            max: 1,
                            min: 0,
                            value: 0.5,
                            thumbColor: $color("#02b2f2")
                        },
                        layout: (make, view) => {
                            make.width.equalTo(view.super.width).offset(-40)
                            make.left.right.inset(20)
                            make.bottom.equalTo(view.super.bottom).offset(-25)
                        },
                        events: {
                            changed: sender => {
                                $("bb").alpha = $("alpha_val").value
                            }
                        }
                    }, {
                        type: "label",
                        props: {
                            text: $l10n("author"),
                            textColor: $color("#323232"),
                            alpha: .5,
                            align: $align.center
                        }, 
                        layout: (make, view)=> {
                            make.bottom.equalTo(view.super).offset(-5)
                            make.width.equalTo(view.super)
                        }
                    }]
                })
            }
        })
    }
})

