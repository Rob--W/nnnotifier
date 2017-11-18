nnnotifier.xpi: install.rdf bootstrap.js icon.png
	zip nnnotifier.xpi install.rdf bootstrap.js icon.png

nnnotifier2.xpi: webextension/manifest.json webextension/background.js webextension/no-native-notifications.html
	cd webextension/ && zip ../nnnotifier2.xpi manifest.json background.js no-native-notifications.html
