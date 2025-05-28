from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


def image_upload_path(instance, filename):
    return 'user_{0}/{1}'.format(instance.user.id, filename)

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete= models.CASCADE)
    profileImage = models.ImageField(upload_to=image_upload_path, blank=True, null=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"