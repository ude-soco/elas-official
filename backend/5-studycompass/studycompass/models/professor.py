from django.db import models


class Professor(models.Model):
    id = models.CharField(primary_key=True, max_length=255)
    name = models.CharField(max_length=255)
    url = models.CharField(max_length=255)
