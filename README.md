# electromagnet

***A Chrome extension that electrifies your torrents by automatically adding lots of stable trackers from [newTrackon](https://newtrackon.com/) to all magnet links as you browse the web.***

## How it works

Electromagnet downloads the latest list of stable public trackers from [newTrackon](https://newtrackon.com/) every hour or so, and automatically adds those trackers to any magnet links it sees on every site you visit. For most public torrents the more trackers you're connected to, the more seeders you can access.

You can also tell Electromagnet not to electrify magnet links on a particular site, for example if you're a member of a private Linux ISO torrent community.

## Installation

Because Electromagnet hasn't been submitted to the Chrome Extension store yet (and probably won't be accepted even when it has been), installation is a manual process. 

  1. Either clone this repo to your machine or download a ZIP copy (click the green "Clone or download" button on this page and choose "Download ZIP", but make sure you remember to actually unpack the ZIP file once you've downloaded it)
  2. Open Chrome and navigate to the Extensions page (chrome://extensions/)
  3. If it isn't already active, activate the "Developer mode" switch near the top right of the page
  4. Click the "Load unpacked" button near the top left of the page
  5. Navigate to wherever you saved the repo or unpacked the ZIP archive, and select the "src" directory 

## Usage

Just load the extension and you're good to go. As you browse the web, Electromagnet will add as many stable trackers as it can find to all magnet links automatically, you don't need to do anything special to make it work.

If you'd like to stop Electromagnet from changing magnet links on the site you're currently browsing, click the Electromagnet extension icon and then click the big magnet graphic to disable electrification on the current site. 

If you're a technical kind of person, you can shift+click the magnet graphic to see a debug menu.

## Privacy

Electromagnet contains no tracking or analytics code of any kind, and does not send any information about the websites you visit or torrents you download to anybody for any reason. It does not store a specific list of which magnet links it has modified or which you have clicked, it just stores a numeric counter for those links. It does store a list of the most recent stable trackers from newTrackon, but only in localStorage. No data ever leaves your machine.

The only outbound connection Electromagnet makes is to the [newTrackon API](https://newtrackon.com/api), which just returns a list of stable public trackers. newTrackon will receive your public IP address whenever the API is accessed and they may or may not log all connection attempts, but they do not receive any information about the sites you're browsing or the torrents you're downloading.

## Credits

Much thanks to [@CorralPeltzer](https://twitter.com/CorralPeltzer) for creating [newTrackon](https://newtrackon.com/), and for providing a public API to their astoundingly useful service. A note of thanks should also go to [Uriel](http://uriel.cat-v.org/) for creating the original Trackon project.

Thumbs Up icon, Gear icon, and Info icon made by [Freepik](http://www.freepik.com) from [www.flaticon.com](http://www.flaticon.com), licensed under [CC 3.0 BY](http://creativecommons.org/licenses/by/3.0/)