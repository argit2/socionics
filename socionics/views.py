from django.shortcuts import render
from django.template import loader
from django.http import HttpResponse
from django import forms
from bidict import bidict

elements = ["Ti", "Te", "Fi", "Fe", "Ni", "Ne", "Si", "Se"]

types = {
    "LII" : ["Ti", "Ne", "Fi", "Se", "Fe", "Si", "Te", "Ni", ],
    "ILE" : ["Ne", "Ti", "Se", "Fi", "Si", "Fe", "Ni", "Te", ],
    "SEI" : ["Si", "Fe", "Ni", "Te", "Ne", "Ti", "Se", "Fi", ],
    "ESE" : ["Fe", "Si", "Te", "Ni", "Ti", "Ne", "Fi", "Se", ],
    "LSI" : ["Ti", "Se", "Fi", "Ne", "Fe", "Ni", "Te", "Si", ],
    "SLE" : ["Se", "Ti", "Ne", "Fi", "Ni", "Fe", "Si", "Te", ],
    "IEI" : ["Ni", "Fe", "Si", "Te", "Se", "Ti", "Ne", "Fi", ],
    "EIE" : ["Fe", "Ni", "Te", "Si", "Ti", "Se", "Fi", "Ne", ],
    "ILI" : ["Ni", "Te", "Si", "Fe", "Se", "Fi", "Ne", "Ti", ],
    "LIE" : ["Te", "Ni", "Fe", "Si", "Fi", "Se", "Ti", "Ne", ],
    "ESI" : ["Fi", "Se", "Ti", "Ne", "Te", "Ni", "Fe", "Si", ],
    "SEE" : ["Se", "Fi", "Ne", "Ti", "Ni", "Te", "Si", "Fe", ],
    "SLI" : ["Si", "Te", "Ni", "Fe", "Ne", "Fi", "Se", "Ti", ],
    "LSE" : ["Te", "Si", "Fe", "Ni", "Fi", "Ne", "Ti", "Se", ],
    "EII" : ["Fi", "Ne", "Ti", "Se", "Te", "Si", "Fe", "Ni", ],
    "IEE" : ["Ne", "Fi", "Se", "Ti", "Si", "Te", "Ni", "Fe", ]
    }

model_a = {
    "strong" : {1, 2, 7, 8},
    "valued" : {1, 2, 5, 6}
}

opposite_model_a = bidict({
    "weak" : "strong",
    "devalued" : "valued"
})

model_a_list = [[opposite_model_a[x], x] for x in opposite_model_a]

jungian = {
    "LII" : {"I", "N", "T", "j"},
    "ILE" : {"E", "N", "T", "p"},
    "SEI" : {"I", "S", "F", "p"},
    "ESE" : {"E", "S", "F", "j"},
    "LSI" : {"I", "S", "T", "j"},
    "SLE" : {"E", "S", "T", "p"},
    "IEI" : {"I", "N", "F", "p"},
    "EIE" : {"E", "N", "F", "j"},
    "ILI" : {"I", "N", "T", "p"},
    "LIE" : {"E", "N", "T", "j"},
    "ESI" : {"I", "S", "F", "j"},
    "SEE" : {"E", "S", "F", "p"},
    "SLI" : {"I", "S", "T", "p"},
    "LSE" : {"E", "S", "T", "j"},
    "EII" : {"I", "N", "F", "j"},
    "IEE" : {"E", "N", "F", "p"}
    }

reinin = {
    "carefree" : "EN",
    "obstinate" : "ET",
    "static" : "EP",
    "aristocratic" : "NT",
    "tactical" : "NP",
    "constructivist" : "TP",
    "positivist" : "ENT",
    "reasonable" : "ENP",
    "subjectivist" : "ETP",
    "process" : "NTP",
    "asking" : "ENTP"
}

