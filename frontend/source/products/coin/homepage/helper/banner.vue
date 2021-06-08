<template>
    <div class="homepage-banner shadow-sm">
        <div class="container first-view">
            <div class="pt-5">
                <div class="h1">Welcome to Geeks UI Learning Application</div>
                <div class="h3">Hand-picked Instructor and expertly crafted courses, designed for the modern students and entrepreneur.</div>
                <button type="button" class="btn btn-lg btn-success">Browse Courses</button>
                <button type="button" class="btn btn-lg btn-light">Are You Instructor?</button>
            </div>
            <img src="https://codescandy.com/geeks/assets/images/hero/hero-img.png">
        </div>
        <div class="bg-white">
            <div class="container d-grid grid-col-3">
                <div>
                    <span class="icon">
                        <i class="bi bi-camera-video" />
                    </span>
                    <div>
                        <strong>30,000 online courses</strong>
                        <span class="text-muted">Enjoy a variety of fresh topics</span>
                    </div>
                </div>
                <div>
                    <span class="icon">
                        <i class="bi bi-people" />
                    </span>
                    <div>
                        <strong>Expert instruction</strong>
                        <span class="text-muted">Find the right instructor for you</span>
                    </div>
                </div>
                <div>
                    <span class="icon">
                        <i class="bi bi-clock" />
                    </span>
                    <div>
                        <strong>Lifetime access</strong>
                        <span class="text-muted">Learn on your schedule</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss">
    .homepage-banner {
        background-color: #754ffe;
        margin: -1rem;
        margin-bottom: 1rem;
        .first-view {
            display: flex;
            color: white;
            div.h3 {
                opacity: .6;
                padding: 1rem 0;
            }
            >div {
                padding: 1rem;
            }
            img {
                margin-left: auto;
                height: 120%;
            }
        }
        .d-grid > div {
            display: flex;
            padding: 1rem;
            align-items: center;
            span.icon {
                background-color: #ffeeda !important;
                color: #c28135 !important;
                border-radius: 50%;
                width: 3rem;
                height: 3rem;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 1rem;
            }
            strong {
                display: block;
            }
        }
    }
</style>
