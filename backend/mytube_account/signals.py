from django.db.models.signals import pre_save, pre_delete
from django.dispatch import receiver
from .models import MyTubeAccount


# Deletes the image when a MyTube Account is deleted
@receiver(pre_delete, sender=MyTubeAccount)
def delete_image(sender, instance, using, **kwargs):
    if instance.profile_picture != 'prof_pictures/default.png':
        instance.profile_picture.delete(save=False)
