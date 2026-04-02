from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.DashboardView.as_view(), name='dashboard'),
    path('records/', views.RecordListCreateView.as_view(), name='record-list'),
    path('records/<int:pk>/', views.RecordDetailView.as_view(), name='record-detail'),
]