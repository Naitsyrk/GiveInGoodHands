from django.shortcuts import render, redirect
from django.views import View

# Create your views here.
from .models import Donation
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate, logout


class LandingPageView(View):
    def get(self, request):
        logged_user = request.user

        donations = Donation.objects.all()
        donated_bags_num = 0
        for donation in donations:
            donated_bags_num += donation.quantity
        donated_institutions = []
        for donation in donations:
            if donation.institution in donated_institutions:
                pass
            else:
                donated_institutions.append(donation.institution)
        ctx = {
                'donated_bags_num': donated_bags_num,
                "donated_institutions_num": len(donated_institutions)
        }
        if logged_user.is_authenticated:
            ctx['logged_user'] = logged_user
        return render(
            request,
            'index.html',
            ctx
        )


class AddDonationView(View):
    def get(self, request):
        logged_user = request.user
        if logged_user.is_authenticated:
            return render(request, 'form.html', {"logged_user": logged_user})
        else:
            return redirect('/login/#login')


class LoginView(View):
    def get(self, request):
        return render(request, 'login.html')

    def post(self, request):
        username = request.POST.get('email')
        password = request.POST.get('password')
        user = authenticate(username=username, password=password)
        if user is None:
            return redirect("/sign_up/#sign-up")
        else:
            login(request, user)
            return redirect("/")


class RegisterView(View):

    def get(self, request):
        logged_user = request.user
        ctx = {}
        if logged_user.is_authenticated:
            ctx['logged_user'] = logged_user
        return render(request, 'register.html', ctx)

    def post(self, request):
        username = request.POST.get('email')
        password = request.POST.get('password')
        first_name = request.POST.get('name')
        last_name = request.POST.get('surname')
        mail = request.POST.get('email')
        User.objects.create_user(username=username, password=password, first_name=first_name, last_name=last_name, email=mail)
        return redirect('/login/#login')


class Logout(View):
    def get(self, request):
        logout(request)
        return redirect("/")
