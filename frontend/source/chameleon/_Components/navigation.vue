<template>
    <div id="Crumbs" :class="{'border rounded breadcrumb':Crumbs.length}">
        <span v-for="(item, id) in Crumbs" :key="id" class="breadcrumb-item">{{item}}</span>
        <div class="flex-fill text-end">
            <slot />
        </div>
    </div>
</template>
<script>
    export default {
        name: 'Navigation',
        props: {
            items: {
                type: Array,
                default: () => []
            },
        },
        computed: {
            Crumbs() {
                let items = [],
                    { Navi } = this.Meta,
                    { Menus, Singleton } = this.Helper,
                    { menu, navi, menu_id, navi_id } = Menus[Navi] || Singleton[Navi] || {}
                menu = this.translate(menu_id, 'menu') || menu
                navi = this.translate(navi_id, 'navi') || navi
                menu && items.push(menu)
                navi == menu || navi && items.push(navi)
                return [...items, ...this.items]
            },
        },
    }
</script>
<style lang="scss">
    #Crumbs.breadcrumb {
        padding: .5rem .75rem;
        background-color: var(--bs-white);
        .breadcrumb-item {
            align-self: center;
            &:nth-last-child(2) {
                color: var(--bs-blue);
            }
        }
    }
</style>
