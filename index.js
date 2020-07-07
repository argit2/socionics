class TwoWayMap {
    constructor(m) {
       this.map = m;
       this.reverseMap = {};
       for(let key in this.map) {
          const value = this.map[key];
          this.reverseMap[value] = key;   
       }
    }
    get(key) { return this.map[key]; }
    revGet(key) { return this.reverseMap[key]; }
}

let elements = ["Ti", "Te", "Fi", "Fe", "Ni", "Ne", "Si", "Se"]

let types = {
    "LII" : ["Ti", "Ne", "Fi", "Se", "Fe", "Si", "Te", "Ni"],
    "ILE" : ["Ne", "Ti", "Se", "Fi", "Si", "Fe", "Ni", "Te"],
    "SEI" : ["Si", "Fe", "Ni", "Te", "Ne", "Ti", "Se", "Fi"],
    "ESE" : ["Fe", "Si", "Te", "Ni", "Ti", "Ne", "Fi", "Se"],
    "LSI" : ["Ti", "Se", "Fi", "Ne", "Fe", "Ni", "Te", "Si"],
    "SLE" : ["Se", "Ti", "Ne", "Fi", "Ni", "Fe", "Si", "Te"],
    "IEI" : ["Ni", "Fe", "Si", "Te", "Se", "Ti", "Ne", "Fi"],
    "EIE" : ["Fe", "Ni", "Te", "Si", "Ti", "Se", "Fi", "Ne"],
    "ILI" : ["Ni", "Te", "Si", "Fe", "Se", "Fi", "Ne", "Ti"],
    "LIE" : ["Te", "Ni", "Fe", "Si", "Fi", "Se", "Ti", "Ne"],
    "ESI" : ["Fi", "Se", "Ti", "Ne", "Te", "Ni", "Fe", "Si"],
    "SEE" : ["Se", "Fi", "Ne", "Ti", "Ni", "Te", "Si", "Fe"],
    "SLI" : ["Si", "Te", "Ni", "Fe", "Ne", "Fi", "Se", "Ti"],
    "LSE" : ["Te", "Si", "Fe", "Ni", "Fi", "Ne", "Ti", "Se"],
    "EII" : ["Fi", "Ne", "Ti", "Se", "Te", "Si", "Fe", "Ni"],
    "IEE" : ["Ne", "Fi", "Se", "Ti", "Si", "Te", "Ni", "Fe"]
};

let model_a = {
    "strong" : new Set([1, 2, 7, 8]),
    "valued" : new Set([1, 2, 5, 6])
};

let opposite_model_a = new TwoWayMap({
    "weak" : "strong",
    "devalued" : "valued"
});

let model_a_list = Object.entries(opposite_model_a.map);

let jungian = {
    "LII" : ["I", "N", "T", "j"],
    "ILE" : ["E", "N", "T", "p"],
    "SEI" : ["I", "S", "F", "p"],
    "ESE" : ["E", "S", "F", "j"],
    "LSI" : ["I", "S", "T", "j"],
    "SLE" : ["E", "S", "T", "p"],
    "IEI" : ["I", "N", "F", "p"],
    "EIE" : ["E", "N", "F", "j"],
    "ILI" : ["I", "N", "T", "p"],
    "LIE" : ["E", "N", "T", "j"],
    "ESI" : ["I", "S", "F", "j"],
    "SEE" : ["E", "S", "F", "p"],
    "SLI" : ["I", "S", "T", "p"],
    "LSE" : ["E", "S", "T", "j"],
    "EII" : ["I", "N", "F", "j"],
    "IEE" : ["E", "N", "F", "p"]
    };

let reinin = {
    "carefree" : "EN",
    "yielding" : "ET",
    "static" : "Ep",
    "democratic" : "NT",
    "tactical" : "Np",
    "constructivist" : "Tp",
    "positivist" : "ENT",
    "judicious" : "ENp",
    "subjectivist" : "ETp",
    "process" : "NTp",
    "asking" : "ENTp"
};

let opposite_reinin = new TwoWayMap({
    "farsighted" : "carefree",
    "obstinate" : "yielding",
    "dynamic" : "static",
    "aristocratic" : "democratic",
    "strategic" : "tactical",
    "emotivist" : "constructivist",
    "negativist" : "positivist",
    "decisive" : "judicious",
    "objectivist" : "subjectivist",
    "result" : "process",
    "declaring" : "asking"
});

let reinin_list = Object.entries(opposite_reinin.map);

let opposite_keyword = {
    "E" : "I",
    "I" : "E",
    "N" : "S",
    "S" : "N",
    "T" : "F",
    "F" : "T",
    "p" : "j",
    "j" : "p"
}

