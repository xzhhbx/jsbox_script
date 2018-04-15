FILENAME = 'picsew.js'

function renderUI() {
  let errorScheme = $text.URLEncode('jsbox://run?name=Picsew%20Tool&error=1')
  $ui.menu({
    items: ['最近长截图', '图片带壳'],
    handler: function(title, idx) {
      let scheme
      if (idx == 0) {
        scheme = `picsew://x-callback-url/scroll?in=recent&out=save&clean_status=yes&delete_source=yes&x-success=photos-redirect://&x-error=${errorScheme}`
      }else {
        scheme = `picsew://x-callback-url/scroll?in=latest&count=1&out=save&mockup=black&clean_status=yes&delete_source=yes&x-success=photos-redirect://&x-error=${errorScheme}`
      }
      $app.openURL(scheme)
    }
  })
}
module.exports = {
  renderUI: renderUI
}