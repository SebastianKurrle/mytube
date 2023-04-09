from rest_framework.permissions import BasePermission
from users.extensions import get_user_by_token


class IsMyTubeAccountOwner(BasePermission):

    # Checks if a user is owner of an MyTube account
    def has_object_permission(self, request, view, obj):
        token = request.headers['Authorization'].split(' ')[1]

        user = get_user_by_token(token)

        return user == obj.owner
