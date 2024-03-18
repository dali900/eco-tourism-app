<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear());
</script>

<template>
    <footer class="footer">
        <div class="footer-container">
            <div class="col-full p-grid p-nogutter grid grid-nogutter">
                <div id="text-27" class="widget">
                    <img loading="lazy" src="/images/footer/bzr/logo-footer.svg" alt="" class="logo-footer"/>
                </div>
                <div id="text-46" class="widget">
                    <div class="textwidget">
                        <ul>
                            <li class="nav-item">
                                > <a class="nav-link text-light" href="/news">Početna strana</a>
                            </li>
                            <li class="nav-item">
                                > <a class="nav-link text-light" href="/kontakt-forma">Kontaktirajte nas</a>
                            </li>
                            <li class="nav-item">
                                > <a class="nav-link text-light" href="/news">Vesti</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div id="text-46" class="widget">
                    <div class="textwidget">
                        <p>
                            <img loading="lazy" src="/images/footer/bzr/address-icon.svg" alt="" width="22" height="22" class="alignnone size-full wp-image-50034">&nbsp;
                            <span>Kraljice Natalije 45, 11000 Beograd</span>
                        </p>
                        <p>
                            <img loading="lazy" src="/images/footer/bzr/phone-icon.svg" alt="" width="22" height="22" class="alignnone size-full wp-image-50034">&nbsp;
                            <span>+381 60 365 6133</span>
                        </p>
                        <p>
                            <img loading="lazy" src="/images/footer/bzr/mail-icon.svg" alt="" width="22" height="22" class="alignnone size-full wp-image-50034">&nbsp;
                            <span>bzrportal@actamedia.rs</span>
                        </p> <br/>
                        <p>Pronađite nas i na:</p>
                        <p>
                            <a href="https://www.instagram.com/actamedia_rs/" target="_blank">
                                <img loading="lazy" src="/images/footer/bzr/instagram-icon.svg" alt="" width="22" height="22" class="alignnone size-full wp-image-50034">
                            </a>&nbsp;
                            <a href="https://www.linkedin.com/company/acta-media-doo/" target="_blank">
                                <img loading="lazy" src="/images/footer/bzr/linkedin-icon.svg" alt="" width="22" height="22" class="alignnone size-full wp-image-50035">
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="copyright">
            <div>Copyright &#169; {{ currentYear }} - Sva prava zadržava 
                <span class="yellow">Selo na 3 klika&nbsp;</span>
            </div>
            <div>
                | Kraljice Natalije 45/7 |&nbsp;
            </div>
            <div>
                ažuriranje portala na dnevnom nivou, ISSN 3009-4550 (Online)
            </div>
        </div>
    </footer>
</template>

<style lang="scss">
    .footer {
        .logo-footer {
            width: auto;
            height: 50px;
        }
        background-color: var(--color-bzr-navbar-background-primary);
        .copyright {
            background-color: #333331;
            min-height: 50px;
            width: 100%;
            color: white;
            span {
                top: 15px;
            }
            .yellow {
                color: var(--color-bzr-navbar-background-primary);
                top: 0px;
            }
        }
        .footer-container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .copyright {
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;
        }
        bottom: 0;
        width: 100%;
        min-height: 280px;
        .col-full {
            display: flex;
            padding-top: 20px;
            background-color: var(--color-bzr-navbar-background-primary) !important;
            color: var(--color-bzr-navbar-text-primary) !important;
            .widget {
                position: relative;
                margin: 0;
                padding: 0 20px;
                flex: 1;
                .textwidget {
                    font-size: 14px;
                    margin-top: 1rem;
                    ul {
                        padding-left: 50px;
                        li {
                            display: block;
                            padding-bottom: 50px;
                            a {
                                text-decoration: none;
                                color: var(--color-bzr-navbar-text-primary) !important;
                                font-weight: 600 !important;
                            }
                        }
                    }
                    p {
                        padding-top: 5px;
                        font-weight: 600 !important;
                        span {
                            bottom: 5px;
                            font-weight: 600 !important;
                        }
                    }
                }
            }
        }
    }
</style>