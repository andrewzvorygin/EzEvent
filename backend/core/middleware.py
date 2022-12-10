from fastapi_csrf_protect import CsrfProtect
from pydantic import BaseModel

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware


class CsrfSettings(BaseModel):
    secret_key: str = 'asecrettoeverybody'


@CsrfProtect.load_config
def get_csrf_config():
    return CsrfSettings()


class CheckingCsrfToken(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.method in {'POST', 'PUT', 'DELETE'} and 'access_token' in request.cookies:
            csrf_protect = CsrfProtect()
            csrf_token = csrf_protect.get_csrf_from_headers(request.headers)
            csrf_protect.validate_csrf(csrf_token)
        response: Response = await call_next(request)
        return response
