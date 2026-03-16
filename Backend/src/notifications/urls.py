from django.urls import path

from .views import (
    NotificationList,
    NotificationDetail,
    NotificationCreate,
    NotificationUpdate,
    NotificationDelete,
    NotificationInactivate,
)

urlpatterns = [
    path('', NotificationList.as_view()),
    path('create/', NotificationCreate.as_view()),
    path('<int:pk>/', NotificationDetail.as_view()),
    path('update/<int:pk>/', NotificationUpdate.as_view()),
    path('inactivate/<int:pk>/', NotificationInactivate.as_view()),
    path('delete/<int:pk>/', NotificationDelete.as_view()),
]
