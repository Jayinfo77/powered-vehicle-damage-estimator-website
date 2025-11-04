vehicle_data = {
    "toyota": {
        "models": ["innova", "corolla", "hilux", "rav4", "fortuner"],
        "damage_costs": {
            "window_broken": 5000,
            "scratch": 2000,
            "dent": 3500,
            "headlight_broken": 3000,
            "flat_tire": 1500,
            "mirror_broken": 2800,
            "bumper_dent": 5000,
            "totaled": 100000
        }
    },
    "honda": {
        "models": ["civic", "crv", "city", "wr-v", "accord"],
        "damage_costs": {
            "window_broken": 4500,
            "scratch": 1800,
            "dent": 3200,
            "headlight_broken": 2900,
            "flat_tire": 1400,
            "mirror_broken": 2600,
            "bumper_dent": 4800,
            "totaled": 95000
        }
    },
    "suzuki": {
        "models": ["swift", "cultus", "ertiga", "wagon_r", "ciaz"],
        "damage_costs": {
            "window_broken": 4200,
            "scratch": 1700,
            "dent": 3000,
            "headlight_broken": 2700,
            "flat_tire": 1300,
            "mirror_broken": 2500,
            "bumper_dent": 4600,
            "totaled": 90000
        }
    },
    "hyundai": {
        "models": ["tucson", "elantra", "creta", "sonata", "accent"],
        "damage_costs": {
            "window_broken": 4700,
            "scratch": 1900,
            "dent": 3300,
            "headlight_broken": 2800,
            "flat_tire": 1450,
            "mirror_broken": 2700,
            "bumper_dent": 4700,
            "totaled": 97000
        }
    },
    "mahindra": {
        "models": ["scorpio", "bolero", "xuv500", "thar", "marazzo"],
        "damage_costs": {
            "window_broken": 4800,
            "scratch": 2000,
            "dent": 3400,
            "headlight_broken": 2900,
            "flat_tire": 1500,
            "mirror_broken": 2750,
            "bumper_dent": 4900,
            "totaled": 98000
        }
    }
}

# Default cost values used when brand/model/damage_type not found
default_costs = {
    "window_broken": 4000,
    "scratch": 1500,
    "dent": 3000,
    "headlight_broken": 2500,
    "flat_tire": 1200,
    "mirror_broken": 2500,
    "bumper_dent": 4500,
    "totaled": 85000
}
