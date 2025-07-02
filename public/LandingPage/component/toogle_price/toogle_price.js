
const global_toogle_price = {
    price: {
        select: "MONTH",
        option: {
            YEAR: "YEAR",
            MONTH: "MONTH",
        }
    },
    currency: {
        select: {
            key: "BOB",
            value: "Bs"
        },
        option: {
            BOB: "Bs",
            USD: "$us",
        }
    },
    types_pricing: {
        BOB: {
            price_startup: {
                year: 3802,
                month: 396
            },
            price_business: {
                year: 4723,
                month: 492
            },
            price_enterprice: {
                year: 8602,
                month: 896
            }
        },
        USD: {
            price_startup: {
                year: 547,
                month: 57
            },
            price_business: {
                year: 682,
                month: 71
            },
            price_enterprice: {
                year: 1238,
                month: 129
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    init()
    document.querySelector("#toogle_price").addEventListener('change', (e) => on_change_toogle_price(e))
    document.addEventListener('click', (e) => on_click_page(e));
});

// events handler

function on_change_toogle_price(e) {
    if (e.currentTarget.checked) {
        global_toogle_price.price.select = global_toogle_price.price.option.YEAR
        toogle_price(global_toogle_price.price.select)
        return
    }
    global_toogle_price.price.select = global_toogle_price.price.option.MONTH
    toogle_price(global_toogle_price.price.select)
}

function on_click_page(e) {
    const dropdown = document.getElementById('dropdown_price');
    const button = document.getElementById('dropdown_btn');
    if (!button.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.add('hidden');
    }
}

// functions

function init() {
    toogle_price(global_toogle_price.price.select)
}

function toogle_price(price) {
    const plans = global_toogle_price.types_pricing[global_toogle_price.currency.select.key]
    Object.entries(plans).forEach(([plan, value]) => {
        if (price == global_toogle_price.price.option.YEAR) {
            document.querySelector(`#${plan}_month_anual`).classList.add("line-through")
            document.querySelector(`#${plan}_month_anual`).textContent = `${value.month * 12} ${global_toogle_price.currency.select.value}/año`
            document.querySelector(`#${plan}`).textContent = `${value.year} ${global_toogle_price.currency.select.value}/año`
            document.querySelector("#plan_selected").textContent = "Plan anual"
            return
        }
        document.querySelector(`#${plan}_month_anual`).classList.remove("line-through")
        document.querySelector(`#${plan}_month_anual`).textContent = `${value.month * 12} ${global_toogle_price.currency.select.value}/año`
        document.querySelector(`#${plan}`).textContent = `${value.month} ${global_toogle_price.currency.select.value}/mes`
        document.querySelector("#plan_selected").textContent = "Plan mensual"
    });
}

function toggle_dropdown_price() {
    document.getElementById('dropdown_price').classList.toggle('hidden');
}

function select_option(flag_src, key, value) {
    document.getElementById('selected_flag').src = flag_src;
    document.getElementById('selected_text').textContent = key;
    document.getElementById('dropdown_price').classList.add('hidden');
    global_toogle_price.currency.select.key = key
    global_toogle_price.currency.select.value = value
    toogle_price(global_toogle_price.price.select)
}