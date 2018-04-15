var app = require('scripts/app');

let err = $context.query.error || ""

if (err == "") {
    app.renderUI()
}else{
    $ui.alert({
        title: "结果",
        message: "Picsew处理失败",
    })
}