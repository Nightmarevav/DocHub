<template>
  <v-container grid-list-xl fluid>
    <v-layout wrap>
      <v-flex xs12 md9 d-flex>
        <radar v-model="technologies" v-bind:section="section" />
      </v-flex>
      <v-flex xs12 md3 d-flex>
        <v-layout wrap>
          <v-flex v-for="(legend, key) in legends" v-bind:key="key" xs4 md12 d-flex>
            <ul class="sections">
              <li class="section-header">
                {{ legend.section.title }}
                <ul class="section-record">
                  <li v-for="record in legend.items" v-bind:key="record.index">
                    <router-link
                      v-bind:to="`/technology/${record.item.key}`">
                      {{ record.index ? `${record.index}: `: '' }} {{ record.item.key }}
                    </router-link>
                  </li>
                </ul>
              </li>
            </ul>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import Radar from './Radar';

  export default {
    components:{
      Radar
    },
    props: {
      section: { type: String, default: '' }
    },
    data() {
      return {
        technologies: []
      };
    },
    computed: {
      legends() {
        const result = {};
        this.technologies.map((record) => {
          const section = record.item.section;
          !result[section.key] && (result[section.key] = {section, items: []});
          result[section.key].items.push(record);
        });
        return result;
      }
    },
    mounted() {
    },
    methods: {}
  };
</script>

<style scoped>
ul .section-header {
  margin-bottom: 16px;
}
ul.sections {
  list-style-type: none;
  font-weight: 700;
  font-size: 12px;
}
ul.sections li {
  margin-left: 0px;
}
ul.section-record {
  font-weight: 300;
  list-style-type: none;
  margin-top: 6px;
}
</style>
