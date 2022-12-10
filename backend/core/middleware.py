from fastapi_csrf_protect import CsrfProtect
from pydantic import BaseModel

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

from core.settgings import SECRET_KEY_CSRF

UNSAFE_METHODS = ['POST', 'PUT', 'DELETE']


class CsrfSettings(BaseModel):
    secret_key: str = SECRET_KEY_CSRF


@CsrfProtect.load_config
def get_csrf_config():
    return CsrfSettings()


class CheckingCsrfToken(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.method in UNSAFE_METHODS and not request.url.path.startswith('/auth'):
            csrf_protect = CsrfProtect()
            csrf_token = csrf_protect.get_csrf_from_headers(request.headers)
            csrf_protect.validate_csrf(csrf_token)
        response: Response = await call_next(request)
        return response
