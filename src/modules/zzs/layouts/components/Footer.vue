<script setup>

</script>

<template>
    <footer class="footer">
        <div class="flex flex-wrap justify-content-center footer-container">
            <div class="widget-left grid card-wrap">
                <div>
                    <img loading="lazy" src="/images/zzs_white_logo.svg" alt="" class="logo-footer"/>
                </div>
                <div>
                    <span class="footer-title"><b>&nbsp;ZŽS</b> PORTAL</span><br/>
                    <span>&nbsp;&nbsp;Portal za zaštitu životne sredine</span>
                </div>
            </div>
            <div id="text-46" class="widget-center card-wrap">
                <div class="textwidget">
                    <ul>
                        <li class="nav-item">
                            > <a class="nav-link text-light" href="/news">Početna strana</a>
                        </li>
                        <li class="nav-item">
                            > <a class="nav-link text-light" href="/contact">Kontaktirajte nas</a>
                        </li>
                        <li>
                            > <a class="nav-link text-light" href="/news">Vesti</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div id="text-46" class="widget-right card-wrap">
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
                        <span>zzs@actamedia.rs</span>
                    </p> <br/>
                    <p>Pronađite nas i na:</p>
                    <p class="nav-item">
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
        <div class="copyright">
            <div>
                <span>Copyright &#169; 2024 - <span class="red">ACTA MEDIA</span> | Sva prava zadržana | </span>
                <span>
                    ažuriranje portala na dnevnom nivou, ISSN 3009-4771 (Online)
                </span>
            </div>
        </div>
    </footer>
</template>

<style lang="scss">
    .footer {
        font-family: Inter;
        .logo-footer {
            width: auto;
            min-height: 50px;
        }
        background-color: var(--color-zzs-navbar-background-primary);
        .copyright {
            color: #000;
            font-size: 24px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
            background-color: #dedede !important;
            min-height: 50px;
            width: 100%;
            div {
                max-width: 1200px;
                margin: 0 auto;
            }
            span {
                top: 15px;
            }
            .red {
                font-size: 24px;
                font-style: normal;
                font-weight: 700;
                line-height: normal;
                color: var(--color-zzs-navbar-background-primary);
                top: 0px;
            }
        }
        bottom: 0;
        width: 100%;
        // position: absolute;
        min-height: 280px;
        .footer-container {
            padding-top: 20px;
            background-color: var(--color-zzs-navbar-background-primary) !important;
            color: var(--color-zzs-navbar-text-primary) !important;
            max-width: 1200px;
            margin: 0 auto;
            .textwidget {
                font-size: 14px;
                margin-top: 1rem;
                .nav-item {
                    padding-bottom: 50px;
                }
                ul {
                    padding-left: 50px;
                    li {
                        display: block;
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
            @media all and (min-width: 700px) {
                .widget-left {
                    padding-top: 20px;
                    margin-right: auto;
                }
                .widget-center {
                    margin-right: auto;
                    margin-left: auto;
                }
                .widget-right {
                    margin-left: auto;
                }
            }
        }
        .footer-title {
            font-size: 30px;
        }
    }
</style>