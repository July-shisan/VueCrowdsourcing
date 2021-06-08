<template>
    <div>
        <Navigation />
        <HomeBanner />
        <div>hello world!</div>
        <div><button type="button" class="btn btn-primary" @click="toggleNavi">切换显示导航菜单</button></div>
        <div>
            <router-link to="/login/records">跳转后恢复导航菜单</router-link>
        </div>
        <div class="container h3">
            基本技能要求
        </div>
        <div class="container d-grid grid-col-4 flex-grow-0 mb-3">
            <CourseCard v-for="item in Courses" :key="item.subject" :Detail="item" />
        </div>
        <div class="container h3">
            讲师
        </div>
        <div class="container d-grid grid-col-4 flex-grow-0 mb-3">
            <Instructor v-for="item in Instructors" :key="item.name" :Detail="item" />
        </div>
    </div>
</template>
<script>
    export default {
        components: {
            HomeBanner: () => import('./helper/banner.vue'),
            CourseCard: () => import('./helper/course-card.vue'),
            Instructor: () => import('./helper/instructor.vue')
        },
        data() {
            return {
                Courses: [],
                Instructors: []
            }
        },
        created() {
            this.Helper.FullScreen = true
            this.RefreshContents()
        },
        destroyed() {
            this.Helper.FullScreen = false
        },
        methods: {
            RefreshContents() {
                this.LoadCourses()
                this.LoadInstructors()
            },
            LoadCourses() {
                let success = [ //
                    {
                        cover: 'https://codescandy.com/geeks/assets/images/course/course-javascript.jpg',
                        subject: 'Getting Started with JavaScript',
                        link: '#',
                        instructor: {
                            avatar: 'https://codescandy.com/geeks/assets/images/avatar/avatar-2.jpg',
                            name: 'Ted Hawkins'
                        },
                    },
                    {
                        cover: 'https://codescandy.com/geeks/assets/images/course/course-css.jpg',
                        subject: 'CSS: ultimate CSS course from beginner to advanced',
                        link: '#',
                        instructor: {
                            avatar: 'https://codescandy.com/geeks/assets/images/avatar/avatar-3.jpg',
                            name: 'Juanita Bell'
                        },
                    },
                    {
                        cover: 'https://codescandy.com/geeks/assets/images/course/course-vue.jpg',
                        subject: 'GraphQL: introduction to graphQL for beginners',
                        link: '#',
                        instructor: {
                            avatar: 'https://codescandy.com/geeks/assets/images/avatar/avatar-2.jpg',
                            name: 'Ted Hawkins'
                        },
                    },
                    {
                        cover: 'https://codescandy.com/geeks/assets/images/course/course-node.jpg',
                        subject: 'Angular - the complete guide for beginner',
                        link: '#',
                        instructor: {
                            avatar: 'https://codescandy.com/geeks/assets/images/avatar/avatar-3.jpg',
                            name: 'Juanita Bell'
                        },
                    }
                ]
                // this.request('some/api/to/request/courses', {}).resolve(success => {
                this.Courses = success
                // })
            },
            LoadInstructors() {
                let success = [ //
                    {
                        avatar: 'https://codescandy.com/geeks/assets/images/avatar/avatar-11.jpg',
                        name: 'Wade Warren',
                        profession: 'Web Developer, Designer',
                        students: 50274,
                        rating: 4.5,
                        courses: 12
                    },
                    {
                        avatar: 'https://codescandy.com/geeks/assets/images/avatar/avatar-13.jpg',
                        name: 'Dianna Smiley',
                        profession: 'Engineering Architect',
                        students: 1004,
                        rating: 4.5,
                        courses: 42
                    },
                    {
                        avatar: 'https://codescandy.com/geeks/assets/images/avatar/avatar-14.jpg',
                        name: 'Esther Howard',
                        profession: 'Developer and Instructor',
                        students: 26060,
                        rating: 4.5,
                        courses: 3
                    },
                    {
                        avatar: 'https://codescandy.com/geeks/assets/images/avatar/avatar-15.jpg',
                        name: 'Guy Hawkins',
                        profession: 'Professional Web Developer',
                        students: 2345,
                        rating: 4.5,
                        courses: 2
                    },
                ]
                // this.request('some/api/to/request/instructors', {}).resolve(success => {
                this.Instructors = success
                // })
            },
            toggleNavi() {
                this.Helper.FullScreen ^= 1
            }
        }
    }
</script>
