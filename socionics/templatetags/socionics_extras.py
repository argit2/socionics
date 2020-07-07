from django import template
from socionics import views

register = template.Library()

@register.filter
def addstr(arg1, arg2):
    """concatenate arg1 & arg2"""
    return str(arg1) + str(arg2)

@register.filter
def check_model_a(ie, dicho):
    views.check_model_a(ie, dicho)

@register.filter
def check_reinin(dicho):
    views.check_reinin(dicho)