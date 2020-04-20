(function() {

  update_trackers();

  chrome.storage.local.set({
    alarm_created: Date.now()
  });

  chrome.alarms.create("update_trackers", {
    delayInMinutes: 1,
    periodInMinutes: 1
  });

  chrome.alarms.onAlarm.addListener(function(alarm) {
    chrome.storage.local.set({
      alarm_triggered: Date.now()
    });

    chrome.storage.local.get(['trackers'], function(vars) {
      if (typeof vars.trackers !== "undefined") {
        var trackers = vars.trackers;
        var last_updated = parseInt((Date.now() - trackers.timestamp) / 1000);
        if (last_updated >= 3600) update_trackers();
      } else {
        update_trackers();
      }
    });
  });

  chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    switch (msg.action) {
      case 'force_update':
        update_trackers();
        sendResponse({message: 'workin on it now boss'});
        break;

      default:
        sendResponse({message: 'this is what it sounds like when doves cry'});
        break;
    }

    return true;
  });

  function update_trackers() {
    var nt_url = 'https://newtrackon.com/api/stable';

    var xhr = new XMLHttpRequest();
    xhr.open('GET', nt_url, true);
    xhr.onload = function (e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var raw = xhr.responseText;
          var trackers = {
            timestamp: Date.now(),
            list: raw.split("\n").filter(function (el) { return el != ""; })
          };
          chrome.storage.local.set({
            trackers: trackers
          });
        } else {
          console.error(xhr.statusText);
        }
      }
    };

    xhr.onerror = function (e) {
      console.error(xhr.statusText);
    };

    xhr.send(null);
  }

})();