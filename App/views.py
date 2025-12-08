from django.shortcuts import render, redirect

def index(request):
    return render(request, 'index.html')

def login(request):
    return render(request, 'login.html')

def register(request):
    return render(request, 'signup.html')

def organizer_dashboard(request):
    return render(request, 'organizer_dashboard.html')

def create_event(request):
    return render(request, 'create_event.html')