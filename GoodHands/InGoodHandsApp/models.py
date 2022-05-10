from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Category(models.Model):
    name = models.CharField(max_length=64)

    def __str__(self):
        return self.name


class Institution(models.Model):
    FUNDACJA = "FA"
    ORGANIZACJA_POZARZĄDOWA = "OP"
    ZBIÓRKA_LOKALNA = "ZL"
    INSTITUTION_TYPES_CHOICES = [
        (FUNDACJA, "fundacja"),
        (ORGANIZACJA_POZARZĄDOWA, "organizacja pozarządowa"),
        (ZBIÓRKA_LOKALNA, "zbiórka lokalna")
    ]
    name = models.CharField(max_length=64)
    description = models.TextField(null=True)
    type = models.CharField(max_length=2, choices=INSTITUTION_TYPES_CHOICES, default=FUNDACJA)
    categories = models.ManyToManyField(Category)

    def __str__(self):
        return self.name


class Donation(models.Model):
    quantity = models.SmallIntegerField()
    categories = models.ManyToManyField(Category)
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE)
    address = models.CharField(max_length=128)
    phone_number = models.CharField(max_length=32)
    city = models.CharField(max_length=32)
    zip_code = models.CharField(max_length=16)
    pick_up_date = models.DateField()
    pick_up_time = models.TimeField()
    pick_up_comment = models.TextField(null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    is_taken = models.BooleanField(default=False)
