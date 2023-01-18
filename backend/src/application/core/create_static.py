"""Настройка каталогов статичных файлов"""
import os

ROOT_PATH = os.path.dirname(os.path.dirname(__file__))
APPLICATION_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC_FILE = 'static'
STATIC_FILE_PATH = os.path.join(ROOT_PATH, STATIC_FILE)

if not os.path.exists(STATIC_FILE_PATH):
    os.mkdir(STATIC_FILE)

PHOTO_PROFILE = 'profile_photo'
PHOTO_PROFILE_PATH = os.path.join(STATIC_FILE_PATH, PHOTO_PROFILE)

if not os.path.exists(PHOTO_PROFILE_PATH):
    os.mkdir(PHOTO_PROFILE_PATH)

_default = 'default.png'
_default_photo_path = os.path.join(PHOTO_PROFILE_PATH, _default)
DEFAULT_PROFILE_PHOTO = 'None'

if os.path.exists(_default_photo_path):
    DEFAULT_PROFILE_PHOTO = _default_photo_path

PHOTO_COMPANY = 'company_photo'
PHOTO_COMPANY_PATH = os.path.join(STATIC_FILE_PATH, PHOTO_COMPANY)

if not os.path.exists(PHOTO_COMPANY_PATH):
    os.mkdir(PHOTO_COMPANY_PATH)
