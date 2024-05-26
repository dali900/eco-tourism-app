<script setup>
import { computed } from 'vue'
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();

const currentYear = computed(() => new Date().getFullYear());
</script>

<template>
    <footer class="footer">
        <div class="footer-container">
            <div class="footer-top">
                <div class="links">
                    <div>
                        <router-link to="/">{{ t('footer.link1') }}</router-link>
                    </div>
                    <div>
                        <router-link to="/">{{ t('footer.link2') }}</router-link>
                    </div>
                    <div>
                        <router-link to="/">{{ t('footer.link3') }}</router-link>
                    </div>
                    <div>
                        <router-link to="/">{{ t('footer.link4') }}</router-link>
                    </div>
                </div>
                <div class="logo-wrapper">
                    <a href="/" class="logo">
                        <img alt="Logo" src="/images/app-logo.svg" to="/">
                    </a>
                </div>
                <div class="socials">
                    <div>{{ t('footer.contact') }} 062289514</div>
                    <div>E-mail selona3klika@gmail.com</div>
                    <div class="social-links">
                        <a href="//twitter.com" target="_blank">
                            <img alt="Logo" src="/images/x.svg" to="/">
                        </a>
                        <a href="//facebook.com" target="_blank">
                            <img alt="Logo" src="/images/facebook.svg" to="/">
                        </a>
                        <a href="https://www.instagram.com/selonatriklika/" target="_blank">
                            <img alt="Logo" src="/images/instagram.svg" to="/">
                        </a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <div>Copyright © {{ currentYear }} - <span>{{ t('footer.bottomPart1') }}</span></div>
                <div>{{ t('footer.bottomPart2') }}</div>
                <div>{{ t('footer.bottomPart3') }}</div>
            </div>
        </div>
    </footer>
</template>

<style scoped lang="scss">
    .footer {
        /* position: absolute;
        bottom: -164px; */
        padding: 8px 0;
        display: flex;
        justify-content: center;
        color: var(--color-white-soft);
        width: 100%;
        background-color: var(--color-black);
        .footer-container {
            max-width: var(--container-width);
        }
        .footer-top {
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-between;
            margin-bottom: 16px;
            .links {
                div {
                    margin-bottom: 8px;
                }
                a {
                    text-decoration: none;
                    color: var(--color-white-soft);
                    &:hover {
                        color: var(--link-hover-color) !important;
                    }
                };
            }
            .logo-wrapper {
                img {
                    width: auto;
                    height: 100px;
                }
            }
            .socials {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                gap: 8px;
                .social-links {
                    display: flex;
                    justify-content: space-between;
                    gap: 8px;
                    img {
                        height: 50px;
                    }
                }
            }
        }
        .footer-bottom {
            display: flex;
            flex-wrap: wrap;
            padding: 4px;
            :nth-child(2) {
                margin: 0 8px;
                padding: 0 8px;
                border-left: 1px solid var(--color-white-soft);
                border-right: 1px solid var(--color-white-soft);
            }
            span {
                font-weight: 600;
            }
        }
        
    }
</style>