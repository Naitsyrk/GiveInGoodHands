from django.urls import path
from InGoodHandsApp import views


urlpatterns = [
    path('', views.LandingPageView.as_view(), name="index"),
    path('add_donation/', views.AddDonationView.as_view(), name="donation_add"),
    path('confirmation_donation/', views.ConfirmationDonation.as_view(), name="donation_confirmation"),
    path('login/', views.LoginView.as_view(), name="login"),
    path('sign_up/', views.RegisterView.as_view(), name="sign_up"),
    path('logout/', views.Logout.as_view(), name="logout"),
    path('profil/', views.UserDetails.as_view(), name="profil"),
]
