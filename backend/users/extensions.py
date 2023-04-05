# Here are external functions for the users

from .models import User
import jwt


def get_user_by_token(token):
    payload = jwt.decode(token, 'secret', algorithms=['HS256'])

    user = User.objects.filter(id=payload['id']).first()

    return user
