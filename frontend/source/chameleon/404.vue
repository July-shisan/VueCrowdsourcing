<template>
    <div id="PageNotFound" />
</template>
<script type="text/javascript">
    export default {
        created() {
            this.timer = setTimeout(noop => {
                this.$router.replace('/', noop => {})
            }, 2000)
        },
        destroyed() {
            clearTimeout(this.timer)
        }
    }
</script>
