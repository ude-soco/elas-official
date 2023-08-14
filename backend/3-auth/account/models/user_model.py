import uuid
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.db.models.signals import post_migrate
from django.dispatch import receiver
from dotenv import load_dotenv
import os

load_dotenv()


class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not username:
            raise ValueError("The Username field is required.")
        if not email:
            raise ValueError("The Email field is required.")
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(username, email, password, **extra_fields)


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)

    objects = CustomUserManager()


@receiver(post_migrate)
def create_superuser(sender, **kwargs):
    username = os.environ.get("DJANGO_SUPERUSER_USERNAME")
    email = os.environ.get("DJANGO_SUPERUSER_EMAIL")
    password = os.environ.get("DJANGO_SUPERUSER_PASSWORD")

    if not User.objects.filter(username=username).exists():
        User.objects.create_superuser(username=username, email=email, password=password)
        print(f"Superuser '{username}' created with password '{password}'!")


# from django_neomodel import DjangoNode
# from neomodel import StringProperty, EmailProperty, BooleanProperty, RelationshipTo
# from courserecommender.models import Student


# class User(DjangoNode):
#     username = StringProperty(unique_index=True)
#     email = EmailProperty(unique_index=True)
#     password = StringProperty()
#     is_active = BooleanProperty(default=True)
#     is_staff = BooleanProperty(default=False)

#     is_a = RelationshipTo(Student, "IS_A")
