from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator

class FinancialRecord(models.Model):
    TYPE_CHOICES = [('income', 'Income'), ('expense', 'Expense')]
    CATEGORY_CHOICES = [
        ('salary', 'Salary'), ('freelance', 'Freelance'),
        ('investment', 'Investment'), ('food', 'Food'),
        ('transport', 'Transport'), ('housing', 'Housing'),
        ('healthcare', 'Healthcare'), ('entertainment', 'Entertainment'),
        ('utilities', 'Utilities'), ('education', 'Education'),
        ('other', 'Other'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='records')
    amount = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0.01)])
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    date = models.DateField()
    note = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date', '-created_at']

    def __str__(self):
        return f"{self.user.username} | {self.type} | {self.amount} | {self.date}"