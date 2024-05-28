<template>
    <div class="about-us">
        <!-- Header imag -->
        <div class="header-img">
            <img alt="header-img" src="/images/attraction-page-header.jpeg">
            <div class="msg">{{ t('aboutUs.headerMsg') }}</div>
        </div>

        <div class="page-body">
            <div class="content">
                Ovo vrelo spada u grupu kraških vrela, a temperatura vode kreće se od 9–11 °C. Vrelo je pri dnu amfiteatralnog oblika strmih, mestimično vertikalnih strana. Potok vrela, odnosno vrelska otoka ukupne dužine 435 metara, prvo otiče prema severu na dužini od 130 metara, a zatim skreće prema zapadu i posle nekih 300 metara uliva se u Krupajsku reku. Zbog izgradnje brane na otoci vrela visoke oko 3 metra vrelo danas ima izgled izduženog jezerca dužine 40 i širine 17 metara čija se voda atraktivnim vodopadom preliva preko krune ove ustave.
                <br><br>
                <div class="flex-justify-center">
                    <div class="aboutus-img flex-justify-center">
                        <img alt="aboutus-img" src="/images/attraction-page-header.jpeg">
                    </div>
                </div>
                <br><br>
                Speleoronilačkim proučavanjima u 1998. godini, koja predstavljaju izvanredni istraživački poduhvat, otkriveno je postojanje preko 70 m dubokog inverznog kraka pećinskog sifona kojim vode vrela dospevaju iz krečnjačkog masiva Beljanice. Od brane do mlina, vrelski potok teče kroz krečnjačku sutjesku strmih strana i slapovitog korita. Hidrološki režim vrela i njegova izdašnost nisu dovoljno ispitani. Kao i većina kraških izvora, ovo vrelo se odlikuje velikim promenama izdašnosti u toku jedne godine, a pogotovu u višegodišnjem periodu. Kod zgrade mlina, nalazi se betonska česma sa pet metalnih cevi na kojima ističe topla voda temperature 26 °C i izdašnosti 6–10 lit/sek. Ova voda potiče iz prirodnog termalnog izvora koji je kaptiran i podzemno sproveden do česme. Desetak metara od česme je druga termalna pojava predstavljena izvorom u obliku minijaturnog vodoskoka koji je nastao na samoizlivnoj geološkoj bušotini.
            </div>
            
        </div>

    </div>
</template>

<script setup>
import {
    ref,
    unref,
    reactive,
    computed,
    watch,
    onMounted,
    onUnmounted,
    onBeforeMount,
} from "vue";
import { storeToRefs } from "pinia";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "primevue/usetoast";
import { useAttractionStore } from "@/stores/attraction";
import Galleria from 'primevue/galleria';
import Image from 'primevue/image';
import { useI18n } from "vue-i18n";

const apiBaseUrl = import.meta.env.VITE_BASE_API_URL;
const route = useRoute();
const { t } = useI18n();

const attractionStore = useAttractionStore();
const { attraction, loading, attractionRootCategories } =
    storeToRefs(attractionStore);

const responsiveOptions = ref([
    {
        breakpoint: '1300px',
        numVisible: 4
    },
    {
        breakpoint: '575px',
        numVisible: 1
    }
]);

onBeforeMount(() => {
    if (route.params.id) {
        attractionStore.getAttraction(route.params.id);
    }
});

const attractionContent = computed( () => {
    console.log(attraction);
    if (!attraction.value || !attraction.value.content) return null;
    return attraction.value.content.replace(/\n/g, "<br />");
})
</script>

<style scoped >
.about-us {
    .header-img {
        position: relative;
        max-width: var(--container-width);
        height: 155px;
        overflow: hidden;
        display: flex;
        justify-content: center;
        .msg {
            z-index: 1;
            align-self: center;
            color: var(--color-white);
            font-size: 40px;
            height: auto;
            text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
        }
        img {
            top: -190px;
            right: -100px;
            position: absolute;
        }
        margin-bottom: 64px;
    }
    .title {
        display: flex;
        justify-content: center;
        div {
            border-bottom: 2px solid var(--color-black);
            padding: 16px;
        }
        margin-bottom: 64px;
    }
    .aboutus-img {
        max-width: 800px;
        img {
            max-width: 100%;
            height: auto;
            display: block;
        }
    }
    .separator {
        background-color: var(--color-white);
        height: 14px;
        width: 100%;
    }
    .page-body {
        padding: 0 16px;
    }
    @media screen and (min-width: 992px) {
        .page-body {
            padding: 0 64px;
        }
    }
    .title {
        font-size: 40px;
        font-weight: 600;
    }
    .content {
        margin-bottom: 64px;
    }
}

</style>
