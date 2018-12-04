
<template>

  <div>

    <portal to="actionbar" :order="1">
      <button class="btn btn-secondary navbar-btn" title="Switch language" v-on:click="showModal=true">
        <icon name="flag"></icon>
      </button>
    </portal>

    <portal to="modals" :order="1">
      <modal title="Switch and manage languages" :show="showModal"  v-on:closeButton="showModal=false">

        <div class="btn-group" >
          <div class="btn" v-bind:class="{'btn-primary': currentLanguage==enabledLanguage,'btn-secondary': currentLanguage!=enabledLanguage}" v-for="(enabledLanguage) in enabledLanguages" v-bind:key="enabledLanguage" v-on:click="localize(enabledLanguage)">{{languages[enabledLanguage]['name']}}</div>
        </div>

        <p>
          <div class="btn btn-small" v-on:click="toggleMore">
            <span>Enable / Disable more Languages</span>
          </div>
        </p>

        <div v-if="showMore">

          <div class="form-check form-check-inline" v-for="(language, code) in languages" v-bind:key="code">
            <label class="form-check-label">
              <input class="form-check-input" type="checkbox" value="true" v-on:click="toggle(code,$event)" :checked="enabledLanguages.includes(code)">
              {{language.name}}
            </label>
          </div>

        </div>

      </modal>
    </portal>

  </div>

</template>

<script>

import Modal from '../Modal.vue'
import 'vue-awesome/icons/flag'
import Icon from 'vue-awesome/components/Icon'

// import Brain from 'wanderer-brain'

