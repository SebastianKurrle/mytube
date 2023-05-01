from django.db.models.signals import pre_save, pre_delete
from django.dispatch import receiver
from .models import Video


@receiver(pre_delete, sender=Video)
def delete_video_and_thumnail(sender, instance, using, **kwargs):
    instance.video.delete(save=False)
    instance.thumbnail.delete(save=False)
