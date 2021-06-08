<template>
    <div>
        <div id="background" class="background" style="display: none;"></div>
        <div id="loading" class="loading-img" style="display: none;"><img src="{% static 'images/43.gif' %}" alt="loading">
        </div>
        <div id="intro" class="txt" style="display: none;">正在为您推荐开发者...</div>
        <section class="hero is-info is-light">
            <div class="hero-body">
                <div class="columns">
                    <div class="column is-10 is-offset-1">
                        <section class="hero landing-left">
                            <div>
                                <h3 class="title has-text-centered ">
                                    <p>Make Things Easier!</p>
                                </h3>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </section>
        <div class="section">
            <div class="container">
                <li class="box">
                    <div class="columns is-centered">
                        <div class="column is-half-desktop is-two-thirds-tablet">
                            <form class="" action="" method="post" accept-charset="UTF-8" enctype="multipart/form-data"
                                id="form1" onsubmit="loading()">
                                <div class="field is-horizontal">
                                    <span style="color: red;">*</span>
                                    <div class="field-label is-normal">
                                        <label class="label">任务类型</label>
                                    </div>
                                    <div class="field-body">
                                            <div class="control">
                                            <a class="text-next-to-button" href="/release">竞赛式任务</a> &nbsp;
                                            </div>
                                            <div class="control">
                                                一对一任务
                                            </div>
                                    </div>
                                </div>
                                <div class="field is-horizontal">
                                    <span style="color: red;">*</span>
                                    <div class="field-label is-normal">
                                        <label class="label">行业分类</label>
                                    </div>
                                    <div class="field-body">
                                        <div class="control">
                                            <div class="select" name="technology" id="technology">
                                                <select name="technology">
                                                    <option value="预测性维护类">预测性维护类</option>
                                                    <option value="通用机械">通用机械类</option>
                                                    <option value="航天">航天类</option>
                                                    <option value="控制设计">控制设计类</option>
                                                    <option value="传动系统">传动系统类</option>
                                                    <option value="仿真类">仿真类</option>
                                                    <option value="工业app测试">工业app测试</option>
                                                    <option value="产品设计类">产品设计类</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="field is-horizontal">
                                    <span style="color: red;">*</span>
                                    <div class="field-label is-normal">
                                        <label class="label">任务名称</label>
                                    </div>
                                    <div class="field-body">
                                        <div class="field">
                                            <div class="control">
                                                <input class="input" name="title" type="text"
                                                    placeholder="Give a brief description" value='' id="title" required>
                                                <p id="notice" style="display: none; color: red;">任务名称不能包括-等特殊字符.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="field is-horizontal" style="display: none;">
                                    <div class="field-label is-normal">
                                        <label class="label">任务类型</label>
                                    </div>
                                    <div class="field-body">
                                        <div class="field">
                                            <div class="control">
                                                <select name="type"
                                                        style="height: 35px; border-color: lightgrey; font-size: inherit;">
                                                    <option value="competition">competition</option>
                                                    <option selected value="one2one">one2one</option>
                                                    <option value="private">private</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="field is-horizontal" style="display: none;">
                                    <span style="color: red;">*</span>
                                    <div class="field-label is-normal">
                                        <label class="label">Tasktype</label>
                                    </div>
                                    <div class="field-body">
                                        <div class="control">
                                            <label class="radio">
                                                <input type="radio" name="chtype" value="Bug Hunt">预测性维护
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div class="field is-horizontal">
                                    <span style="color: red;">*</span>
                                    <div class="field-label is-normal">
                                        <label class="label">详细信息</label>
                                    </div>
                                    <div class="field-body">
                                        <div class="field">
                                            <div class="control">
                                                <textarea class="textarea" name="detail"
                                                        placeholder="Task detailed" id="details" rows="10"
                                                        required></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="field is-horizontal">
                                    <span style="color: red;">*</span>
                                    <div class="field-label is-normal">
                                        <label class="label">奖金数</label>
                                    </div>
                                    <div class="field-body">
                                        <div class="field">
                                            <div class="control">
                                                <input class="input" name="award" type="number" min="0" max="99999999" placeholder="$"
                                                    value="0" required>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="field is-horizontal">
                                    <span style="color: red;">*</span>
                                    <div class="field-label is-normal">
                                        <label class="label">接受截止时间</label>
                                    </div>
                                    <div class="field-body">
                                        <div class="field">
                                            <div class="control">
                                                <input class="input" name="recievetime" type="datetime-local" step="1"
                                                    value="">
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="field is-horizontal">
                                    <span style="color: red;">*</span>
                                    <div class="field-label is-normal">
                                        <label class="label">提交截止时间</label>
                                    </div>
                                    <div class="field-body">
                                        <div class="field">
                                            <div class="control">
                                                <input class="input" name="deadline" type="datetime-local" step="1"
                                                    value="">
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="field is-horizontal">
                                    <span style="color: red;">*</span>
                                    <div class="field-label is-normal">
                                        <label class="label">信誉要求</label>
                                    </div>
                                    <div class="field-body">
                                        <div class="field">
                                            <div class="control">
                                            <input class="input" name="requirment" type="number"
                                                    min="0" max="100" required>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div class="field is-horizontal">
                                    <div class="field-label is-normal">
                                        <label class="label">数据上传</label>
                                    </div>
                                    <div class="field-body">
                                        <div class="field">
                                            <div class="control">
                                                <input class="input" name="data" type="file"
                                                    value="" >
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
                                                    <span class="gradient-highlight">Please note that all submitted products go through an approval process.</span>
                                                </div>
                                                
                                                <button class="button is-success">提交</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </li>
            </div>
        </div>
    </div>
</template>
<script>
   
</script>
<style type="text/css">
        .background {
            display: block;
            height: 100%;
            width: 100%;
            opacity: 0.7;
            filter: alpha(opacity=70);
            background: white no-repeat;
            position: fixed;
            left: 0;
            top: 0;
            z-index: 1000;
        }

        .loading-img {
            display: block;
            width: 100px;
            height: 100px;
            position: fixed;
            top: 40%;
            left: 50%;
            z-index: 2001;
        }

        .txt {
            display: block;
            position: fixed;
            top: 50%;
            left: 48%;
            line-height: 27px;
            font-weight: bold;
            z-index: 2000;
        }
    </style>
