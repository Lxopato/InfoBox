<template>
    <div>
    <div class="form">
        <h1>Wikipedia Infobox Generator</h1>
        <h4>Select Language and Strategy</h4>
        <form>
            <label>Language: </label>
            <select v-model="language">
                <option v-for="language in languages" v-bind:key="language.value">
                    {{language.value}}
                </option>
            </select>
            <br/>
            <label>Strategy: </label>
            <select v-model="strategy">
                <option v-for="strategy in strategies" v-bind:key="strategy.val">
                    {{strategy.val}}
                </option>
            </select>
        </form>
        <br/>
    </div>
    <div>
        <br>
        <h4>Search Entity in the Selected Language</h4>
        <cool-select
            v-model="selected"
            :items="items"
            item-text="id"
            placeholder="Enter entity name"
            disable-filtering-by-search
            @search="onSearch"
            >
            <template slot="no-data">
                {{noData ? "No information found by request":"No entity queried"}}
            </template>
            <template slot="item" slot-scope="{ item }">
                <div style="display: flex; align-items: center;">
                    <div>
                        <span class="item-name"> {{ item.match.text }} ({{ item.id}}) </span><br />
                        <span class="item-domain"> {{ item.description }} </span>
                    </div>
                </div>

            </template>
        </cool-select>
        <br>
        <br>
        </div>
        <div v-if="selected">
            <Infobox
                    :lang= "language"
                    :strat= "strategy"
                    :id="selected.id.substr(1)">

            </Infobox>
        </div>
    </div>
</template>

<script>
    import {CoolSelect} from 'vue-cool-select';
    import Infobox from  './Infobox.vue';
    export default {
        name: "Searcher",
        components: {CoolSelect, Infobox},
        data() {
            return {
                language: 'en',
                languages: [
                    {text: 'English', value: 'en' },
                    {text: 'Español', value: 'es' },
                    {text: 'Italiano', value: 'it' },
                    {text: 'Frances', value: 'fr' },


                ],
                strategy: 'sum',
                strategies: [
                    {val: "baseline"},
                    {val: "frequency"},
                    {val: "pagerank"},
                    {val: "multiplicative"},
                    {val: "sum"}
                ],
                selected: null,
                items: [],
                timeoutId: null,
                noData: false,
            }
        },
        methods: {
            onSearch: function (search) {
                const lettersLimit = 1;
                this.noData = false;
                if(search.length < lettersLimit){
                    this.items = [];
                    return;
                }
                this.$http.jsonp(`https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&search=${search}&language=${this.language}&props=`,
                    {
                        headers:{
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTIONS, DELETE',
                            'Access-Control-Allow-Headers': 'Access-Control-Allow-Methods, Access-Control-Allow-Origin, Origin, Accept, Content-Type',
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        credentials: true,
                    })
                    .then(response => {
                        this.items = response.body.search;
                        if (!this.items.length) this.noData = true;

                    })
            },
        },
    }
</script>

<style scoped>
    .item-name {
        font-size: 20px;
    }
    .item-domain {
        color: grey;
    }
</style>