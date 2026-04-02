from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import FinancialRecord
from .serializers import FinancialRecordSerializer
from .permissions import IsAnalystOrAdmin, IsAdminRole, IsAnyRole
from .services import get_dashboard_summary

class DashboardView(APIView):
    permission_classes = [IsAuthenticated, IsAnyRole]

    def get(self, request):
        return Response(get_dashboard_summary(request.user))

class RecordListCreateView(generics.ListCreateAPIView):
    serializer_class = FinancialRecordSerializer
    permission_classes = [IsAuthenticated, IsAnalystOrAdmin]

    def get_queryset(self):
        user = self.request.user
        qs = FinancialRecord.objects.all() if user.role == 'admin' else FinancialRecord.objects.filter(user=user)

        record_type = self.request.query_params.get('type')
        category = self.request.query_params.get('category')
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')

        if record_type: qs = qs.filter(type=record_type)
        if category: qs = qs.filter(category=category)
        if date_from: qs = qs.filter(date__gte=date_from)
        if date_to: qs = qs.filter(date__lte=date_to)
        return qs

class RecordDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = FinancialRecordSerializer

    def get_permissions(self):
        if self.request.method == 'DELETE':
            return [IsAuthenticated(), IsAdminRole()]
        return [IsAuthenticated(), IsAnalystOrAdmin()]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return FinancialRecord.objects.all()
        return FinancialRecord.objects.filter(user=user)