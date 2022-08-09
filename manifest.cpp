{
    "name":"Remind-Anniversary",
    "version":"0.1.0",
    "manifest_version": 3,
    "description":"Remind important anniversaries",
    "host_permissions": ["<all_urls>"],
    "permissions":["storage","notifications","scripting"],
    "minimum_chrome_version": "93",
    "background":{
        "service_worker":"background.js"
    },
    "action":{
        "default_icon":{
            "16": "assets/ext-icon.png",
            "24": "assets/ext-icon.png",
            "32": "assets/ext-icon.png"
        },
        "default_title":"ReAnni",
        "default_popup":"popup.html"
    },
    "icons":{
        "16": "assets/ext-icon.png",
        "32": "assets/ext-icon.png",
        "48": "assets/ext-icon.png",
        "128": "assets/ext-icon.png"
    }
}