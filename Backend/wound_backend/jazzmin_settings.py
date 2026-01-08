
# Jazzmin Settings
JAZZMIN_SETTINGS = {
    "site_title": "Wound Assessment Admin",
    "site_header": "Wound Assessment",
    "site_brand": "Wound Admin",
    "welcome_sign": "Welcome to Wound Assessment Admin",
    "copyright": "Wound Corp",
    "search_model": ["authentication.User", "images.UploadedImage"],
    "topmenu_links": [
        {"name": "Home",  "url": "admin:index", "permissions": ["auth.view_user"]},
    ],
    "show_sidebar": True,
    "navigation_expanded": True,
    "order_with_respect_to": ["authentication", "images"],
    "icons": {
        "auth": "fas fa-users-cog",
        "auth.user": "fas fa-user",
        "auth.Group": "fas fa-users",
        "images.UploadedImage": "fas fa-image",
        "images.Assessment": "fas fa-notes-medical",
    },
    "default_icon_parents": "fas fa-chevron-circle-right",
    "default_icon_children": "fas fa-circle",
}

JAZZMIN_UI_TWEAKS = {
    "theme": "darkly",
    "dark_mode_theme": "darkly",
}
