## No Native Notifications for Firefox

https://addons.mozilla.org/en-US/firefox/addon/no-native-notifications/

Firefox allows web pages and addons to create desktop notifications.
When [desktop notifications](https://bugzilla.mozilla.org/show_bug.cgi?id=59454)
were introduced, the notifications were implemented using XUL.
This gives Firefox (and addons) maximal control over how desktop notifications
are displayed.

Later, Firefox started integrating the desktop notifications in the native
platform-dependent notification manager. E.g. starting with Firefox 36 on Linux,
[libnotify is used](https://bugzilla.mozilla.org/show_bug.cgi?id=858919).

Install this addon if you prefer to see the XUL-based notifications instead of
the native notifications.

![](screenshot.png?raw=true)
