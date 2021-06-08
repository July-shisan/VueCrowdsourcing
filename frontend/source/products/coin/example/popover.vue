<template>
    <div>
        <Navigation />
        <div class="d-grid grid-col-2">
            <div>
                <div class="p-5">
                    <button type="button" class="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="right" title="Tooltip on right">
                        Tooltip on right
                    </button>
                </div>
                <div class="p-5">
                    <button type="button" class="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="top" title="Tooltip on top">
                        Tooltip on top
                    </button>
                </div>
            </div>
            <div>
                <div class="p-5">
                    <button type="button" class="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Tooltip on bottom">
                        Tooltip on bottom
                    </button>
                </div>
                <div class="p-5">
                    <button type="button" class="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="left" title="Tooltip on left">
                        Tooltip on left
                    </button>
                </div>
            </div>
        </div>

        <div class="d-grid grid-col-2">
            <div>
                <div class="p-5">
                    <button type="button" class="btn btn-secondary" data-container="body" data-bs-toggle="popover" data-bs-placement="right" :title="title" :data-bs-content="content">
                        Popover on right
                    </button>
                </div>
                <div class="p-5">
                    <button type="button" class="btn btn-secondary" data-container="body" data-bs-toggle="popover" data-bs-placement="top" :title="title" :data-bs-content="content">
                        Popover on top
                    </button>
                </div>
            </div>
            <div>
                <div class="p-5">
                    <button type="button" class="btn btn-secondary" data-container="body" data-bs-toggle="popover" data-bs-placement="bottom" :title="title" :data-bs-content="content">
                        Popover on bottom
                    </button>
                </div>
                <div class="p-5 d-flex">
                    <button type="button" class="btn btn-secondary" data-container="body" data-bs-toggle="popover" data-bs-placement="left" :title="title" :data-bs-content="content">
                        Popover on left
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                title: 'popover title',
                content: 'And here\'s some amazing content. It\'s very engaging. Right?'
            }
        }
    }
</script>
