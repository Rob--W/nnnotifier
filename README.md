## No Native Notifications for Firefox

https://addons.mozilla.org/en-US/firefox/addon/no-native-notifications/

Firefox allows web pages and addons to create desktop notifications.
When [desktop notifications](https://bugzilla.mozilla.org/show_bug.cgi?id=59454)
were introduced, the notifications were implemented using XUL.
This gives Firefox maximal control over how desktop notifications are displayed.

![](screenshot.png?raw=true)

Later, Firefox started integrating the desktop notifications in the native
platform-dependent notification manager. E.g. starting with Firefox 36 on Linux,
[libnotify is used](https://bugzilla.mozilla.org/show_bug.cgi?id=858919).


## Disabling native notifications on Firefox

### Preference

As of **Firefox 59**, native notifications can be disabled by setting the
`alerts.useSystemBackend` preference to `false` at `about:config`
(see [bug 1418287](https://bugzilla.mozilla.org/show_bug.cgi?id=1418287)).

For previous versions, the method depends on the operating system.

### macOS

- Firefox 59 and later (recommended): see the above preference.
- Firefox 57 and later: install [No Native Notifications 0.2](https://addons.mozilla.org/en-US/firefox/addon/no-native-notifications/versions/0.2).
- Firefox 56 and earlier: install [No Native Notifications 0.1](https://addons.mozilla.org/en-US/firefox/addon/no-native-notifications/versions/0.1.1-signed.1-signed).


### Linux

- Firefox 59 and later: see the above preference.
- Firefox 57 and 58: *cannot be disabled by an add-on*.
- Firefox 56 and earlier: install [No Native Notifications 0.1](https://addons.mozilla.org/en-US/firefox/addon/no-native-notifications/versions/0.1.1-signed.1-signed).

Firefox 57 has dropped support for legacy add-ons and there is no work-around to
disable native notifications through an add-on. To disable native notifications
on Linux, the `libnotify.so.4` library needs to be disabled.
For example by starting Firefox as follows:

```sh
#!/bin/sh
DIRNAME=$(mktemp -d)
touch "${DIRNAME}/libnotify.so.4"
export LD_LIBRARY_PATH="${DIRNAME}"
/usr/bin/firefox "$@"
rm -rf "${DIRNAME}"
```


### Windows
Firefox does not support native notifications on Windows, so you do not have to
install anything to disable it. In case native notifications become supported
(e.g. due to [bug 1155505](https://bugzilla.mozilla.org/show_bug.cgi?id=1155505)),
 then the above preference can be used to disable it.

