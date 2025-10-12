from django.db import models

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.translation import gettext_lazy as _

from .managers import UserManager

class User(AbstractBaseUser, PermissionsMixin):
    class ROLE_CHOICES(models.TextChoices):
        SUPERADMIN = "superadmin", _("SuperAdmin")
        ADMIN = "admin", _("Admin")
        STAFF = "staff", _("Staff")
        USER = "user", _("User")

    email = models.EmailField(unique=True)
    username = models.CharField(max_length=30, unique=True, blank=True, null=True)

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES.choices,
        default=ROLE_CHOICES.USER
    )

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = UserManager()

    def clean(self):
        """
        Ensure boolean fields are consistent with role.
        """
        if self.role == self.ROLE_CHOICES.SUPERADMIN:
            self.is_superuser = True
            self.is_staff = True
            self.is_admin = True
        elif self.role == self.ROLE_CHOICES.ADMIN:
            self.is_superuser = False
            self.is_staff = True
            self.is_admin = True
        elif self.role == self.ROLE_CHOICES.STAFF:
            self.is_superuser = False
            self.is_staff = True
            self.is_admin = False
        else: 
            self.is_superuser = False
            self.is_staff = False
            self.is_admin = False

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.username} is {self.role}"



def image_upload_path(instance, filename):
    return 'user_{0}/{1}'.format(instance.user.id, filename)

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete= models.CASCADE)
    profile_image = models.ImageField(upload_to=image_upload_path, blank=True, null=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"