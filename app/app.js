const exercices = {
    squat: { 
        name: 'Squat',
        rm: 0,
        tm: 0
    },
    bench: {
        name: 'Bench',
        rm: 0,
        tm: 0
    },
    deadlift: {
        name: 'Deadlift',
        rm: 0,
        tm: 0 
    },
    overheadPress: {
        name: 'OHP',
        rm: 0,
        tm: 0 
    }
};

const variationsPrograms = {
    boringButBig: {
        assistancesExercices: {
            squat: {
                first: 'Squat',
                second: 'Abs'
            },
            bench: {
                first: 'Bench',
                second: 'Chin up',
                third: 'Dips'
            },
            deadlift: {
                first: 'Deadlift',
                second: 'Abs'
            },
            overheadPress: {
                first: 'OHP',
                second: 'T-bar'
            },
        },
        setsAssistances: {
            first: [
                { tm: 0.50, reps: 10 },
                { tm: 0.50, reps: 10 },
                { tm: 0.50, reps: 10 },
                { tm: 0.50, reps: 10 },
                { tm: 0.50, reps: 10 }
            ],
            second: {
                reps: 10,
                sets: 5
            },
            third: {
                reps: 10,
                sets: 5
            }
        }
    },
    triumvirate: {
        assistancesExercices: {
            squat: {
                first: 'Legs press',
                second: 'Legs curl'
            },
            bench: {
                first: 'Inclined dumbells press',
                second: 'T-bar'
            },
            deadlift: {
                first: 'Good morning',
                second: 'leg extension'
            },
            overheadPress: {
                first: 'Dips',
                second: 'Chin up'
            },
        },
        setsAssistances: {
            first: [
                { reps: 15, sets: 5 }
            ],
            second: {
                reps: 10,
                sets: 5
            }
        }
    }
}

const cycle = {
    microCycle1: [
        { tm: 0.65, reps: 5 },
        { tm: 0.75, reps: 5 },
        { tm: 0.85, reps: 5 }
    ],
    microCycle2: [
        { tm: 0.70, reps: 3 },
        { tm: 0.80, reps: 3 },
        { tm: 0.90, reps: 3 }
    ],
    microCycle3: [
        { tm: 0.75, reps: 5 },
        { tm: 0.85, reps: 3 },
        { tm: 0.95, reps: 1 }
    ],
    microCycle4: [
        { tm: 0.40, reps: 5 },
        { tm: 0.50, reps: 5 },
        { tm: 0.60, reps: 5 }
    ]
};

Vue.component('primary-exercice-item', {
    props: ['element', 'repetionmax', 'trainingmax', 'roundvalue', 'unit'],
    template: `
        <div class="table__row">
            <p class="table__cell--quart">{{ element.name }}</p>

            <div class="table__cell--third input-container is-rm">
                <input type="number" v-bind:value="roundvalue(element.rm)" v-on:change="trainingmax($event, element)">
                <span class="unit-input">{{ unit }}</span>
            </div>

            <div class="table__cell--third input-container is-tm">
                <input type="number" v-bind:value="roundvalue(element.tm)" v-on:change="repetionmax($event, element)">
                <span class="unit-input">{{ unit }}</span>
            </div>
        </div>
    `
})

Vue.component('row-set-item', {
    props: {
        set: Object,
        sets: Array,
        index: Number,
        exercice: Object,
        isprimaryexercice: Boolean,
        unit: String
    },
    template: `
        <div v-if="typeof sets[index].tm !== 'undefined'" class="table__row table__row--set">
            <span class="item-number">{{ index + 1 }}</span>
            <p><span class="repet-number"> {{set.reps}} {{ isprimaryexercice && sets.length - 1 === index ? '+' : null }} </span> @ <span class="weight-item">{{ Math.ceil( ((exercice.tm) * (set.tm)) * 4) / 4 }}</span> {{ unit }}</p>   
        </div>
        <div v-else class="table__row table__row--set table__row--set--lastAssistance">
            <p>{{ sets[index].sets }} sets of {{ sets[index].reps }} reps</p>
        </div>
    `
})

Vue.component('progression-list', {
    props: ['unit', 'roundvalue'],
    template: `
        <ul>
            <li>- After a cycle, increase your TM by {{unit === 'lb' ? 5 : 2.5}} {{unit}} for Bench and OHP</li>
            <li>- After a cycle, increase your TM by {{unit === 'lb' ? 10 : 5}} {{unit}} for Squat and Deadlift</li>
        </ul>
    `
})

