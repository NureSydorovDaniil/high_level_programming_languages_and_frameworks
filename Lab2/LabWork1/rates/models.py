from django.db import models

class Currency(models.Model):
    name = models.CharField(max_length=50)
    buy_rate = models.DecimalField(max_digits=10, decimal_places=2)
    sell_rate = models.DecimalField(max_digits=10, decimal_places=2)