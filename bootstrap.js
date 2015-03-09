/**
 * Copyright (c) 2015 Rob Wu <rob@robwu.nl> (https://robwu.nl)
 */
/* globals Components, APP_SHUTDOWN */

/* exported startup, install, shutdown, uninstall */
// The four exported methods have been implemented for
// https://developer.mozilla.org/en-US/Add-ons/Bootstrapped_extensions
// https://developer.mozilla.org/en-US/docs/Extensions/bootstrap.js
'use strict';
const Cc = Components.classes;
const Ci = Components.interfaces;
const Cm = Components.manager;
const Cr = Components.results;
const NS_SYSTEMALERTSERVICE_CONTRACTID = '@mozilla.org/system-alerts-service;1';

const sysAlertsFactory =
  Cc[NS_SYSTEMALERTSERVICE_CONTRACTID] &&
  Cm.getClassObject(Cc[NS_SYSTEMALERTSERVICE_CONTRACTID], Ci.nsIFactory);

// An implementation of nsIFactory that fails at creating instances.
var nullAlertsFactory = {
  createInstance: function NNNotifier_createInstance(aOuter, aIID) {
    if (aOuter !== null)
      throw Cr.NS_ERROR_NO_AGGREGATION;

    // Throw an error such that nsAlertsService::ShowAlertNotification
    // falls back to mXULAlerts.ShowAlertNotification
    // See source/toolkit/components/alerts/nsAlertsService.cpp
    throw Cr.NS_ERROR_NOT_IMPLEMENTED;
  },
  lockFactory: function NNNotifier_lockFactory(aDoLock) {
    throw Cr.NS_ERROR_NOT_IMPLEMENTED;
  },
  QueryInterface: function NNNotifier_QueryInterface(iid) {
    if (Ci.nsISupports.equals(iid))
      return this;
    if (Ci.nsIFactory.equals(iid))
      return this;
    throw Cr.NS_ERROR_NO_INTERFACE;
  }
};


function startup() {
  if (!sysAlertsFactory)
    return;

  // Unregister the built-in (native) system alerts class factory
  Cm.nsIComponentRegistrar.unregisterFactory(
      Cc[NS_SYSTEMALERTSERVICE_CONTRACTID],
      sysAlertsFactory);

  // Register a dummy factory. Without this one, the unregistered factory would
  // still be used upon calling
  // Notification.requestPermission(function(){ new Notification('tit',{}); });
  Cm.nsIComponentRegistrar.registerFactory(
      Cc[NS_SYSTEMALERTSERVICE_CONTRACTID],
      "Null system alerts service",
      NS_SYSTEMALERTSERVICE_CONTRACTID,
      nullAlertsFactory);
}

function install() {}

function shutdown(data, reason) {
  // Don't bother restoring the old state upon shutdown of the browser.
  if (reason === APP_SHUTDOWN)
    return;

  if (!sysAlertsFactory)
    return;

  Cm.nsIComponentRegistrar.unregisterFactory(
      Cc[NS_SYSTEMALERTSERVICE_CONTRACTID],
      nullAlertsFactory);

  // Restore the built-in (native) system alerts class factory
  Cm.nsIComponentRegistrar.registerFactory(
      Cc[NS_SYSTEMALERTSERVICE_CONTRACTID],
      "Native system alert service",
      NS_SYSTEMALERTSERVICE_CONTRACTID,
      sysAlertsFactory);
}

function uninstall() {}
