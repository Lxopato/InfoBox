<template>
    <div v-if="entity_label">
        <img v-bind:src="this.entity_image" align="center" class="image-container">
        <div class="table_infobox">
            <table align="center" class="table table-bordered table-striped" style="margin-top: 25px;max-width: 500px" >
                <col>
                <col>
                <thead>
                <th></th>
                <th class="infobox-header">{{this.entity_label}}</th>
                <br>
                </thead>
                <tbody>
                <tr v-if="entity_description">
                    <th>Description:</th>
                    <td>{{this.entity_description}}</td>
                </tr>
                <tr v-for="data in info_box">
                    <th> {{data.label}}</th>
                    <td>{{data.values}}</td>
                </tr>
                </tbody>
            </table>
        </div>

        <div class="infobox_source_code">
            <br>
            Wikipedia's Infobox Source Code
            <br>
            <br>
            <textarea rows="50" cols="80" readonly>
                {{infobox_source_code}}
            </textarea>
        </div>

    </div>
</template>

<script>
    import {_} from 'vue-underscore';

    export default {
        name: "Infobox",
        props: {
          id: {
              type: String,
              required: true,
              note: "Wikimedia's entity id"
          } ,
          lang: {
              type: String,
              required: true,
              note: "Language of the query"
          }  ,
          strat:{
              type: String,
              required: true,
              note: "Strategy of the query"
          }
        },
        mounted: function () {
            this.generateInfobox();
        },
        data () {
            return {
                alerts: [],
                data_flag: false,
                entity_description: undefined,
                entity_label: undefined,
                entity_image: undefined,
                response: undefined,
                info_box: undefined,
                columns:[
                    {
                      name: "Label"
                    },
                    {
                      name: "Value"
                    }
                ],
                infobox_features: {
                    'en': {
                        infobox: 'Infobox',
                        name: 'name',
                        title: 'title',
                        image: 'image',
                        subheader: 'subheader',
                        label: 'label',
                        data: 'data'
                    },
                    'es': {
                        infobox:'Ficha',
                        name: 'nombre',
                        title: 'titulo',
                        image: 'imagen',
                        subheader: 'subtitulo',
                        label: 'etiqueta',
                        data: 'datos',
                    },
                    'it': {
                        infobox: 'Infobox',
                        name: 'NomeTemplate',
                        title: 'TitoloInt',
                        image: 'Immagine',
                        subheader: 'SottoTitolo',
                        label: 'Nome',
                        data: 'Valore',
                    },
                }
            }
        },
        computed: {

        },
        methods: {
          generateInfobox(){
              this.$http.get('http://localhost:8000/entity?id='+ this.id + '&lang=' + this.lang + '&strategy=' + this.strat, {
                  credentials: false,
              }).
              then(function (response){
                  if(response.data.length !== 0){
                      this.alerts = [];
                      this.data_flag = true;
                      this.entity_label = response.data.label;
                      if('description' in response.data){
                          this.entity_description = response.data.description;
                      }
                      if('image' in response.data){
                          this.entity_image = response.data.image;
                      }

                      this.info_box = _.sortBy(this.group_properties(response.data.properties), 'prop_id');
                      this.response = response
                      this.infobox_source_code = this.generate_source_code(response.data.properties)

                  }
              }, function (err) {
                  this.addAlert("There was an error processing the query!");
              })
          },
            group_properties: function(prop){
                var mapping = {};
                for(var i = 0; i<= prop.length -1; i++){
                    if (prop[i].prop.value in mapping) {
                        mapping[prop[i].prop.value].values += (', ' + prop[i].valLabel.value);
                    }
                    else {
                        mapping[prop[i].prop.value] = {
                            "label" : prop[i].pLabel.value,
                            "values" : prop[i].valLabel.value,
                            "index" : i
                        };
                    }
                }
                return _.values(mapping);
                },
            generate_source_code: function (prop) {
                var mapping = {};
                var image = this.check_image(this.entity_image);
                var text = `\n{{${this.infobox_features[this.lang].infobox}\n|${this.infobox_features[this.lang].name} = {{subst:PAGENAME}}\n|${this.infobox_features[this.lang].title} = {{subst:PAGENAME}} \n|${this.infobox_features[this.lang].subheader} = ${this.entity_description}\n${image}`;
                for(var i = 0; i<= prop.length -1; i++){
                    if (!(prop[i].prop.value in mapping) && (prop[i].prop.value !== "http://www.wikidata.org/prop/direct/P31")) {
                        mapping[prop[i].prop.value] = {
                            "label" : prop[i].pLabel.value,
                            "id" : prop[i].prop.value.split('/').slice(-1)[0],
                            "index" : i
                        };
                    }
                }
                var count= 1;
                for(var k in mapping){
                    text += `|${this.infobox_features[this.lang].label}${count} = ${mapping[k].label}\n|${this.infobox_features[this.lang].data}${count} = {{#invoke:Wikidata|getValue|${mapping[k].id}|FETCH_WIKIDATA}} \n`;
                    count ++;
                }
                text += '}}';
                return text
            },
            check_image: function (image) {
                if (image){
                    let file = image.split('/').slice(-1)[0];
                    let img_name = file.replace('%20', " ").replace(".jpg", '');
                    return `|${this.infobox_features[this.lang].image} = [[File:${file}|200px|alt={{${img_name}}}]]\n`;
                }
                return ''
            }
          }
        }

</script>

<style scoped>
    .entity-image {
        display: block;
        margin-left: auto;
        margin-right: auto;
        width: 200px;
    }
    .infobox{

    }
    th.infobox-header{
        text-align: center;
    }
    img.image-container {
        max-height: 200px;
        display: block;
        margin: 0 auto;
    }
    table {
        font-family: arial, sans-serif;
        border-collapse: collapse;
        width: 100%;
    }

    td, th {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
    }

    tr:nth-child(even) {
        background-color: #dddddd;
    }
    .table_infobox {
        width: 50%;
        float: left;
    }

    .infobox_source_code{
        width: 50%;
        float: right;
    }
</style>