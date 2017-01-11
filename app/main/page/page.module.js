var Page = {
  init: function init() {
    var tmpl = require("page.template"),
      cxt = {title: "page title", body: "page body"},
      html = tmpl(cxt);
    
    $("body").append(html);
  }
};

module.exports = Page;