opposite_reinin = bidict({
    "farsighted" : "carefree",
    "compliant" : "obstinate",
    "dynamic" : "static",
    "democratic" : "aristocratic",
    "strategic" : "tactical",
    "emotivist" : "constructivist",
    "negativist" : "positivist",
    "resolute" : "reasonable",
    "objectivist" : "subjectivist",
    "result" : "process",
    "declaring" : "asking"
})

reinin_list = [[opposite_reinin[x], x] for x in opposite_reinin]


opposite_keyword = bidict({
    "E" : "I",
    "I" : "E",
    "N" : "S",
    "S" : "N",
    "T" : "F",
    "F" : "T",
    "P" : "J",
    "J" : "P"
})
checked_reinin = {**opposite_reinin, **opposite_reinin.inverse}
for c in checked_reinin:
    checked_reinin[c] = False
checked_model_a = {}
for e in elements:
    checked_model_a[e] = {**opposite_model_a, **opposite_model_a.inverse}
    for dicho in checked_model_a[e]:
        checked_model_a[e][dicho] = False

def check_reinin(dicho):
    checked_reinin[dicho] = True
    opposite = opposite_reinin.inverse[dicho]
    checked_reinin[opposite] = False

def check_model_a(ie, dicho):
    checked_model_a[ie][dicho] = True
    opposite = opposite_model_a.inverse[dicho]
    checked_model_a[ie][opposite] = False

def apply(l, type):
    """
        get corresponding information elements from type
    """
    inf_elements = types[type]
    return [inf_elements[x - 1] for x in l]

def get_reinin_keyword(dicho):
    if dicho in reinin:
        return reinin[dicho]
    else:
        opposite = reinin[opposite_reinin[dicho]]
        keyword = ''.join([opposite_keyword[x] for x in opposite])
        return keyword

def is_reinin(keyword, t):
    if len(keyword) > 3: # accepts both "carefree" and "EN" as an input
        keyword = get_reinin_keyword(keyword)
    n = len(keyword)
    if n == 2:
        first = keyword[0]
        second = keyword[1]
        return (first in jungian[t] and second in jungian[t])\
               or (opposite_keyword[first] in jungian[t] and opposite_keyword[second] in jungian[t])
    else: # n == 3
        return is_reinin(keyword[0:2]) and is_reinin(keyword[2])


def score_reinin(scores):
    for t in scores:
        for dicho in checked_reinin:
            if checked_reinin[dicho] and is_reinin(dicho, t):
                scores[t] += 1
    return scores

def get_model_a_dicho(dicho):
    if dicho in model_a:
        return model_a[dicho]
    return {1, 2, 3, 4, 5, 6, 7, 8} - model_a[dicho]

def is_model_a_dicho(dicho, t, information_element):
    if isinstance(dicho, str):
        dicho = get_model_a_dicho(dicho)
    inf_elements = apply(dicho, t)
    return information_element in inf_elements

def score_model_a(scores):
    for t in scores:
        for e in checked_model_a:
            for dicho in checked_model_a[e]:
                if checked_model_a[e][dicho] and is_model_a_dicho(dicho, t, e):
                    scores[t] += 1
    return scores

def get_scores():
    scores = {
    "LII" : 0,
    "ILE" : 0,
    "SEI" : 0,
    "ESE" : 0,
    "LSI" : 0,
    "SLE" : 0,
    "IEI" : 0,
    "EIE" : 0,
    "ILI" : 0,
    "LIE" : 0,
    "ESI" : 0,
    "SEE" : 0,
    "SLI" : 0,
    "LSE" : 0,
    "EII" : 0,
    "IEE" : 0
    }
    scores = score_reinin(scores)
    scores = score_model_a(scores)
    l = [[k, v] for k, v in sorted(scores.items(), key=lambda item: item[1])]
    print(l)
    return l

def index(request):
    template = loader.get_template('socionics/index.html')
    context = {'model_a_list' : model_a_list, 'elements' : elements, 'reinin_list' : reinin_list, 'get_scores' : get_scores}
    
    return HttpResponse(template.render(context, request))