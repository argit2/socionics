class TwoWayMap {
    constructor(map) {
       this.map = map;
       this.reverseMap = {};
       for(let key in map) {
          const value = map[key];
          this.reverseMap[value] = key;   
       }
    }
    get(key) { return this.map[key]; }
    revGet(key) { return this.reverseMap[key]; }
}


var app = new Vue (
    {

    }
)

let types = {
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
};

let model_a = {
    "strong" : Set([1, 2, 7, 8]),
    "valued" : Set([1, 2, 5, 6])
};

let opposite_model_a = TwoWayMap({
    "weak" : "strong",
    "devalued" : "valued"
});

let model_a_list = opposite_model_a.map(({x}) => [opposite_model_a[x], x]);

let jungian = {
    "LII" : Set(["I", "N", "T", "j"]),
    "ILE" : Set(["E", "N", "T", "p"]),
    "SEI" : Set(["I", "S", "F", "p"]),
    "ESE" : Set(["E", "S", "F", "j"]),
    "LSI" : Set(["I", "S", "T", "j"]),
    "SLE" : Set(["E", "S", "T", "p"]),
    "IEI" : Set(["I", "N", "F", "p"]),
    "EIE" : Set(["E", "N", "F", "j"]),
    "ILI" : Set(["I", "N", "T", "p"]),
    "LIE" : Set(["E", "N", "T", "j"]),
    "ESI" : Set(["I", "S", "F", "j"]),
    "SEE" : Set(["E", "S", "F", "p"]),
    "SLI" : Set(["I", "S", "T", "p"]),
    "LSE" : Set(["E", "S", "T", "j"]),
    "EII" : Set(["I", "N", "F", "j"]),
    "IEE" : Set(["E", "N", "F", "p"])
    };

let reinin = {
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
};

let opposite_reinin = TwoWayMap({
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
});

let reinin_list = opposite_reinin.map(({x}) => [opposite_reinin[x], x]);

let opposite_keyword = TwoWayMap({
    "E" : "I",
    "I" : "E",
    "N" : "S",
    "S" : "N",
    "T" : "F",
    "F" : "T",
    "P" : "J",
    "J" : "P"
})

let checked_reinin = {...opposite_reinin, ...opposite_reinin.reverseMap}
for (c of checked_reinin){

    checked_reinin[c] = False
}
let checked_model_a = {}
for (e of elements){

    checked_model_a[e] = {...opposite_model_a, ...opposite_model_a.reverseMap}
    for (dicho of checked_model_a[e]) {
        checked_model_a[e][dicho] = False
    }
}
    
let check_reinin = (dicho) => {

    checked_reinin[dicho] = True
    let opposite = opposite_reinin.revGet(dicho)
    checked_reinin[opposite] = False
}

let check_model_a = (ie, dicho) => {

    checked_model_a[ie][dicho] = True
    let opposite = opposite_model_a.revGet(dicho)
    checked_model_a[ie][opposite] = False
}

let get_IE_from_indexes = (l, type) => {
    let inf_elements = types[type]
    return l.map(({x}) => inf_elements[x - 1])
}
    
let get_reinin_keyword = (dicho) => {

    if (reinin.has(dicho)) {
        return reinin[dicho]
    }
    else {

        let opposite = reinin[opposite_reinin[dicho]]
        let keyword = opposite.map(({x}) => opposite_keyword[x]).join('')
        return keyword
    } 
}

let is_reinin = (keyword, t) => {

    n = keyword.length
    // accepts both "carefree" && "EN" as an input
    if (n > 3) {
        keyword = get_reinin_keyword(keyword)
    }
    if (n == 2) {

        let first = keyword[0]
        let second = keyword[1]
        return (jungian[t].has(first) && jungian[t].has(second)) ||
            (jungian[t].has(opposite_keyword[first]) && jungian[t].has(opposite_keyword[second]))
    }
    // n == 3
    else {
        return is_reinin(keyword.slice(0, 2)) && is_reinin(keyword[2])
    }
}
    

let score_reinin = (scores) => {

    for (t of scores)
    {

        for (dicho of checked_reinin)
        {

            if (checked_reinin[dicho] && is_reinin(dicho, t))
            {
                scores[t] += 1
            }
        }
    }
    return scores
}
    
let get_model_a_dicho = (dicho) => {

    if (model_a.has(dicho)) {
        return model_a[dicho]
    }
    return Set([1, 2, 3, 4, 5, 6, 7, 8]) - model_a[dicho]
}

let is_model_a_dicho = (dicho, t, information_element) => {

    if (dicho instanceof str)
    {
        dicho = get_model_a_dicho(dicho)
    }
    let inf_elements = get_IE_from_indexes(dicho, t)
    return (inf_elements.has(information_element))
}

let score_model_a = (scores) => {

    for (t of scores) {
        for (e of checked_model_a) {
            for (dicho of checked_model_a[e]) {
                if (checked_model_a[e][dicho] && is_model_a_dicho(dicho, t, e)) {
                    scores[t] += 1
                }
            }
        }
    }
    return scores
}
    
let get_scores = () => {
    let scores = {
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

    // to array
    var items = Object.keys(dict).map(function(key) {
        return [key, dict[key]];
      });
    
    // sort
    items.sort(function(first, second) {
        return second[1] - first[1];
      });
    return l
}