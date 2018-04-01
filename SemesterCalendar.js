const FILENAME = "学期日历.js"

function save(start_date, weeks) {
    let data = JSON.stringify({
        start_time: {
            year: start_date.getFullYear(),
            month: start_date.getMonth(),
            day: start_date.getDate()
        },
        weeks: weeks
    })
    $console.info(data)
    $file.write({
        data: $data({ string: data }),
        path: FILENAME
    })
}

function refreshUI() {

    let env = $app.env

    let data = null

    let start_date = null

    let today = new Date()

    let weeks = null

    if ($file.exists(FILENAME)) {
        $console.info("Got file")
        data = JSON.parse($file.read(FILENAME).string)
        let dd = data['start_time']
        start_date = new Date(parseInt(dd["year"]), parseInt(dd["month"]), parseInt(dd["day"]))
        weeks = data['weeks']
    } else {
        $console.info("No file")
    }

    let day_gap = null
    let firstday = null
    let weekidx = null

    if (start_date && weeks) {
        day_gap = (today.getTime() - start_date.getTime()) / 86400000
        firstday = start_date.getDay() || 7
        weekidx = (day_gap - (8 - firstday)) / 7 + 2
    }

    if (env == 1) {
        $ui.render({
            type: "view",
            props: {
                id: "main_view",
                title: "学期日历",
            },
            layout: $layout.center,
            views: [{
                type: "label",
                props: {
                    type: $kbType.number,
                    id: "start_date",
                    text: start_date ? `${start_date.getFullYear()}-${(start_date.getMonth() + 1)}-${start_date.getDate()}` : '点击设置起始时间',
                    align: $align.center,
                },
                layout: function (make, view) {
                    make.left.equalTo(30)
                    make.width.equalTo(150)
                    make.height.equalTo(50)
                },
                events: {
                    tapped: sender => {
                        $input.text({
                            type: $kbType.text,
                            placeholder: "起始日期，xxxx-xx-xx",
                            handler: function (text) {
                                let date = text.split('-').map(x => parseInt(x))
                                start_date = new Date(date[0], date[1] - 1, date[2])
                                save(start_date, weeks)
                                refreshUI()
                            }
                        })
                    }
                }
            }, {
                type: "label",
                props: {
                    id: "weeks",
                    text: weeks ? `${weeks}` : '点击设置周数',
                    align: $align.center,
                },
                layout: function (make, view) {
                    make.left.equalTo($("start_date").right).offset(-10)
                    make.width.equalTo(120)
                    make.height.equalTo(50)
                },
                events: {
                    tapped: sender => {
                        $input.text({
                            type: $kbType.number,
                            placeholder: "周数",
                            handler: function (text) {
                                weeks = parseInt(text)
                                save(start_date, weeks)
                                refreshUI()
                            }
                        })
                    }
                }
            }, {
                type: "progress",
                props: {
                    id: "progress",
                    radius: 10,
                    value: weekidx ? weekidx / weeks : 0
                },
                layout: function (make, view) {
                    make.top.equalTo($("weeks").bottom).offset(0)
                    make.centerX.equalTo(view.super)
                    make.height.equalTo(40)
                    make.width.equalTo(view.super.width).offset(-40)
                },
                events: {
                    tapped: sender => {
                        $share.sheet($("main_view").snapshot)
                    }
                }
            }, {
                type: "label",
                props: {
                    text: weekidx ? "当前为第" + parseInt(weekidx) + "周" : '请先设置起始日期和周数',
                    textColor: $color("#fff")
                },
                layout: function (make, view) {
                    make.center.equalTo($("progress"))
                }
            }]
        })
    } else if (env == 2) {
        $ui.render({
            props: {
                title: ""
            },
            views: [{
                type: "view",
                props: {
                    id: "main_view"
                },
                layout: $layout.fill,
                views: [{
                    type: "progress",
                    props: {
                        id: "progress",
                        radius: 10,
                        value: weekidx ? weekidx / weeks : 0
                    },
                    layout: function (make, view) {
                        make.center.equalTo(view.super)
                        make.height.equalTo(40)
                        make.width.equalTo(view.super.width).offset(-40)
                    },
                    events: {
                        tapped: sender => {
                            $share.sheet($("main_view").snapshot)
                        }
                    }
                }, {
                    type: "label",
                    props: {
                        text: weekidx ? "当前为第" + parseInt(weekidx) + "周" : '请先设置起始日期和周数',
                        textColor: $color("#fff")
                    },
                    layout: function (make, view) {
                        make.center.equalTo($("progress"))
                    }
                }]
            }]
        })
    }


}

refreshUI()