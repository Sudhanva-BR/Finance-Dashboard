from django.db.models import Sum
from .models import FinancialRecord

def get_dashboard_summary(user):
    records = FinancialRecord.objects.filter(user=user)
    total_income = records.filter(type='income').aggregate(total=Sum('amount'))['total'] or 0
    total_expenses = records.filter(type='expense').aggregate(total=Sum('amount'))['total'] or 0
    net_balance = total_income - total_expenses

    category_totals = {}
    for record in records.values('category', 'type').annotate(total=Sum('amount')):
        key = f"{record['type']}_{record['category']}"
        category_totals[key] = {
            'category': record['category'],
            'type': record['type'],
            'total': float(record['total']),
        }

    return {
        'total_income': float(total_income),
        'total_expenses': float(total_expenses),
        'net_balance': float(net_balance),
        'category_totals': list(category_totals.values()),
    }