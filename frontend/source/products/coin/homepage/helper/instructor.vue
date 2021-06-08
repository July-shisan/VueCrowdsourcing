<template>
    <div class="card shadow-sm instructor-card">
        <div class="card-title">
            <img :src="Detail.avatar" class="avatar shadow">
            <strong>{{Detail.name}}</strong>
            <small class="text-muted">{{Detail.profession}}</small>
        </div>
        <div class="card-body list-group-flush py-2">
            <div class="list-group-item">
                <span>Students</span>
                <label>{{Detail.students|comma}}</label>
            </div>
            <div class="list-group-item">
                <span>Instructor Rating</span>
                <label class="text-warning">{{Detail.rating}} <i class="bi bi-star-fill" /></label>
            </div>
            <div class="list-group-item">
                <span>Courses</span>
                <label class="text-muted">{{Detail.courses}}</label>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            Detail: {
                type: Object,
                required: true
            }
        }
    }
</script>
<style lang="scss">
    .instructor-card {
        .card-title {
            text-align: center;
            padding-top: .5rem;
            img {
                display: block;
                margin: 1rem auto;
                border-radius: 50%;
                height: 6rem;
                width: 6rem;
            }
            strong {
                display: block;
            }
        }
        .list-group-item {
            display: flex;
            :last-child {
                margin-left: auto;
            }
        }
    }
</style>
