import os

class Config:
    SQLALCHEMY_DATABASE_URI = "sqlite:///sentinel.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = "sentinel-secret"
