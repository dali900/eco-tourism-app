<script setup>
import { ref } from 'vue'
import QandA from './QandA.vue'
    const images = ref([
        {
            itemImageSrc: "/images/bzr_presentations/IMG_0259.JPG"
        },
        {
            itemImageSrc: "/images/bzr_presentations/IMG_0260.JPG"
        },
        {
            itemImageSrc: "/images/bzr_presentations/IMG_0262.JPG"
        },
        {
            itemImageSrc: "/images/bzr_presentations/IMG_0269.JPG"
        },
        {
            itemImageSrc: "/images/bzr_presentations/IMG_0271.JPG"
        },
        {
            itemImageSrc: "/images/bzr_presentations/IMG_0272.JPG"
        },
        {
            itemImageSrc: "/images/bzr_presentations/IMG_0277.JPG"
        },
        {
            itemImageSrc: "/images/bzr_presentations/IMG_0291.JPG"
        },
        {
            itemImageSrc: "/images/bzr_presentations/IMG_0316.JPG"
        },
        {
            itemImageSrc: "/images/bzr_presentations/IMG_0320.JPG"
        },
        {
            itemImageSrc: "/images/bzr_presentations/IMG_0323.JPG"
        },
        {
            itemImageSrc: "/images/bzr_presentations/IMG_0326.JPG"
        },
        {
            itemImageSrc: "/images/bzr_presentations/IMG_0328.JPG"
        },
        {
            itemImageSrc: "/images/bzr_presentations/IMG_0353.JPG"
        },
        {
            itemImageSrc: "/images/bzr_presentations/IMG_0380.JPG"
        },
        {
            itemImageSrc: "/images/bzr_presentations/IMG_0392.JPG"
        },
        {
            itemImageSrc: "/images/bzr_presentations/IMG_0393.JPG"
        }
    ]);
</script>

<template>
    <div class="presentations">
        <div class="presentations-title">
            <h1 style="padding: 20px;">
                Prva nacionalna konferencija - Bezbednost i zdravlje na radu <br/>
                30. novembar 2023
            </h1>
        </div>
        <Accordion :multiple="true">
            <AccordionTab header="Prezentacije">
                <div class="presentations-list">
                    <ul>
                        <li>
                            <a href="/bzr_presentations/dr Aleksandra Ilić Petković_Fakultet zaštite na radu u Nišu.pptx" target="_blank">
                            dr Aleksandra Ilić Petković_Fakultet zaštite na radu u Nišu.pptx
                            </a>
                        </li>
                        <li>
                            <a href="/bzr_presentations/Dragan_Jocic_Izdavanje dozvola za rad.pptx" target="_blank">
                                Dragan_Jocic_Izdavanje dozvola za rad.pptx
                            </a>
                        </li>
                        <li>
                            <a href="/bzr_presentations/Jelena_Ašanin_Primena Zakona iz ugla sudske prakse.pptx" target="_blank">
                                Jelena_Ašanin_Primena Zakona iz ugla sudske prakse.pptx
                            </a>
                        </li>
                        <li>
                            <a href="/bzr_presentations/Maja_Ilić_Primena novog Zakona.ppt" target="_blank">
                                Maja_Ilić_Primena novog Zakona.ppt
                            </a>
                        </li>
                        <li>
                            <a href="/bzr_presentations/Vladimir_Todorović_Upravljanje izvođačima.pptx" target="_blank">
                                Vladimir_Todorović_Upravljanje izvođačima.pptx
                            </a>
                        </li>
                        <li>
                            <a href="/bzr_presentations/Željko_Karapandzic_Program obuke zaposlenih_predstavnika zaposlenih i rukovodilaca.pptx" target="_blank">
                                Željko_Karapandzic_Program obuke zaposlenih_predstavnika zaposlenih i rukovodilaca.pptx
                            </a>
                        </li>
                    </ul>
                </div>
            </AccordionTab>
            <AccordionTab header="Galerija">
                <div class="card">
                    <Galleria 
                        :value="images" :numVisible="5" :circular="true" containerStyle="max-width: 1200px"
                        :showItemNavigators="true" :showThumbnails="false" :showItemNavigatorsOnHover="true" :showIndicators="true"
                    >
                        <template #item="slotProps">
                            <img :src="slotProps.item.itemImageSrc" alt="test" style="width: 100%; display: block;" />
                        </template>
                        <template #thumbnail="slotProps">
                            <img :src="slotProps.item.itemImageSrc" alt="test" style="display: block;" />
                        </template>
                    </Galleria>
                </div>
            </AccordionTab>
            <AccordionTab header="Video zapisi">
                <div class="flex flex-wrap justify-content-center">
                    <div>
                        <iframe
                            src="https://www.youtube.com/embed/gs0O9Y-aU_k?si=BRhf1OyDP79NqRSp"
                            frameborder="0" allowfullscreen class="video-iframe"
                        ></iframe>
                    </div>
                    <div>
                        <iframe 
                            src="https://www.youtube.com/embed/XddVdkerWUc?si=AVZj8i6oAIQIgM3Y"
                            frameborder="0" allowfullscreen class="video-iframe"
                        ></iframe>
                    </div>
                    <div>
                        <iframe 
                            src="https://www.youtube.com/embed/hmG40pxtXF8?si=48J9k89AfICW0Om3"
                            frameborder="0" allowfullscreen class="video-iframe"
                        ></iframe>
                    </div>
                    <div>
                        <iframe 
                            src="https://www.youtube.com/embed/Yw5q4KZCpj8?si=AqnKAJJS5hCcwmVI"
                            frameborder="0" allowfullscreen class="video-iframe"
                        ></iframe>
                    </div>
                    <div>
                        <iframe 
                            src="https://www.youtube.com/embed/a5MeVac5eS8?si=IKsiVS2YKvzbOdO0"
                            frameborder="0" allowfullscreen class="video-iframe"
                        ></iframe>
                    </div>
                    <div>
                        <iframe 
                            src="https://www.youtube.com/embed/7S9zYjVC7bI?si=clDwJh6ruCyuE-zL"
                            frameborder="0" allowfullscreen class="video-iframe"
                        ></iframe>
                    </div>
                    <div>
                        <iframe 
                            src="https://www.youtube.com/embed/3Ujkiy8P4pI?si=r7E9jUxNt3Zq_sOg"
                            frameborder="0" allowfullscreen class="video-iframe"
                        ></iframe>
                    </div>
                    <div>
                        <iframe 
                            src="https://www.youtube.com/embed/CJJ6OdUIlAg?si=yEXh8tDBjT2_j98b"
                            frameborder="0" allowfullscreen class="video-iframe"
                        ></iframe>
                    </div>
                    <div>
                        <iframe 
                            src="https://www.youtube.com/embed/70NVpcO9Nmo?si=GhUxog746Gc3mwq2"
                            frameborder="0" allowfullscreen class="video-iframe"
                        ></iframe>
                    </div>
                </div>
            </AccordionTab>
            <AccordionTab header="Pitanja i odgovori">
                <QandA />
            </AccordionTab>
        </Accordion>
    </div>
</template>

<style scoped lang="scss">
.presentations {
    min-height: calc(100vh - 340px);
    .presentations-list {
        ul {
            list-style-type: none;
            li{
                padding: 20px;
                font-size: 18px;
            }
        }
    }
    .video-iframe {
        height: 280px;
        width: 380px;
        padding: 20px;
    }
}
</style>