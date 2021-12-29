# Angular playwright builder

## Options

```json
  "project": {
    "root": "e2e/",
    "projectType": "application",
    "architect": {
      "e2e": {
        "builder": "@tsmonkeypatch/ngx-builders:playwright",
        "options": {
          "devServerTarget": "ngx-fileupload-example:serve",
          "playwrightConfig": "e2e/playwright.config.ts",
          "watch": true,
          "watchDir": ["e2e/integration"]
        },
      },
    }
  }
```