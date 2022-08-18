<template>
  <svg width="100%" style="max-height:90vh" viewBox="0 0 600 600">
    <defs>
      <path id="outsideTextPath" d="m0,300 a300,300 0 1,0 600,0 a300,300 0 1,0 -600,0" />
    </defs>
    <g style="opacity: 1; pointer-events: auto;">
      <circle
        v-for="(ring, index) in rings"
        v-bind:key="index"
        v-bind:class="`ring-arc-${index}`"
        cx="300"
        cy="300"
        v-bind:r="ring.r" />
    </g>
    <template v-if="isShowSections">
      <g v-for="(item, index) in sections" v-bind:key="index">
        <line
          x1="300"
          y1="300"
          v-bind:x2="item.line.x"
          v-bind:y2="item.line.y"
          class="section-line" />
        <text class="section-title" text-anchor="middle" v-on:click="onClickSection(item)">
          <textPath v-bind:startOffset="`${(item.title.angle / 360 * 100 + 25)%100}%`" xlink:href="#outsideTextPath">
            {{ item.title.title }}
          </textPath>
        </text>
      </g>
    </template>
    <g style="opacity: 1; pointer-events: auto;">
      <text class="line-text" y="304" x="300" text-anchor="middle">Adopt</text>
      <text class="line-text" y="304" x="450" text-anchor="middle">Trial</text>
      <text class="line-text" y="304" x="530" text-anchor="middle">Assess</text>
      <text class="line-text" y="304" x="580" text-anchor="middle">Hold</text>
    </g>
    <template v-for="(dot) in dots">
      <g
        v-if="!dot.isUnknown"
        v-bind:key="dot.item.key"
        class="dots"
        v-bind:transform="`translate(${dot.position.x}, ${dot.position.y})`"
        v-on:click="onClickDot(dot)">
        <circle class="dot" cx="0" v-bind:cy="0" v-bind:r="dot.r" v-bind:title="dot.item.hint" />
        <text class="dot-text" y="3" x="0" text-anchor="middle">{{ dot.index }}</text>
        <title>{{ dot.item.key }}: {{ dot.item.hint }}</title>
      </g>
    </template>
  </svg>
</template>

<script>

  import query from '../../manifest/query';
  import crc16 from '../../helpers/crc16';

  export default {
    name: 'TRTechniques',
    props: {
      section: { type: String, default: '' }
    },
    data() {
      const rings = [
        {
          key: 'adopt',
          width: 110
        },
        {
          key: 'trial',
          width: 90
        }
        ,
        {
          key: 'assess',
          width: 60
        },
        {
          key: 'hold',
          width: 40
        }
      ];

      rings.reduce((acc, item) => {
        item.r = acc + item.width;
        return item.r;
      }, 0);
      return {
        rings: rings.reverse()
      };
    },
    computed: {
      isShowSections() {
        return Object.keys(this.sections).length > 1;
      },
      showSections() {
        let result = {};
        const manifest = this.manifest;
        if (manifest) {
          if (this.section) {
            manifest.technologies && manifest.technologies && manifest.technologies.sections
              && manifest.technologies.sections[this.section] &&
              (result[this.section] = JSON.parse(JSON.stringify(manifest.technologies.sections[this.section])));
          } else {
            result = JSON.parse(JSON.stringify((manifest.technologies || {sections: {}}).sections));
          }
        }
        return result;
      },
      sections() {
        let result = this.showSections;
        const keys = Object.keys(result);
        if (keys.length) {
          const size = 360 / keys.length;
          let offset = 0;
          for (const key in result) {
            const section = result[key];
            section.key = key;
            section.location = {
              offset,
              size
            };
            section.title = {
              title: section.title,
              position: this.getXY(310, offset + size / 2),
              angle: offset + size / 2
            };
            section.line = this.getXY(300, section.location.offset + size);
            offset += size;
          }
        }
        return result;
      },
      dots() {
        const result = [];
        let index = 1;
        (query.expression(query.collectTechnologies())
          .evaluate(this.manifest) || []).forEach((item) => {
          if (this.section && this.section.toLowerCase() !== item.section.key.toLowerCase())
            return;
          const ring = this.getRingOfStatus(item.status || 'trial');
          const section = this.getSectionOfKey(item.section.key);
          if (!section) {
            result.push({
              isUnknown: true,
              item
            });
          } else {
            const dot = this.makeDot(item, section, ring);
            dot.index = index++;
            result.push(dot);
          }
        });
        this.$emit('input', result);
        return result;
      }
    },
    mounted() {
    },
    methods: {
      onClickSection(section) {
        this.$router.push({ path: `/techradar/${section.key}` });
      },
      onClickDot(dot) {
        this.$router.push({ path: `/technology/${dot.item.key}` });
      },
      getXY(distance, angle) {
        return {
          x: Math.sin(angle / 360 * 6.28) * distance + 300,
          y: Math.cos(angle / 360  * 6.28) * distance + 300
        };
      },
      makeDot(item, section, ring) {
        const crc = crc16(item.key);
        const ringOffset = ring.r - ring.width;
        return {
          // distance: ringOffset + (crc32 & 0xFFFF0000 / 0x10000 / 0xFFFF * ring.width),
          // angle: section.location.offset + (crc32 & 0xFFFF / 0xFFFF * section.location.size),
          position: this.getXY(
            ringOffset + ((crc & 0xFF00) / 0x100 / 0xFF * ring.width),
            section.location.offset + ((crc & 0xFF) / 0xFF * section.location.size)
          ),
          r: 8,
          item
        };
      },
      getSectionOfKey(key) {
        return this.sections[key];
      },
      getRingOfStatus(status) {
        for(let i=0; i < this.rings.length; i++) {
          const ring = this.rings[i];
          if (ring.key.toLowerCase() === status.toLowerCase()) {
            return ring;
          }
        }
        return null;
      }
    }
  };
</script>

<style scoped>

svg circle.ring-arc-0 {
  stroke: none;
  fill: #bababa;
}

svg circle.ring-arc-1 {
  stroke: none;
  fill: #cacaca;
}

svg circle.ring-arc-2 {
  stroke: none;
  fill: #dadada;
}

svg circle.ring-arc-3 {
  stroke: none;
  fill: #eee;
}

svg text.line-text {
  font-weight: 700;
  text-transform: uppercase;
  fill: #000;
  font-size: 12px;
}

svg .section-line {
  stroke: black;
  opacity: 0.3;
}

svg .dot {
  fill: #3495db;
}

svg .dot-text {
  fill: #fff;
  font-size: 10px;
  font-weight: 700;
}

svg .section-title {
  fill: #000;
  cursor: pointer;
}

svg .section-title:hover {
  fill: #BA68C8
}

svg .dots {
  cursor: pointer;
}

svg .dots:hover .dot{
  fill: #BA68C8
}

</style>
