<template>
  <v-card class="card-item">
    <v-card-title>
      <v-icon left style="color:#f00">report_problem</v-icon>
      <span class="title">Валидаторы</span>
    </v-card-title>
    <v-card-text class="headline font-weight-bold">
      <v-btn-toggle v-model="filter" class="toggle-filter">
        <v-btn value="all">
          Все
        </v-btn>
        <v-btn value="error">
          Отклонения
        </v-btn>
        <v-btn value="warning">
          Исключения
        </v-btn>
      </v-btn-toggle>
      <tree v-model="subject" v-bind:items="items" class="tree" style="overflow-x: auto" />
    </v-card-text>
  </v-card>
</template>

<script>

  import Tree from '../../Controls/Tree.vue';
  import Mixin from '../mixin';

  export default {
    name: 'Validators',
    components: {
      Tree
    },
    mixins: [Mixin],
    props: {
      subject: { type: String, default: '' }
    },
    data() {
      return {
        filter: 'error'
      };
    },
    computed: {
      items() {
        const result = [];
        // Строим дерево валидаторов
        const expandItem = (expitem) => {
          let node = result;
          const stack = [];
          // Разбираем ключ
          expitem.id.split('.').map((partKey, index, arr) => {
            const key = arr.slice(0, index + 1).join('.');
            let item = node.find((element) => element.key === key);
            if (!item) {
              node.push(
                item = {
                  title: partKey,
                  key,
                  icon: 'check',
                  iconStyle: 'color:#1B5E20',
                  items: [],
                  parent: node,
                  countProblems: 0,
                  countExceptions: 0,
                  count: 0
                }
              );
            }
            stack.push(item);
            if (arr.length - 1 === index) {
              item.link = expitem.link;
              item.title = expitem.title || partKey;
            }
            node = item.items;
          });
          // Разбираем отклонения
          let countProblems = 0;
          let countExceptions = 0;
          (expitem.items || []).map((item) => {
            const problem = {
              title: item.title || item.uid,
              key: item.uid,
              icon: 'error',
              iconStyle: 'color:#F00',
              items: [],
              link: `/problems/${item.uid}`,
              selected: this.subject === item.uid
            };

            if(this.exceptions[item.uid]) {
              problem.icon = 'warning';
              problem.iconStyle = 'color:#FF6F00';
              countExceptions++;
            } else countProblems++;

            if (
              (this.filter === 'error' && problem.icon !== 'error')
              || (this.filter === 'warning' && problem.icon !== 'warning')
            ) return;

            // Если отклонение выбрано (как параметр в URL) открываем дерево до него
            problem.selected && stack.forEach((item) => item.expand = true);

            node.push(problem);
          });
          // Всегда раскрываем первый уровень дерева
          stack[0].expand = true; 
          // Обходим дерево до корня
          stack.forEach((item) => { 
            // Индексируем счетчики проблем
            item.countProblems += countProblems; 
            item.countExceptions += countExceptions;
            switch (this.filter) {
              case 'error': item.count += countProblems; break;
              case 'warning': item.count += countExceptions; break;
              default: item.count += countProblems + countExceptions;
            }
          
            if (item.countProblems) {
              item.icon = 'error';
              item.iconStyle = 'color:#F00';
            } else if (item.countExceptions) {
              item.icon = 'warning';
              item.iconStyle = 'color:#FF6F00';
            }
          });
        };
        this.problems.map((item) => expandItem(item));

        // Сортируем дерево отклонений
        const sort = (items) => {
          items.sort((item1, item2) => {
            if (!item1.items.length && item2.items.length > 0) return 1;
            else if (item1.items.length > 0 && !item2.items.length) return -1;
            else if (item1.icon === 'error' && item2.icon === 'warning') return -1;
            else if (item2.icon === 'error' && item1.icon === 'warning') return 1;
            return 0;
          });
          items.map((item) => item.items.length && sort(item.items));
        };
        sort(result);

        return result;
      }    
    }
  };
</script>

<style scoped>
  .card-item {
    width: 100%;
    margin-top: 12px;
  }

  .source-list-item {
    font-stretch: normal;
    font-size: 16px;
    font-weight: 300;
  }

  .toggle-filter * {
    height: 24px !important;
  }

  .tree {
    overflow: auto;
    white-space: nowrap !important;
  }

</style>