export default {
  components: {
    Modal, Icon
  },
  data: function () {
    return {
      showModal: false,
      showMore: false,
      languages: {
        aa: {name: 'Afar'},
        ab: {name: 'Abkhazian'},
        af: {name: 'Afrikaans'},
        am: {name: 'Amharic'},
        ar: {name: 'Arabic'},
        as: {name: 'Assamese'},
        ay: {name: 'Aymara'},
        az: {name: 'Azerbaijani'},
        ba: {name: 'Bashkir'},
        be: {name: 'Byelorussian'},
        bg: {name: 'Bulgarian'},
        bh: {name: 'Bihari'},
        bi: {name: 'Bislama'},
        bn: {name: 'Bengali'},
        bo: {name: 'Tibetan'},
        br: {name: 'Breton'},
        ca: {name: 'Catalan'},
        co: {name: 'Corsican'},
        cs: {name: 'Czech'},
        cy: {name: 'Welch'},
        da: {name: 'Danish'},
        de: {name: 'German'},
        dz: {name: 'Bhutani'},
        el: {name: 'Greek'},
        en: {name: 'English'},
        eo: {name: 'Esperanto'},
        es: {name: 'Spanish'},
        et: {name: 'Estonian'},
        eu: {name: 'Basque'},
        fa: {name: 'Persian'},
        fi: {name: 'Finnish'},
        fj: {name: 'Fiji'},
        fo: {name: 'Faeroese'},
        fr: {name: 'French'},
        fy: {name: 'Frisian'},
        ga: {name: 'Irish'},
        gd: {name: 'Scots Gaelic'},
        gl: {name: 'Galician'},
        gn: {name: 'Guarani'},
        gu: {name: 'Gujarati'},
        ha: {name: 'Hausa'},
        hi: {name: 'Hindi'},
        he: {name: 'Hebrew'},
        hr: {name: 'Croatian'},
        hu: {name: 'Hungarian'},
        hy: {name: 'Armenian'},
        ia: {name: 'Interlingua'},
        id: {name: 'Indonesian'},
        ie: {name: 'Interlingue'},
        ik: {name: 'Inupiak'},
        in: {name: 'former Indonesian'},
        is: {name: 'Icelandic'},
        it: {name: 'Italian'},
        iu: {name: 'Inuktitut (Eskimo)'},
        iw: {name: 'former Hebrew'},
        ja: {name: 'Japanese'},
        ji: {name: 'former Yiddish'},
        jw: {name: 'Javanese'},
        ka: {name: 'Georgian'},
        kk: {name: 'Kazakh'},
        kl: {name: 'Greenlandic'},
        km: {name: 'Cambodian'},
        kn: {name: 'Kannada'},
        ko: {name: 'Korean'},
        ks: {name: 'Kashmiri'},
        ku: {name: 'Kurdish'},
        ky: {name: 'Kirghiz'},
        la: {name: 'Latin'},
        ln: {name: 'Lingala'},
        lo: {name: 'Laothian'},
        lt: {name: 'Lithuanian'},
        lv: {name: 'Latvian, Lettish'},
        mg: {name: 'Malagasy'},
        mi: {name: 'Maori'},
        mk: {name: 'Macedonian'},
        ml: {name: 'Malayalam'},
        mn: {name: 'Mongolian'},
        mo: {name: 'Moldavian'},
        mr: {name: 'Marathi'},
        ms: {name: 'Malay'},
        mt: {name: 'Maltese'},
        my: {name: 'Burmese'},
        na: {name: 'Nauru'},
        ne: {name: 'Nepali'},
        nl: {name: 'Dutch'},
        no: {name: 'Norwegian'},
        oc: {name: 'Occitan'},
        om: {name: '(Afan) Oromo'},
        or: {name: 'Oriya'},
        pa: {name: 'Punjabi'},
        pl: {name: 'Polish'},
        ps: {name: 'Pashto, Pushto'},
        pt: {name: 'Portuguese'},
        qu: {name: 'Quechua'},
        rm: {name: 'Rhaeto-Romance'},
        rn: {name: 'Kirundi'},
        ro: {name: 'Romanian'},
        ru: {name: 'Russian'},
        rw: {name: 'Kinyarwanda'},
        sa: {name: 'Sanskrit'},
        sd: {name: 'Sindhi'},
        sg: {name: 'Sangro'},
        sh: {name: 'Serbo-Croatian'},
        si: {name: 'Singhalese'},
        sk: {name: 'Slovak'},
        sl: {name: 'Slovenian'},
        sm: {name: 'Samoan'},
        sn: {name: 'Shona'},
        so: {name: 'Somali'},
        sq: {name: 'Albanian'},
        sr: {name: 'Serbian'},
        ss: {name: 'Siswati'},
        st: {name: 'Sesotho'},
        su: {name: 'Sudanese'},
        sv: {name: 'Swedish'},
        sw: {name: 'Swahili'},
        ta: {name: 'Tamil'},
        te: {name: 'Tegulu'},
        tg: {name: 'Tajik'},
        th: {name: 'Thai'},
        ti: {name: 'Tigrinya'},
        tk: {name: 'Turkmen'},
        tl: {name: 'Tagalog'},
        tn: {name: 'Setswana'},
        to: {name: 'Tonga'},
        tr: {name: 'Turkish'},
        ts: {name: 'Tsonga'},
        tt: {name: 'Tatar'},
        tw: {name: 'Twi'},
        ug: {name: 'Uigur'},
        uk: {name: 'Ukrainian'},
        ur: {name: 'Urdu'},
        uz: {name: 'Uzbek'},
        vi: {name: 'Vietnamese'},
        vo: {name: 'Volapuk'},
        wo: {name: 'Wolof'},
        xh: {name: 'Xhosa'},
        yi: {name: 'Yiddish'},
        yo: {name: 'Yoruba'},
        za: {name: 'Zhuang'},
        zh: {name: 'Chinese'},
        zu: {name: 'Zulu'},
      }
    }
  },
  computed: {
    currentLanguage () {
      return this.$store.state.wanderer.currentLanguage;
    },
    enabledLanguages () {
      return this.$store.state.wanderer.enabledLanguages;
    }
  },
  methods: {
    toggleMore(){
      if(this.showMore){
        this.showMore = false;
      }else{
        this.showMore = true;
      }
    },
    localize(language){

      this.$store.commit('wanderer/setCurrentLanguage',language)

      for(let i in this.$store.state.wanderer.vertexDocumentIds){
        //this.$cytoscape.updateVertexData(this.$store.getters['documents/getVertexDataById'](this.$store.state.documents.vertexList[i]),language);
        this.$cytoscape.updateVertexData(this.$store.state.documents.vertexData[this.$store.state.documents.vertexList[i]],language);
      }

      this.showModal = false

    },
    toggle(language,e){
      if (e.target.checked) {
        this.$store.commit('wanderer/enableLanguage',language)
      }else{
        this.$store.commit('wanderer/disableLanguage',language)
      }
    }
  }
}
</script>

<style>

</style>
