# This file defines generally permissons for users

from rest_framework.permissions import BasePermission


# Checks if a user is authenticated
class IsAuthenticated(BasePermission):
    def has_permission(self, request, view):
        pass