let checked_reinin = {...opposite_reinin.map, ...opposite_reinin.reverseMap}
for (let c in checked_reinin) {
    checked_reinin[c] = false
}
let checked_model_a = {}
    for (e of elements){
        checked_model_a[e] = {...opposite_model_a.map, ...opposite_model_a.reverseMap}
        for (let dicho in checked_model_a[e]) {
            checked_model_a[e][dicho] = false
        }
}
    

let get_IE_from_indexes = (l, type) => {
    let inf_elements = types[type]
    return [...l].map((x) => inf_elements[x - 1])
}
    
let get_reinin_keyword = (dicho) => {

    let has_reinin_keyword = true
    if (!(dicho in reinin)) {
        dicho = opposite_reinin.map[dicho]
        has_reinin_keyword = false
    }
    return [reinin[dicho], has_reinin_keyword]
}

let is_reinin = (keyword, t, has_keyword = true) => {

    if (!(typeof keyword === 'string' || keyword instanceof String))
    {
        return false;
    }
    // grabs keyword corresponding to dichotomy
    if (keyword.length > 4) {
        [keyword, has_keyword] = get_reinin_keyword(keyword)
    }
    // else, always true
    else {
        has_keyword = true
    }
    let first = keyword[0]
    let second = keyword[1]
    let jung = jungian[t]
    if (t == 'LII') console.log(jung, keyword)
    if (keyword.length == 2) {
        if (! has_keyword)
        {
            return ! (jung.includes(first) == jung.includes(second))
        }
        return (jung.includes(first) == jung.includes(second))
    }
    // n == 3 or n == 4
    else {
        let last = keyword[keyword.length - 1]
        if (! has_keyword)
        {
            return ! (is_reinin(keyword.slice(0, keyword.length - 1), t) == jung.includes(last))
        }
        return (is_reinin(keyword.slice(0, keyword.length - 1), t) == jung.includes(last))
    }
}
    

let score_reinin = (scores) => {
    for (let t in scores)
    {

        for (let dicho in checked_reinin)
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

    if (dicho in model_a) {
        return model_a[dicho]
    }
    set = new Set([1, 2, 3, 4, 5, 6, 7, 8])
    opposite_name = opposite_model_a.map[dicho]
    opposite = model_a[opposite_name]
    return  new Set([...set].filter(x => !opposite.has(x)));
}

let is_model_a_dicho = (dicho, t, information_element) => {

    if (typeof dicho === 'string' || dicho instanceof String)
    {
        dicho = get_model_a_dicho(dicho)
    }
    let inf_elements = get_IE_from_indexes(dicho, t)
    return (inf_elements.includes(information_element))
}

let score_model_a = (scores) => {

    for (let t in scores) {
        for (let e in checked_model_a) {
            for (let dicho in checked_model_a[e]) {
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
    var items = Object.keys(scores).map(function(key) {
        return [key, scores[key]];
      });
    
    // sort
    items.sort(function(first, second) {
        return second[1] - first[1];
      });
    return items
}


var app = new Vue ({
        el : '#app',
        data : {
            elements: elements,
            types : types,
            model_a : model_a,
            opposite_model_a : opposite_model_a,
            model_a_list : model_a_list,
            jungian : jungian, 
            reinin : reinin,
            opposite_reinin : opposite_reinin,
            reinin_list : reinin_list,
            opposite_keyword : opposite_keyword,
            checked_reinin : checked_reinin,
            checked_model_a : checked_model_a,
            score : ''
        },
        methods : {
            get_IE_from_indexes : get_IE_from_indexes,
            get_reinin_keyword : get_reinin_keyword,
            is_reinin : is_reinin,
            score_reinin : score_reinin,
            get_model_a_dicho : get_model_a_dicho,
            is_model_a_dicho : is_model_a_dicho,
            score_model_a : score_model_a,
            get_scores : get_scores,
            updateScore () {
                this.score = get_scores() 
                return this.score
            },
            check_reinin (dicho) {

                checked_reinin[dicho] = true
                let opposite
                if (dicho in opposite_reinin.map) {
                    opposite = opposite_reinin.map[dicho]
                }
                else {
                    opposite = opposite_reinin.reverseMap[dicho]
                }
                checked_reinin[opposite] = false
                this.updateScore()
            },
            
            check_model_a (ie, dicho) {
            
                checked_model_a[ie][dicho] = true
                let opposite = opposite_model_a.revGet(dicho)
                checked_model_a[ie][opposite] = false
                this.updateScore()
            }
        }
    });