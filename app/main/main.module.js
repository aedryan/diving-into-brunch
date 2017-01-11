var Main = {
  init: function init() {
    var tmpl = require("main.template"),
      cxt = {title: "main title", body: "main body"},
      html = tmpl(cxt);
    
    $("body").append(html);
    require('page.module').init();
  }
};

module.exports = Main;