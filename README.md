<p align="center">
  <img src="https://github.com/sdmtr/electromagnet/blob/master/src/img/electromagnet-active.png">
</p>

<h1 align="center">Electromagnet</h1>

***Electromagnet is a Chrome extension that electrifies your torrents by automatically adding lots of stable trackers from [newTrackon](https://newtrackon.com/) to all magnet links as you browse the web, giving you access to way more seeders.***

## How it works

Electromagnet downloads the latest list of stable public trackers from [newTrackon](https://newtrackon.com/) every hour or so and automatically adds those trackers to any magnet links it sees as you're browsing the web. For most public torrents, the more trackers you're connected to the more seeders you can access.

You can also tell Electromagnet not to electrify magnet links on a particular site, for example if you're a member of a private Linux ISO torrent community.

## Installation

Because Electromagnet hasn't been submitted to the Chrome Extension store yet (and probably won't be accepted even when it has been), installation is a manual process. 

  1. Either clone this repo to your machine or download a ZIP copy (click the green "Clone or download" button on this page and choose "Download ZIP", but make sure you remember to actually unpack the ZIP file once you've downloaded it)
  2. Open Chrome and navigate to the Extensions page (chrome://extensions/)
  3. If it isn't already turned on, activate the "Developer mode" switch near the top right of the page
  4. Click the "Load unpacked" button near the top left of the page
  5. Navigate to wherever you saved the repo or unpacked the ZIP archive, and select the "src" directory 

## Usage

Just load the extension and you're good to go. As you browse the web, Electromagnet will add as many stable trackers as it can find to all magnet links automatically, you don't need to do anything special to make it work.

If you'd like to stop Electromagnet from changing magnet links on the site you're currently browsing, click the Electromagnet extension icon and then click the big magnet graphic to disable electrification on the current site. 

If you're a technical kind of person, you can shift+click the magnet graphic to see a debug menu.

## Privacy

Electromagnet contains no tracking or analytics code of any kind, and does not collect any information about the websites you visit or torrents you download. It does not store a specific list of which magnet links it has modified or which you have clicked. It does store a list of the most recent stable public trackers from newTrackon, but only locally.

The only outbound connection Electromagnet makes is to the [newTrackon API](https://newtrackon.com/api), which returns a list of stable public trackers. Due to the way browsers work newTrackon will receive your public IP address and [user agent](https://en.wikipedia.org/wiki/User_agent#Format_for_human-operated_web_browsers) (essentially just the name of the browser you use, it doesn't contain any personally identifiable information) whenever the API is accessed and they may or may not log connection attempts, but they do not receive any information about the sites you're browsing or the torrents you're downloading.

## Todo

  1. Get rid of the jQuery dependency.
  2. Create a way for users to blacklist specific trackers.
  3. At the moment Electromagnet appends all of the trackers it knows about even if the magnet link already has one or more of those trackers associated with it. That doesn't cause any actual problems with torrent clients, but it's better to full-arse something than half-arse it.
  4. Some of the error handling needs to be improved to avoid littering the console with "unchecked runtime.lasterror" messages. I'm not entirely sure what I need to do to fix that though.
  5. I'd really like to create a better logo and icon, but my graphic design skills aren't great. If you'd like to contribute some better images, please submit a pull request!

## Credits

Much thanks to [@CorralPeltzer](https://twitter.com/CorralPeltzer) for creating [newTrackon](https://newtrackon.com/), and for providing a public API to their astoundingly useful service. A note of thanks should also go to [Uriel](http://uriel.cat-v.org/) for creating the original Trackon project.

Gear icon and Info icon made by [Freepik](http://www.freepik.com) from [www.flaticon.com](http://www.flaticon.com), licensed under [CC 3.0 BY](http://creativecommons.org/licenses/by/3.0/)