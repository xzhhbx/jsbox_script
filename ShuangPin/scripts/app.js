function renderUI() {
	const sougou = "assets/sbgbudpn.jpg"
	const ziranma = "assets/zirjma.jpg"
	const weiruan = "assets/wzrrudpn.jpg"
	const xiaohe = "assets/xcheudpn.jpg"
	const zhinengabc = "assets/vingabc.jpg"
	const wubi = "assets/wubi.jpg"

	const titles = ["搜狗双拼", "自然码", "微软双拼", "小鹤双拼", "智能ABC", "五笔"]
	const pics = [sougou, ziranma, weiruan, xiaohe, zhinengabc, wubi]

	const deviceInfo = $device.info
	const screen_width = deviceInfo.screen.width
	const screen_height = deviceInfo.screen.height

	const img_height = 320 * screen_width / 1050

	let begin_time = null

	let example_text = $clipboard.text

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
	                text: example_text,
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
	                id: "input_area",
	                text: "",
	                alpha: .7,
	            },
	            layout: (make, view) => {
	                make.size.equalTo($size(screen_width, screen_height - img_height))
	                make.top.equalTo($("img").bottom)
	            },
	            events: {
	                didBeginEditing: sender => {
	                    $console.info("start")
	                    if (!begin_time) {
	                        begin_time = Date.now()
	                        $ui.toast("开始计时")
	                    }
	                },
	                changed: sender => {
	                    if ($("input_area").text == example_text) {
	                        $ui.toast("计时结束")

	                        let char_num = example_text.length
	                        let time = (Date.now() - begin_time) / 1000
	                        let speed = (char_num / time).toFixed(2)
	                        let result = `字数: ${char_num} 字\n耗时: ${time} 秒\n速度: ${speed} 字/秒`
	                        // $ui.alert(result)
	                        begin_time = null,
	                        $("input_area").text = ""
	                        $("input_area").blur()
	                        $push.schedule({
	                            title: "训练结束",
	                            body: result,
	                            delay: 0
	                        })
	                    }
	                }
	            }
	        }]
	    }]
	})

}

module.exports = {
	renderUI: renderUI
}