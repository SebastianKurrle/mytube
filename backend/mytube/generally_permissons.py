# This file defines generally permissons for users

from rest_framework.permissions import BasePermission
from rest_framework.exceptions import AuthenticationFailed


# Checks if a user is authenticated
class IsAuthenticated(BasePermission):
    def has_permission(self, request, view):
        token = request.COOKIES.get('jwt')

        if not token:
            raise AuthenticationFailed('Unauthenticated')

        return True
