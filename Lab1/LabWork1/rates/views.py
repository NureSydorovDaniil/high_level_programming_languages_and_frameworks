from django.shortcuts import render, redirect
from .models import Currency
from .forms import CurrencyForm

def index(request):
    currencies = Currency.objects.all()
    form = CurrencyForm()

    if request.method == "POST":
        form = CurrencyForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('/')

    return render(request, 'index.html', {
        'currencies': currencies,
        'form': form
    })