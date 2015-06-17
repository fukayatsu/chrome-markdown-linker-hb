var hbUrl = "http://b.st-hatena.com/entry/image/"
var copy = function(text) {
  $('#clipboard_area').text(text)[0].select();
  document.execCommand('Copy');
}
var copyPage = function() {
  chrome.tabs.getSelected(null, function(tab){
    copy("[" + tab.title + "](" + tab.url + ")" + "![HB](" + hbUrl + tab.url  + ")");
  });
}
var menuOptions = {
  title: "Copy link and hatebu",
  contexts: ["image", "link", "page", "selection"],
  onclick: function(target, tab) {
    switch(lastRequest.action) {
    case 'copyPage':
      copyPage();
      break;
    case 'copyElement':
      var url  = target.linkUrl;
      var text = target.selectionText || lastRequest.text;

      if (!url && !text && !target.srcUrl) {
        copyPage();
        break;
      }

      if (!target.srcUrl) {
        copy("[" + text + "](" + url + ")" + "![HB](" + hbUrl + url  + ")")
        break;
      }

      text = "![](" + target.srcUrl + ")" + "![HB](" + hbUrl + target.srcUrl  + ")"
      if (url) {
        copy("[" + text + "](" + url + ")" + "![HB](" + hbUrl + url  + ")")
      } else {
        copy(text)
      }
      break;
    case 'copySelection':
      var str = "";
      var links = lastRequest.links;
      for (var i=0; i < links.length; i++) {
        var link = links[i];
        var text = link.text;
        if (link.src) { text = "![](" + link.src + ")" + "![HB](" + hbUrl + link.src  + ")" }
        str += "- [" + text +"](" + (link.href || '') + ")\n"
      }
      copy(str);
      break;
    }
  }
}
var contextMenu = chrome.contextMenus.create(menuOptions);
var lastRequest = {};
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action == 'copyPage') {
      copyPage();
    } else {
      lastRequest = request;
    }
  }
);
