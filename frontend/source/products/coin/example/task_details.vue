<template>
    <div class="section">
        <div class="container">
            <div class="columns">
                <div class="column is-three-fifths is-offset-one-fifth">
                    <div class="box">
                        <form action="" method="post" accept-charset="UTF-8" enctype="multipart/form-data">
                            <div class="columns">
                                <div class="column is-three-quarters">
                                    <h3 class="title is-4">{{ task.task_name }} </h3>
                                </div>
                            </div>
                            <div class="field is-horizontal">
                                <div class="field-body">
                                    <label class="label">Type:</label>
                                </div>
                                <div class="field-body ">
                                    {{ task.task_type }}
                                </div>
                            </div>
                            <div class="field is-horizontal">
                                <div class="field-body">
                                    <label class="label">State:</label>
                                </div>
                                <div class="field-body ">
                                    {{ task.state }}
                                </div>
                            </div>

                            <div class="field is-horizontal">
                                <div class="field-body">
                                    <label class="label">Reward:</label>
                                </div>
                                <div class="field-body ">
                                    {{ task.reward }}
                                </div>
                            </div>

                            <div class="field is-horizontal">
                                <div class="field-body">
                                    <label class="label">Receive Time:</label>
                                </div>
                                <div class="field-body ">
                                    {{ task.receive_time }}
                                </div>
                            </div>

                            <div class="field is-horizontal">
                                <div class="field-body">
                                    <label class="label">Deadline:</label>
                                </div>
                                <div class="field-body ">
                                    {{ task.deadline }}
                                </div>
                            </div>

                            <div class="field is-horizontal">
                                <div class="field-body">
                                    <label class="label">FinalWorker:</label>
                                </div>
                                <div class="field-body ">
                                    {{ task.final_worker }}
                                </div>
                            </div>

                            <div class="field is-horizontal">
                                <div class="field-body">
                                    <label class="label">Requirements:</label>
                                </div>
                                <div class="field-body " />
                            </div>

                            <div class="field is-horizontal">
                                <div class="field-body">
                                    <label class="label">Detail:</label>
                                </div>
                                <div class="field-body ">
                                    {{ task.detail }}
                                </div>
                            </div>

                            <div class="field is-horizontal">
                                <div class="field-body">
                                    <label class="label">Solution:</label>
                                </div>
                                <div class="field is-vertical ">
                                    {{ task.final_solution.data_name }}
                                    <br>
                                    {{ task.final_solution.data_hash }}
                                </div>
                            </div>
                            <br><br>

                            <div class="field is-horizontal">
                                <div class="field-body" />
                                <div class="field-body">
                                    <div class="control">
                                        <a class="button is-primary" href="">download solution</a>
                                    </div>
                                </div>
                            </div>
                            <br>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                a: {},
            }
        },
        created() {
            let id = this.$route.params.id
            console.log(id)
            this.request('http://192.168.2.139:8000/task/retrieveAbstract/' + id, {}, 'GET')
                .resolve((success) => {
                    this.a = success
                    console.log('success')
                })
                .reject((error, body, href) => {
                    console.log(error, body, href)
                })
        },
        mounted() {},
        methods: {},
    }
</script>