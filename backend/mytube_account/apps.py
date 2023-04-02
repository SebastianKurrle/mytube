from django.apps import AppConfig


class MytubeAccountConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'mytube_account'

    def ready(self):
        import mytube_account.signals
