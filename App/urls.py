from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('login', views.login, name='login'),
    path('register', views.register, name='register'),
    path('organizer_dashboard', views.organizer_dashboard, name='organizer_dashboard'),
    path('create_event', views.create_event, name='create_event'),
    path('my_event', views.my_event, name='my_event'),
]
 