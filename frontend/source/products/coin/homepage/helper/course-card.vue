<template>
    <div class="card teacher-card shadow-sm">
        <img :src="Detail.cover">
        <div class="position-relative p-3 flex-grow-1">
            <div class="card-title h5">
                <a :href="Detail.link" class="stretched-link">{{Detail.subject}}</a>
            </div>
            <div class="d-flex">
                <i class="bi bi-clock me-1" /><span>2h 30m</span>
                <svg class="mx-2 mt-1" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="8" width="2" height="6" rx="1" fill="#754FFE" />
                    <rect x="7" y="5" width="2" height="9" rx="1" fill="#754FFE" />
                    <rect x="11" y="2" width="2" height="12" rx="1" fill="#DBD8E9" />
                </svg> Intermediate
            </div>
            <div>
                <span class="text-warning">
                    <i class="bi bi-star-fill" />
                    <i class="bi bi-star-fill" />
                    <i class="bi bi-star-fill" />
                    <i class="bi bi-star-fill" />
                    <i class="bi bi-star-half" />
                    4.5
                </span>
                <small class="text-muted">(13,245)</small>
            </div>
        </div>
        <div class="card-footer text-muted">
            <img :src="Detail.instructor.avatar" class="avatar-xs">
            <span class="ms-2">{{Detail.instructor.name}}</span>
            <a href="#" class="ms-auto link-secondary" data-bs-toggle="tooltip" title="Add to Bookmarks">
                <i class="bi bi-bookmark" />
            </a>
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
    .card.teacher-card {
        border-radius: .5rem;
        overflow: hidden;
        a {
            text-decoration: none;
        }
        .card-footer {
            display: flex;
            align-items: center;
            padding: 1rem;
            border-top: 1px solid #6c757d3d;
            background: none;
        }
        .avatar-xs {
            width: 1.5rem;
            height: 1.5rem;
            border-radius: 50%;
        }
    }
</style>
