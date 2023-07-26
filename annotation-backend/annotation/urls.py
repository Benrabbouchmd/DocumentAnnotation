from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AnnotationViewSet

router = DefaultRouter()
router.register('annotation', AnnotationViewSet, basename='annotation')

urlpatterns = [
    path('', include(router.urls)),
]