const app = new Vue({
    el: "#app",
    data: {
        exercices: exercices,
        variationsPrograms: variationsPrograms,
        currentVariation: variationsPrograms.boringButBig,
        currentVariationValue: "boringButBig",
        cycle: cycle,
        unit: "kg",
        microCycle: cycle.microCycle1,
        currentMicroCycle: "microCycle1",
        trainingMaxPercentageForAssistance: 0.50
    },
    methods: {
        calculateTrainingMax: function(e, item) {
            const repetitionMax = e.target.value;
            const trainingMax = repetitionMax * 0.9;
            item.tm = parseInt(trainingMax);
            item.rm = parseInt(repetitionMax);
        },
        calculateRepetitionMax: function(e, item) {
            const trainingMax = e.target.value;
            const repetitionMax = trainingMax / 0.9;
            item.rm = parseInt(repetitionMax);
            item.tm = parseInt(trainingMax);
        },
        weightConverter(e) {
            if (e.target.value === 'lb') {
                for (let key in this.exercices) {
                    const rmKgWeight = this.exercices[key].rm / 0.45359237;
                    const tmKgWeight = this.exercices[key].tm / 0.45359237;
                    this.exercices[key].rm = rmKgWeight
                    this.exercices[key].tm = tmKgWeight
                }
            } else {
                for (let key in this.exercices) {
                    const rmLbWeight = this.exercices[key].rm * 0.45359237;
                    const tmLbWeight = this.exercices[key].tm * 0.45359237;
                    this.exercices[key].rm = rmLbWeight
                    this.exercices[key].tm = tmLbWeight
                }
            }
        },
        updateMicroCycle: function(e) {
            this.microCycle = this.cycle[e.target.value];
            this.currentMicroCycle = e.target.value;
        },
        updateVariationProgram(e) {
            this.currentVariation = this.variationsPrograms[e.target.value];
            this.currentVariationValue = e.target.value;
        },

        addWeight: function() {
            const isKgUnit = this.unit === "kg" ? true : false;
            const bigIncrease = isKgUnit ? 5 : 10;
            let smallIncrease = isKgUnit ? 2.5 : 5;
            for (let key in this.exercices) {
                if(this.exercices[key].name === 'Bench' || this.exercices[key].name === 'OHP') {
                    this.exercices[key].tm += smallIncrease;
                } else {
                    this.exercices[key].tm += bigIncrease
                }
                this.exercices[key].rm = this.exercices[key].tm / 0.9
            }
        },
        toggleClass: function(e) {
            e.target.classList.toggle('active');
            e.target.nextElementSibling.classList.toggle('table__content--hide');
        },
        roundUpToNearestQuarter: function(value) {
            return Math.ceil(value * 4) / 4;
        }
    },
    mounted: function() {
        if (localStorage.getItem('exercices')) { 
            this.exercices = JSON.parse(localStorage.getItem('exercices'));
        }

        if (localStorage.getItem('unit')) {
            this.unit = JSON.parse(localStorage.getItem('unit'));
        }

        if (localStorage.getItem('microCycle')) {
            this.microCycle = JSON.parse(localStorage.getItem('microCycle'));
        }

        if (localStorage.getItem('currentMicroCycle')) {
            this.currentMicroCycle = JSON.parse(localStorage.getItem('currentMicroCycle'));
        }

        if (localStorage.getItem('currentVariationValue')) {
            this.currentVariationValue = JSON.parse(localStorage.getItem('currentVariationValue'));
        }

        if (localStorage.getItem('currentVariation')) {
            this.currentVariation = JSON.parse(localStorage.getItem('currentVariation'));
        }
    },
    watch: {
        exercices: {
            handler() {
                localStorage.setItem('exercices', JSON.stringify(this.exercices));
            },
            deep: true
        },
        unit: function() {
            localStorage.setItem('unit', JSON.stringify(this.unit));
        },
        currentVariationValue: function() {
            localStorage.setItem('currentVariationValue', JSON.stringify(this.currentVariationValue));
        },
        currentVariation: function() {
            localStorage.setItem('currentVariation', JSON.stringify(this.currentVariation));
        },
        microCycle: function() {
            localStorage.setItem('microCycle', JSON.stringify(this.microCycle));
        },
        currentMicroCycle: function() {
            localStorage.setItem('currentMicroCycle', JSON.stringify(this.currentMicroCycle));
        }
    }
});