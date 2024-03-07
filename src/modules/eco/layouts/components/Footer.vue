<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear());
</script>

<template>
    <footer class="footer">
        <div class="footer-container">
            
        </div>
        <div class="copyright">
            <div>Copyright &#169; {{ currentYear }} - Sva prava zadržava 
                <span class="yellow">SELO NA 3 KLIKA&nbsp;</span>
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