<template>
    <LoginRecords :self="true" />
</template>
<script>
    export default {
        components: {
            LoginRecords: () => import('./login-records'),
        }
    }
</script>
