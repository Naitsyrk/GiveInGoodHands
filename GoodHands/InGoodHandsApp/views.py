from django.shortcuts import render, redirect
from django.views import View

# Create your views here.
from .models import Donation, Institution, Category
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
        foundations = Institution.objects.filter(type="FA")
        non_governmental_organization = Institution.objects.filter(type="OP")
        local_collection = Institution.objects.filter(type="ZL")
        ctx = {
            'donated_bags_num': donated_bags_num,
            "donated_institutions_num": len(donated_institutions),
            "foundations": foundations,
            "non_governmental_organization": non_governmental_organization,
            "local_collection": local_collection,
        }
        if logged_user.is_authenticated:
            ctx['logged_user'] = logged_user
        if logged_user.is_superuser:
            ctx["superuser"] = logged_user
        return render(
            request,
            'index.html',
            ctx
        )


class AddDonationView(View):
    def get(self, request):
        logged_user = request.user
        if logged_user.is_authenticated:
            categories = Category.objects.all()
            institutions = Institution.objects.all()
            ctx = {
                "logged_user": logged_user,
                "categories": categories,
                "institutions": institutions
            }
            if logged_user.is_superuser:
                ctx["superuser"] = logged_user
            return render(request, 'form.html', ctx)
        else:
            return redirect('/login/#login')

    def post(self, request):
        logged_user = request.user
        categories = request.POST.get('categories')
        bags = request.POST.get('bags')
        organization = request.POST.get('organization')
        address = request.POST.get('address')
        city = request.POST.get('city')
        postcode = request.POST.get('postcode')
        phone = request.POST.get('phone')
        date = request.POST.get('data')
        time = request.POST.get('time')
        comment = request.POST.get('more_info')
        new_donation = Donation(quantity=bags,
                                address=address,
                                phone_number=phone,
                                city=city,
                                institution=Institution.objects.get(name=organization),
                                zip_code=postcode,
                                pick_up_date=date,
                                pick_up_time=time,
                                pick_up_comment=comment,
                                user=logged_user)
        new_donation.save()
        for category in categories:
            new_donation.categories.add(Category.objects.get(id=category))
        return redirect("donation_confirmation")


class ConfirmationDonation(View):
    def get(self, request):
        logged_user = request.user
        ctx = {
            "logged_user": logged_user,
        }
        if logged_user.is_superuser:
            ctx["superuser"] = logged_user
        return render(request, "form-confirmation.html", ctx)


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
            if logged_user.is_superuser:
                ctx["superuser"] = logged_user
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


class UserDetails(View):
    def get(self, request):
        logged_user = request.user
        ctx = {}
        if logged_user.is_authenticated:
            ctx['logged_user'] = logged_user
            user_donations = Donation.objects.filter(user=logged_user)
            ctx['donations'] = user_donations
            if logged_user.is_superuser:
                ctx["superuser"] = logged_user
            return render(request, 'profil.html', ctx)
        else:
            return redirect('/login/#login')