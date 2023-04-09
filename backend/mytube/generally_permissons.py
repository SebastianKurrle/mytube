# This file defines generally permissons for users

from rest_framework.permissions import BasePermission
from rest_framework.exceptions import AuthenticationFailed
import jwt


# Checks if a user is authenticated
class IsAuthenticated(BasePermission):
    def has_permission(self, request, view):
        try:
            token = request.headers['Authorization'].split(' ')[1]
        except IndexError:
            raise AuthenticationFailed('Unauthenticated')

        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')

        return True
