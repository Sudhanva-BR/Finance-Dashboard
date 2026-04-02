from rest_framework.permissions import BasePermission

class IsAdminRole(BasePermission):
    message = "Admin access required."
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'admin')

class IsAnalystOrAdmin(BasePermission):
    message = "Analyst or Admin access required."
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ('analyst', 'admin'))

class IsAnyRole(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)