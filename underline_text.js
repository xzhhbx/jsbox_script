const underline = '꯭'

function decorateText(input) {
    let outputText = underline
    for (let i=0;i<input.length;i++) {
        outputText += input[i] + underline
    }
    return outputText
}

$ui.render({
    props: {
        title: "文字下划线"
    },
    views: [{
        type: "view",
        props: {
            id: "mainView"
        },
        layout: (make, view) => {
            make.width.equalTo(view.super)
            make.height.equalTo(view.super)
            make.center.equalTo(view.super)
        },
        views: [
            {
                type: "input",
                props: {
                    id: "inputView",
                    text: '',
                    placeholder: "需转换内容，回车键转换",
                    autoFontSize: true,
                },
                layout: (make, view) => {
                    make.width.equalTo(view.super).offset(-40)
                    make.height.equalTo(40)
                    make.centerX.equalTo(view.super)
                    make.top.equalTo(view.super).offset(10)
                },
                events: {
                    returned: sender => {
                        $("inputView").text = decorateText($("inputView").text)
                        $("inputView").blur()
                    }
                }
            },{
                type: "button",
                props: {
                    id: "speechButton",
                    title: "语音"
                },
                layout: (make, view)=> {
                    make.top.equalTo($("inputView").bottom).offset(10)
                    make.width.equalTo($("inputView").width).dividedBy(3).offset(-10)
                    make.left.equalTo($("inputView").left)
                },
                events: {
                    tapped: sender => {
                        $input.speech( {
                            handler: text => {
                                $("inputView").text = decorateText(text)
                            }
                        })
                    }
                }
            },{
                type: "button",
                props: {
                    id: "clipButton",
                    title: "剪贴板"
                },
                layout: (make, view) => {
                    make.top.equalTo($("inputView").bottom).offset(10)
                    make.width.equalTo($("inputView").width).dividedBy(3).offset(-10)
                    make.centerX.equalTo(view.super)
                },
                events: {
                    tapped: sender => {
                        $("inputView").text = decorateText($clipboard.text)
                    }
                }
            },{
                type: "button",
                props: {
                    id: "copyButton",
                    title: "复制"
                },
                layout: (make, view) => {
                    make.top.equalTo($("inputView").bottom).offset(10)
                    make.width.equalTo($("inputView").width).dividedBy(3).offset(-10)
                    make.right.equalTo($("inputView").right)
                },
                events: {
                    tapped: sender => {
                        $clipboard.text = $("inputView").text
                        $("inputView").blur()
                    }
                }
            }
        ]
    }]
})



