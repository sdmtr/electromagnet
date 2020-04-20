(function() {

  var trackers = [];
  var trackers_uri = "";
  var blacklist = [];
  var blacklisted = false;
  var electrified = 0;
  var hostname = document.location.hostname;

  chrome.storage.local.get(['trackers', 'blacklist'], function(vars) {
    blacklist = vars.blacklist || [];
    blacklisted = blacklist.includes(hostname);

    trackers = vars.trackers || [];
    if (trackers.length) { 
      trackers.list.forEach(function(tracker) {
        trackers_uri += '&tr=' + encodeURIComponent(tracker);
      });
    }
  });

  $(document).ready(function() {
    apply_trackers();
    $(document).on('click', 'body a', function() {
      if (!blacklisted) {
        if (this.protocol == "magnet:") {
          chrome.storage.local.get(['clicked'], function(vars) {
            var total = vars.clicked + 1 || 1;
            chrome.storage.local.set({ clicked: total });
          });
        }
      }
    });

  });

  chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
    switch (msg.action) {
      case 'log_trackers':
        console.table(trackers.list);
        sendResponse({message: 'done and dusted'});
        break;

      case 'log_blacklist':
        chrome.storage.local.get(['blacklist'], function(vars) {
          vars.blacklist = vars.blacklist || [];
          console.table(vars.blacklist);
        });
        sendResponse({message: 'done and dusted'});
        break;

      case 'apply_trackers':
        blacklisted = false;
        apply_trackers();
        sendResponse({message: 'done and dusted'});
        break;

      case 'remove_trackers':
        blacklisted = true;
        remove_trackers();
        sendResponse({message: 'done and dusted'});
        break;

      case 'get_electrified':
        sendResponse({message: 'howdy boys', electrified: electrified });
        break;

      case 'dump_storage': {
        chrome.storage.local.get(null, function(items) {
          console.table(items);
        });
        sendResponse({message: 'done and dusted'});
      }

      default:
        sendResponse({message: 'this is what it sounds like when doves cry'});
        break;
    }

    return Promise.resolve('doing okay here');
  });

  function apply_trackers() {
    if (!blacklisted) {
      electrified = 0;
      $('a').each(function(i, e) {
        if (this.protocol == "magnet:") {
          this.href += trackers_uri;
          electrified++;
        }
      });

      chrome.storage.local.get(['electrified'], function(vars) {
        var total = vars.electrified + electrified || electrified;
        chrome.storage.local.set({ electrified: total });
      });
    }
  }

  function remove_trackers() {
    $('a').each(function(i, e) {
      if (this.protocol == "magnet:") this.href = this.href.replace(trackers_uri, '');
    });
  }

})();