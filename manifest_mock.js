"options_ui": {
    "page": "src/pages/options/index.html"
  },
  "background": {
    "service_worker": "src/pages/background/index.ts",
    "type": "module"
  },
  "action": {
    "default_popup": "src/pages/content/index.tsx",
    "default_icon": {
      "32": "icon-32.png"
    }
  },
  "chrome_url_overrides": {
    "newtab": "src/pages/newtab/index.html"
  },
  "devtools_page": "src/pages/devtools/index.html",
  "web_accessible_resources": [
    {
      "resources": ["contentStyle.css", "icon-128.png", "icon-32.png"],
      "matches": []
    }
  ]
  "permissions": ["activeTab"],
  "http://*/*",
        "https://*/*",
        "<all_urls>",