'use strict';
(async () => {
    let [
        {version, buildID},
        {os},
    ] = await Promise.all([
        browser.runtime.getBrowserInfo(),
        browser.runtime.getPlatformInfo(),
    ]);

    let versionMajor = parseInt(version);
    console.assert(versionMajor >= 57, `This WebExtension can only be installed in Firefox 57+`);
    let supportsPref = version > 59 ||
        version === 59 && (version !== '59.0a1' || parseInt(buildID) > 20171117100127);

    if (os === 'mac' && !supportsPref) {
        macForceXULNotifications();
    } else if (os === 'mac'  || os === 'linux') {
        browser.runtime.openOptionsPage();
    } else {
        console.log('No Native Notifications serves no purpose for ' + os);
    }
})();

async function macForceXULNotifications() {
    // If the name exceeds MAX_NOTIFICATION_NAME_LEN (#define-d to 5000),
    // then OSXNotificationCenter::ShowAlertWithIconData returns an error:
    // https://searchfox.org/mozilla-central/rev/9bab9dc5a9472e3c163ab279847d2249322c206e/widget/cocoa/OSXNotificationCenter.mm#353-359
    //
    // When an error is returned, then mBackend is cleared and XUL notifications
    // are used:
    // https://searchfox.org/mozilla-central/rev/9bab9dc5a9472e3c163ab279847d2249322c206e/toolkit/components/alerts/nsAlertsService.cpp#223-232
    const NOTIFICATION_ID_MAC_FORCE_XUL = 'x'.repeat(5001);
    browser.notifications.create(NOTIFICATION_ID_MAC_FORCE_XUL, {
        type: 'basic',
        title: 'Enabling XUL notifications',
        message: '',
    });
    browser.notifications.clear(NOTIFICATION_ID_MAC_FORCE_XUL);
}
