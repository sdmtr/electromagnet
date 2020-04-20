(function() {
  document.addEventListener('DOMContentLoaded', function() {  

    var blacklist = [];
    var blacklisted = false;
    var hostname = '';
    var electrified = 0;
    var debug_timer;

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'get_electrified' }, function(response) {
        if (chrome.runtime.lastError) {
          //console.warn("Electromagnet experienced an error: " + chrome.runtime.lastError.message);
        }
        electrified = (response) ? response.electrified || 0 : 0;
        $('#switch .counter').text(electrified);
      });
    });

    chrome.storage.local.get(['electrified', 'clicked', 'blacklist'], function(vars) {
      $('#electrified').text(vars.electrified);
      $('#clicked').text(vars.clicked);
      blacklist = (vars.blacklist) ? vars.blacklist || [] : [];

      chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        hostname = $('<a href="' + tabs[0].url + '">')[0].hostname;
        
        blacklist.forEach(function(blackhost) {
          if (blackhost == hostname) {
            $('#toggle').attr('src', 'img/electromagnet-inactive.png');
            blacklisted = true;
          }
        });
      });
    });

    $('#sections').height($('#switch').height());
    $('section').height($('#switch').height());

    $('.tooltip').hide();

    $('#sections').scrollLeft($('#sections').scrollLeft() + $('section#switch').position().left + 1);

    $('#toggle').click(function(e) {      
      if (e.shiftKey) {
        create_debug_timer();
        show_section("scratch");
      } else {
        if (hostname) {
          if (blacklisted) {
            blacklisted = false;
            $('#click-to-disable').show();
            $('#click-to-enable').hide();
            $(this).attr('src', 'img/electromagnet-active.png');

            chrome.storage.local.get(['blacklist'], function(vars) {
              vars.blacklist = vars.blacklist || [];
              blacklist = vars.blacklist.filter(function(element) {
                return element !== hostname;
              });
              chrome.storage.local.set({
                blacklist: blacklist
              });
            });

            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
              chrome.tabs.sendMessage(tabs[0].id, { action: 'apply_trackers' });
            });
          } else {
            blacklisted = true;
            $('#click-to-disable').hide();
            $('#click-to-enable').show();
            $(this).attr('src', 'img/electromagnet-inactive.png');

            chrome.storage.local.get(['blacklist'], function(vars) {
              blacklist = vars.blacklist || [];
              blacklist.push(hostname);
              chrome.storage.local.set({
                blacklist: blacklist
              });
            });

            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
              chrome.tabs.sendMessage(tabs[0].id, { action: 'remove_trackers' });
            });
          }
        }
      }
    });

    $('#toggle').hover(function() {
      if (blacklisted) {
        $('#click-to-enable').show();
      } else {
        $('#click-to-disable').show();
      }
    }, function() {
      $('.tooltip').hide();
    });

    $('#im-done-here').click(function() {
      destroy_debug_timer();
    });

    $('#force-update').click(function() {
      chrome.runtime.sendMessage({ action: "force_update" });
    });

    $('#log-trackers').click(function() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'log_trackers' });
      });
    });

    $('#log-blacklist').click(function() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'log_blacklist' });
      });
    });

    $('#clear-storage').click(function() {
      chrome.storage.local.clear(function() {
        if (chrome.runtime.lastError) {
          //console.error(error);
        }
      });
    });

    $('#dump-storage').click(function() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'dump_storage' });
      });
    });

    $('.bar-option').click(function() {
      $('.bar-option').removeClass('active');
      $(this).addClass('active');
      var option = $(this).data('option');
      show_section(option);
    });

    $('.btn').click(function() {
      $('.bar-option').removeClass('active');
      var which = $(this).data('return');
      if (which) show_section(which);
    });

    $('#reset').click(function() {
      $('#electrified, #clicked').text('0');
      $('#reset-congrats').show();
      setTimeout(function() { $('#reset-congrats').fadeOut('slow'); }, 5000);
      chrome.storage.local.set({ electrified: 0, clicked: 0 });
    });
  });

  function show_section(section) {
    $('#sections').animate({scrollLeft: $('#sections').scrollLeft() + $('section#' + section).position().left + 1}, 500, 'smooth');
  }

  $.easing.smooth = function (x, t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t + b;
    return -c/2 * ((--t)*(t-2) - 1) + b;
  };

  function format_seconds(timestamp) {
    var timestamp_seconds, hours, minutes, seconds;

    timestamp = parseInt((Date.now() - timestamp) / 1000);
    timestamp_seconds = timestamp;

    hours = ("00" + Math.floor(timestamp_seconds / 3600)).slice(-2);
    timestamp_seconds %= 3600;
    minutes = ("00" + Math.floor(timestamp_seconds / 60)).slice(-2);
    seconds = ("00" + timestamp_seconds % 60).slice(-2);

    return { timestamp: timestamp, hours: hours, minutes: minutes, seconds: seconds };
  }

  function create_debug_timer() {
    debug_timer = setInterval(function() {
      chrome.storage.local.get(['alarm_triggered', 'alarm_created', 'trackers', 'blacklist'], function(vars) {
        if (typeof vars.trackers !== "undefined") {

          if (typeof vars.alarm_created == "undefined") {
            chrome.storage.local.set({
              alarm_created: Date.now()
            });
            vars.alarm_created = Date.now();
          }

          if (typeof vars.alarm_triggered == "undefined") {
            chrome.storage.local.set({
              alarm_triggered: Date.now()
            });
            vars.alarm_triggered = Date.now();
          }

          var trigger_fs = format_seconds(vars.alarm_triggered);
          var created_fs = format_seconds(vars.alarm_created);
          var updated_fs = format_seconds(vars.trackers.timestamp);
          var blacklist = (vars.blacklist) ? vars.blacklist || [] : [];

          var text = '';

          text += 'alarm_created   : ' + created_fs.hours + ':' + created_fs.minutes + ':' + created_fs.seconds + "\n";
          text += 'alarm_triggered : ' + trigger_fs.hours + ':' + trigger_fs.minutes + ':' + trigger_fs.seconds + "\n";
          text += 'trackers_updated: ' + updated_fs.hours + ':' + updated_fs.minutes + ':' + updated_fs.seconds + "\n";
          text += "\n";
          text += 'blacklisted hostnames: ' + blacklist.length + "\n";
        } else {
          text = "\n\nThere's no tracker list yet,\ntry forcing an update first.\n\n";
        }

        $('#scratch pre').text(text);
      });
    }, 1000);
  }

  function destroy_debug_timer() {
    clearInterval(debug_timer);
  }

})();