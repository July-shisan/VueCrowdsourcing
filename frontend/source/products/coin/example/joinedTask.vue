<template>
    <div class="section">
        <div class="container">
            <div class="columns">
                <div class="column is-three-fifths is-offset-one-fifth">
                    <div class="box">
                        <div class="field is-horizontal">
                            <div class="field-body ">
                                <h3 class="title is-4" id="taskname">{{ a.task.task_name }} </h3>
                            </div>
                            <div class="field-body">
                                <div class="control">
                                    
                                    <a v-if="a.task.state === 'receiving' || a.task.state == 'joined'" class="button is-primary" style="background-color: red"
                                           href="">删除任务</a>
                                    
                                </div>
                            </div>
                        </div>
                        <div class="field is-horizontal">
                            <div class="field-body">
                                <label class="label">Type:</label>
                            </div>
                            <div class="field-body ">
                                {{ a.task.task_type }}
                            </div>
                        </div>

                        <div class="field is-horizontal">
                            <div class="field-body">
                                <label class="label">State:</label>
                            </div>
                            <div class="field-body ">
                                {{ a.task.state }}
                            </div>
                        </div>

                        <div class="field is-horizontal">
                            <div class="field-body">
                                <label class="label">Reward:</label>
                            </div>
                            <div class="field-body ">
                                {{ a.task.reward }}
                            </div>
                        </div>

                        <div class="field is-horizontal">
                            <div class="field-body">
                                <label class="label">Worker:</label>
                            </div>
                            <div class="field-body ">
                                {{ a.task.final_worker }}
                            </div>
                        </div>

                        <div class="field is-horizontal">
                            <div class="field-body">
                                <label class="label">Deadline:</label>
                            </div>
                            <div class="field-body ">
                                {{ a.task.deadline }}
                            </div>
                        </div>

                        <div class="field is-horizontal">
                            <div class="field-body">
                                <label class="label">Requirements:</label>
                            </div>
                            <div class="field-body ">
                                <!-- {{ a.task.worker_requirement.0 }} -->
                            </div>
                        </div>

                        <div class="field is-horizontal">
                            <div class="field-body">
                                <label class="label">Detail:</label>
                            </div>
                            <div class="field-body ">
                                {{ a.task.detail }}
                            </div>
                        </div>

                        <div class="field is-horizontal">
                            <div class="field-body">
                                <label class="label">Data:</label>
                            </div>
                            <div class="field-body ">
                                
                                <a v-for="da in a.task.data" :key="da.data_name" href="">{{ da.data_name }} </a>

                                
                            </div>
                        </div>
                        <div class="field is-horizontal">
                            <div class="field-body">
                                <label class="label">Score:</label>
                            </div>
                            <div class="field-body ">
                                {% if task.task_type == "competition" %}
                                    {% for can in task.candidate_worker_and_solution %}
                                        {% if can.candidate_worker == front_user %}
                                            {{ can.score }}
                                        {% endif %}
                                    {% endfor %}
                                {% else %}
                                    {{ task.final_score }}
                                {% endif %}
                            </div>
                        </div>
                        <br>
                        {% for solution in task.candidate_worker_and_solution %}
                            {% if solution.candidate_worker == front_user and not task.final_solution %}
                                <div class="field is-horizontal">
                                    <div class="field-body">
                                        <label class="label">YourSolution:</label>
                                    </div>
                                    {% if solution.candidate_solution %}
                                        <div class="field-body ">
                                            <a href="/download/{{ solution.candidate_solution.data_hash }}/{{ solution.candidate_solution.data_name }}">{{ solution.candidate_solution.data_name }} </a>
                                        </div>
                                    {% endif %}
                                </div>
                                <br>
                            {% endif %}
                        {% endfor %}
                        {% if task.final_solution %}
                            <div class="field is-horizontal">
                                <div class="field-body">
                                    <label class="label">FinalSolution:</label>
                                </div>
                                <div class="field is-vertical ">
                                    <a href="/download/{{ task.final_solution.data_hash }}/{{ task.final_solution.data_name }}">{{ task.final_solution.data_name }}</a>
                                </div>
                            </div>
                            <br>
                        {% endif %}
                        <br><br>
                        <h3 class="title is-4">Commit </h3>
                        {% if task.task_type == "competition" %}
                            <form method="post" enctype="multipart/form-data">
                                {% csrf_token %}
                                <div class="field is-horizontal">
                                    <div class="field-label is-normal">
                                        <label class="label">csvFile</label>
                                    </div>
                                    <div class="field-body">
                                        <input type="file" name="scoreFile" id="csvfile">
                                    </div>
                                </div>
                            </form>
                            <br>
                            <div class="field is-horizontal">
                                <div class="field-label is-normal">
                                    <label class="label"></label>
                                </div>
                                <div class="field-body">
                                    <button class="button is-success">TestScore</button>
                                </div>
                            </div>
                            <br>
                            <table class="table is-fullwidth">
                                <thead>
                                <tr>
                                    <th><abbr title="fileName">fileName</abbr></th>
                                    <th><abbr title="Score">Score</abbr></th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td id="name"></td>
                                    <td id="result"></td>
                                </tr>
                                </tbody>
                            </table>
                        {% endif %}
                        <br>
                        <form action="/mytask/{{ task.task_id }}" method="post" accept-charset="UTF-8"
                              enctype="multipart/form-data">
                            {% csrf_token %}
                            <div class="field is-horizontal">
                                <div class="field-label is-normal">
                                    <label class="label">Solutions</label>
                                </div>
                                <div class="field-body">
                                    <div class="field">
                                        <div class="control">
                                            <input class="input" name="solution" type="file" required
                                                   value="">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="field is-horizontal">
                                <div class="field-label is-normal">
                                    <label class="label">Encryption</label>
                                </div>
                                <div class="field-body">
                                    <div class="field">
                                        <div class="control">
                                            <input type="radio" name="flag" value="yes" onclick="displaykey(this)"/> yes
                                            <input type="radio" name="flag" value="no" onclick="displaykey(this)"/> no
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="key" style="display: none">
                                <div class="field is-horizontal">
                                    <div class="field-label is-normal">
                                        <label class="label">Public Key</label>
                                    </div>
                                    <div class="field-body">
                                        <div class="field">
                                            <div class="control">
                                                <input class="input" name="public_key" type="text"
                                                       placeholder="give the user name of public key" value="">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="field is-horizontal">
                                <div class="field-label is-normal">
                                    <label class="label">Result</label>
                                </div>
                                <div class="field-body">
                                    <div class="field">
                                        <div class="control">
                                            <input class="input" name="result" type="file" accept=".csv" required
                                                   value="">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="field is-horizontal">
                                <div class="field-label is-normal">
                                </div>
                                <div class="field-body">
                                    <div class="field">
                                        <div class="control">
                                            <div class="content is-small">
                                                {#                                                <span class="gradient-highlight">Please note that all submitted products go through an approval process.</span>#}
                                            </div>
                                            <input class="button is-success" type="submit" value="Commit">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <br>
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
            this.request('http://192.168.2.139:8000/mytask/'+id, {}, 'GET')
                .resolve((success) => {
                    this.a = success
                    console.log('success')
                    // data = {"title": "Mytask", "task": task,}
                })
                .reject((error, body, href) => {
                    console.log(error, body, href)
                })
        },
        mounted() {},
        methods: {},
    }
    // function displaykey(flag) {
    //     if (flag.value == "yes") {
    //         document.getElementById("key").style.display = "inline"
    //     } else {
    //         document.getElementById("key").style.display = "none"
    //     }
    // }
    // $(document).ready(function () {
    //     setInterval(CheckLogin, 5000);
    // });
    // function CheckLogin() {
    //     $.ajax({
    //         type: "POST",
    //         url: "/CheckLogin/",
    //         data: {csrfmiddlewaretoken: '{{ csrf_token }}'},
    //         success: function (data) {
    //             if (data != null && data != "" && data != undefined) {
    //                 alert('你的帐号已在别处登陆，你被强迫下线！');
    //                 window.open('/login', 'login');
    //                 window.location.href = "/login/";
    //             }
    //             return true;
    //         },
    //         error: function (ex) {
    //             return false;
    //         }
    //     });

    // }
    // window.onload = function (ev) {
    //     var btn = document.querySelector('button');
    //     var result = document.getElementById('result');
    //     var name = document.getElementById('name');
    //     btn.onclick = function (ev2) {
    //         var csvfile = $('#csvfile');
    //         var formdata = new FormData();
    //         formdata.append('csvfile', csvfile[0].files[0]);
    //         formdata.append('csrfmiddlewaretoken', '{{ csrf_token }}');
    //         formdata.append('author', '{{ task.requester }}')
    //         formdata.append('taskId', '{{ task.task_id }}');
            
    //         $.ajax({
    //             type: "POST",
    //             url: "/score/",
    //             data: formdata,
    //             processData: false,
    //             contentType: false,
    //             success: function (msg) {
    //                 name.innerText = csvfile[0].files[0].name;
    //                 result.innerText = msg; 
    //             },
    //             error: function (xhr) {
    //                 alert(xhr.status);
    //             }
    //         });
            
    //     }
    // }
</script>