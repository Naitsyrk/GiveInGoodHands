from django.urls import path
from InGoodHandsApp import views


urlpatterns = [
    path('', views.LandingPageView.as_view(), name="index"),
    path('add_donation/', views.AddDonationView.as_view(), name="index"),
    path('login/', views.LoginView.as_view(), name="index"),
    path('sign_up/', views.RegisterView.as_view(), name="index"),
]