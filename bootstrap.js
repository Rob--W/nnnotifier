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

  // Note: This used to be "Cm.nsIComponentRegistrar", but broke in Firefox 37:
  // InternalError: too much recursion (resource://gre/components/multiprocessShims.js:130:8)
  // JS Stack trace:
  //   AddonInterpositionService.prototype.interpose/desc.value@multiprocessShims.js:130:9
  //   ComponentRegistrarInterposition.methods.unregisterFactory@RemoteAddonsParent.jsm:291:5
  //   ...
  // Apparently this bug is caused by a shim that was specifically written for
  // AdBlock (http://bugzil.la/1007982), so I looked in AdBlock Plus's source
  // code and found an alternative way of getting the component registrar:
  let registrar = Cm.QueryInterface(Ci.nsIComponentRegistrar);

  // Unregister the built-in (native) system alerts class factory
  registrar.unregisterFactory(
      Cc[NS_SYSTEMALERTSERVICE_CONTRACTID],
      sysAlertsFactory);

  // Register a dummy factory. Without this one, the unregistered factory would
  // still be used upon calling
  // Notification.requestPermission(function(){ new Notification('tit',{}); });
  registrar.registerFactory(
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

  let registrar = Cm.QueryInterface(Ci.nsIComponentRegistrar);

  registrar.unregisterFactory(
      Cc[NS_SYSTEMALERTSERVICE_CONTRACTID],
      nullAlertsFactory);

  // Restore the built-in (native) system alerts class factory
  registrar.registerFactory(
      Cc[NS_SYSTEMALERTSERVICE_CONTRACTID],
      "Native system alert service",
      NS_SYSTEMALERTSERVICE_CONTRACTID,
      sysAlertsFactory);
}

function uninstall() {}
