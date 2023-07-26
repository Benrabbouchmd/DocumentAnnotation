from django.db import models


class Annotation(models.Model):
    start = models.PositiveIntegerField()
    end = models.PositiveIntegerField()
    label = models.CharField(max_length=100)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.label
