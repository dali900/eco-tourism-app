<script setup>
const currentYear = computed(() => new Date().getFullYear());
</script>

<template>
    <footer class="footer">
        <div class="footer-container">
            <div class="col-full p-grid p-nogutter grid grid-nogutter">
                <div class="grid">
                    <div>
                        <img loading="lazy" src="/images/zzs_white_logo.svg" alt="" class="logo-footer"/>
                    </div>
                    <div>
                        <span class="footer-title"><b>&nbsp;ZŽS</b> PORTAL</span><br/>
                        <span>&nbsp;&nbsp;Portal za zaštitu životne sredine</span>
                    </div>
                </div>
                <div id="text-46" class="widget">
                    <div class="textwidget">
                        <ul>
                            <li class="nav-item">
                                > <a class="nav-link text-light" href="/news">Početna strana</a>
                            </li>
                            <li class="nav-item">
                                > <a class="nav-link text-light" href="/contact">Kontaktirajte nas</a>
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
                            <img loading="lazy" src="/images/footer/address-icon.png" alt="" width="22" height="22" class="alignnone size-full wp-image-50034">&nbsp;
                            <span>Kraljice Natalije 45, 11000 Beograd</span>
                        </p>
                        <p>
                            <img loading="lazy" src="/images/footer/phone-icon.png" alt="" width="22" height="22" class="alignnone size-full wp-image-50034">&nbsp;
                            <span>+381 60 365 6133</span>
                        </p>
                        <p>
                            <img loading="lazy" src="/images/footer/mail-icon.png" alt="" width="22" height="22" class="alignnone size-full wp-image-50034">&nbsp;
                            <span>exportinfo@actamedia.rs</span>
                        </p> <br/>
                        <p>Pronađite nas i na:</p>
                        <p>
                            <a href="https://www.instagram.com/actamedia_rs/" target="_blank">
                                <img loading="lazy" src="/images/footer/instagram-icon.png" alt="" width="22" height="22" class="alignnone size-full wp-image-50034">
                            </a>&nbsp;
                            <a href="https://www.linkedin.com/company/acta-media-doo/" target="_blank">
                                <img loading="lazy" src="/images/footer/linkedin-icon.png" alt="" width="22" height="22" class="alignnone size-full wp-image-50035">
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="copyright">
            <div class="footer-container">
                <span>Copyright &#169; {{ currentYear }} - <span class="red">Selo na 3 klika</span> | Sva prava zadržana</span>
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
        background-color: #860007;
        .copyright {
            background-color: #dedede;
            min-height: 50px;
            width: 100%;
            color: var(--color-zzs-card-text-primary);
            span {
                top: 15px;
            }
            .red {
                color: var(--color-zzs-navbar-background-primary);
                top: 0px;
            }
        }
        .footer-container {
            max-width: 1200px;
            margin: 0 auto;
        }
        bottom: 0;
        width: 100%;
        position: absolute;
        height: 280px;
        .col-full {
            display: flex;
            padding-top: 20px;
            background-color: var(--color-zzs-navbar-background-primary) !important;
            color: var(--color-zzs-navbar-text-primary) !important;
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
                                color: var(--color-zzs-navbar-text-primary) !important;
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
        .footer-title {
            font-size: 30px;
        }
    }
</style>