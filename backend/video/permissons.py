from rest_framework.permissions import BasePermission
from users.extensions import get_user_by_token


class IsCommentWriter(BasePermission):

    def has_object_permission(self, request, view, obj):
        user = get_user_by_token(request)

        return user == obj.user
