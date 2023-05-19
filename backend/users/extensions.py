# Here are external functions for the users

from .models import User
from rest_framework.exceptions import AuthenticationFailed
import jwt


def get_user_by_token(token):

    try:
        payload = jwt.decode(token, 'secret', algorithms=['HS256'])

        user = User.objects.filter(id=payload['id']).first()
    except:
        raise AuthenticationFailed('Unauthenticated!')

    return user
