<template>
  <div class="plantuml-place">
    <error-boundary
      v-bind:params="{error}"
      stop-propagation>
      <v-progress-circular
        v-if="isLoading"
        v-bind:size="64"
        v-bind:width="7"
        style="left: 50%; top: 50%; position: absolute; margin-left: -32px; margin-top: -32px;"
        v-bind:value="60"
        color="primary"
        indeterminate />
      <div
        v-else-if="render"
        class="plantuml-schema"
        v-bind:style="{cursor: cursor}"
        v-on:mousedown.prevent="onMouseDown"
        v-on:mousemove.prevent="onMouseMove"
        v-on:mouseup.prevent="onMouseUp"
        v-on:mouseleave.prevent="onMouseUp"
        v-on:wheel="proxyScrollEvent"
        v-on:contextmenu="showMenu"
        v-html="svg" />
      <v-menu
        v-model="menu.show"
        v-bind:position-x="menu.x"
        v-bind:position-y="menu.y"
        absolute
        offset-y>
        <v-list>
          <v-list-item
            v-for="(item, index) in menu.items"
            v-bind:key="index"
            link>
            <v-list-item-title
              v-on:click="item.on">
              {{ item.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </error-boundary>
  </div>
</template>

<script>
  import { ErrorBoundary } from '@/shared/ErrorBoundary/index';

  import plantUML from '../../helpers/plantuml';
  import href from '../../helpers/href';
  import copyToClipboard from '../../helpers/clipboard';
  import env from '@/helpers/env';

  const EVENT_COPY_SOURCE_TO_CLIPBOARD = 'copysource';

  export default {
    name: 'PlantUML',
    components: {
      ErrorBoundary
    },
    props: {
      uml: { type: String, default: '' },         // PlantUML диаграмма
      postrender: { type: Function, default: () => {} }, // POST обработчик
      sourceAvailable: { type: Boolean, default: false }
    },
    emits: [
      EVENT_COPY_SOURCE_TO_CLIPBOARD // Копирование источника данных
    ],
    data() {
      return {
        menu: { // Контекстное меню
          show: false,  // Признак отображения
          x : 0,  // Позиция x
          y : 0,  // Позиция y
          items: (() => {
            const result = [
              { title: 'Сохранить на диск', on: this.onDownload },
              { title: 'Копировать PlantUML', on: () => copyToClipboard(this.uml) }
            ];
            this.sourceAvailable && result.push({ title: 'Копировать JSON', on: () => this.$emit(EVENT_COPY_SOURCE_TO_CLIPBOARD) });
            return result;
          }).call()
        },
        render: true,
        error: null,
        rerenderTimer: null,
        svg: '',
        isLoading: true,
        svgEl: null,
        isShiftSens: false, // Признак, что пользователь нажал шифт
        isMove: false, // Признак перемещения схемы
        moveX: 0,
        moveY: 0,
        zoom: {
          value: 1,   // Текущий зум
          step: 0.1  // Шаг зума
        },
        cacheViewBox: null
      };
    },
    computed: {
      viewBox() {
        if (!this.svgEl) {
          return {
            x: 0,
            y : 0,
            width : 0,
            height : 0
          };
        } else
          return this.cacheViewBox ?
            this.cacheViewBox
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            : this.cacheViewBox = this.svgEl.viewBox.baseVal;
      },
      // Коэффициент преобразования реальных точек во внутренние по ширине
      koofScreenX() {
        return this.svgEl ? this.viewBox.width / this.svgEl.clientWidth : 1;
      },
      // Коэффициент преобразования реальных точек во внутренние по высоте
      koofScreenY() {
        return this.svgEl ? this.viewBox.height / this.svgEl.clientHeight : 1;
      },
      cursor() {
        return this.isShiftSens ? 'move' : undefined;
      }
    },
    watch: {
      uml() {
        this.reloadSVG();
      }
    },
    mounted() {
      window.addEventListener('resize', this.reRender);
      this.reloadSVG();
      let oldClientHeight = this.$el.clientHeight;
      new ResizeObserver(() => {
        if (oldClientHeight != this.$el.clientHeight) {
          this.doResize();
          oldClientHeight = this.$el.clientHeight;
        }
      }).observe(this.$el);
    },
    beforeDestroy(){
      window.removeEventListener('resize', this.reRender);
    },
    methods: {
      reRender() {
        if (this.rerenderTimer) clearTimeout(this.rerenderTimer);
        this.rerenderTimer = setTimeout(() => {
          this.render = false;
          this.$nextTick(() => {
            this.render = true;
            this.$nextTick(() => this.prepareSVG());
          });
        }, 300);
      },
      onMouseDown(event) {
        if (!event.shiftKey) return;
        this.isMove = true;
        this.moveX = event.clientX;
        this.moveY = event.clientY;
      },
      onMouseMove(event) {
        this.isShiftSens = event.shiftKey;
        if (!this.isMove) return;
        this.viewBox.x += (this.moveX - event.clientX) * (this.koofScreenX || 0);
        this.viewBox.y += (this.moveY - event.clientY) * (this.koofScreenY || 0);
        this.moveX = event.clientX;
        this.moveY = event.clientY;
      },
      onMouseUp() {
        this.isMove = false;
      },
      doZoom(value, x, y) {
        const kX = x / (this.svgEl.clientWidth || x);
        const kY = y / (this.svgEl.clientHeight || y);
        let resizeWidth = value * this.viewBox.width;
        let resizeHeight = value * this.viewBox.height;
        this.viewBox.x -= resizeWidth * kX;
        this.viewBox.width += resizeWidth;
        this.viewBox.y -= resizeHeight * kY;
        this.viewBox.height += resizeHeight;
        this.cacheViewBox = null;
      },
      proxyScrollEvent(event) {
        if (!event.shiftKey) return;
        let e = window.event || event;
        switch (Math.max(-1, Math.min(1, (e.deltaY || -e.detail)))) {
          case 1:
            this.doZoom(this.zoom.step, event.offsetX, event.offsetY);
            break;
          case -1:
            this.doZoom(-this.zoom.step, event.offsetX, event.offsetY);
            break;
        }
        event.stopPropagation();
      },
      doResize() {
        if (!this.svgEl || !this.svgEl.clientWidth || !this.svgEl.clientHeight) return;

        const originWidth = this.viewBox.width;

        if (this.$el.clientWidth > this.viewBox.width) {
          this.viewBox.width = this.$el.clientWidth;
        }

        const originalHeight = this.viewBox.height * (this.svgEl.clientWidth / this.viewBox.width);

        this.svgEl.style.height = originalHeight;

        if (originalHeight < this.$el.clientHeight) {
          const k = this.viewBox.height / originalHeight;
          this.svgEl.style.height = this.$el.clientHeight;
          this.viewBox.height = this.$el.clientHeight * k;
        }

        const offset = (this.viewBox.width - originWidth) / 2;
        this.viewBox.x -= offset;
      },
      prepareSVG() {
        this.svgEl = this.$el.querySelectorAll('svg')[0];
        this.cacheViewBox = null;
        if (this.svgEl) {
          this.svgEl.style = null;
          this.doResize();
          href.elProcessing(this.svgEl);
          if (this.postrender) this.postrender(this.svgEl);
        }
      },
      reloadSVG() {
        // Сбрасываем параметры зума
        this.zoom.value = 1;

        if (!this.uml) {
          this.svg = '';
          return;
        }

        if (this.error) {
          this.error = null;
        }

        this.isLoading = true;

        this.$nextTick(() => {
          const request = window.$PAPI?.settings?.render?.external === false
            ? window.$PAPI.renderPlantUML(this.uml)
            : plantUML.prepareRequest(this.uml);

          request.then((response) => {
            this.svg = response.data.toString();
            this.isLoading = false;
            this.$nextTick(() => this.prepareSVG());
          }).catch((error) => {
            if (error.response && error.response.status === 400) {
              this.$nextTick(() => this.prepareSVG());
            }

            this.error = error;
          }).finally(()=> {
            this.isLoading = false;
          });
        });
      },
      showMenu(event) {
        event.preventDefault();
        this.menu.show = false;
        this.menu.x = event.clientX;
        this.menu.y = event.clientY;
        this.$nextTick(() => {
          this.menu.show = true;
        });
      },
      // Сохранение SVG на диск
      onDownload() {
        if (env.isPlugin()) {
          window.$PAPI.download(
            // new XMLSerializer().serializeToString(this.svgEl),
            this.svg,
            'Сохранение диаграммы',
            'Выберите файл для сохранения диграммы'
          );
        } else {
          // const svgString = new XMLSerializer().serializeToString(this.svgEl);
          const svgString = this.svg;
          const svgDecoded = window.btoa(unescape(encodeURIComponent(svgString)));
          const svgUrl = `data:image/svg+xml;base64,${svgDecoded}`;

          const link = document.createElement('a');
          link.href = svgUrl;
          link.download = 'download.svg';
          document.body.appendChild(link);
          link.click();
          this.$nextTick(() => document.body.removeChild(link));
        }
      }
    }
  };
</script>

<style>

.plantuml-place {
}

.plantuml-schema {
  width: 100%;
}

.plantuml-schema svg {
  width: 100%;
  height: auto;
}

</style>
