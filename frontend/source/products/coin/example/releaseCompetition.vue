<template>
    <div>
        <div id="background" class="background" style="display: none;" />
        <div id="loading" class="loading-img" style="display: none;">
            <img src="" alt="loading">
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
                            <form id="form1" class="" action="" method="post" accept-charset="UTF-8"
                                  enctype="multipart/form-data" onsubmit="loading()"
                            >
                                <div class="field is-horizontal">
                                    <span style="color: red;">*</span>
                                    <div class="field-label is-normal">
                                        <label class="label">任务类型</label>
                                    </div>
                                    <div class="field-body">
                                        <div class="control">
                                            竞赛式任务 &nbsp;
                                        </div>

                                        <div class="control">
                                            <a class="text-next-to-button" href="/releaseOne2One">一对一任务</a>
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
                                                <input id="title" class="input" name="title" type="text" placeholder="" value="" required>
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
                                                <select name="type" style="height: 35px; border-color: lightgrey; font-size: inherit;">
                                                    <option selected value="competition">competition</option>
                                                    <option value="one2one">one2one</option>
                                                    <option value="private">private</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="field is-horizontal">
                                    <span style="color: red;">*</span>
                                    <div class="field-label is-normal">
                                        <label class="label">行业标签</label>
                                    </div>
                                    <div class="field-body">
                                        <div class="control">
                                            <label class="radio">
                                                <input type="radio" name="chtype" value="Conceptualization" required>预测性维护
                                            </label>
                                            <label class="radio">
                                                <input type="radio" name="chtype" value="Conceptualization" required>健康管理
                                            </label>
                                            <label class="radio">
                                                <input type="radio" name="chtype" value="Conceptualization" required>仿真设计
                                            </label>
                                            <label class="radio">
                                                <input type="radio" name="chtype" value="Conceptualization" required>PDM
                                            </label>
                                            <label class="radio">
                                                <input type="radio" name="chtype" value="Conceptualization" required>在线监测
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
                                                <textarea id="details" class="textarea"
                                                          name="detail" placeholder="任务详细信息" rows="10"
                                                          required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="field is-horizontal">
                                    <div class="field-label is-normal">
                                        <label class="label">开发技能</label>
                                    </div>
                                    <div class="field-body">
                                        <div class="field">
                                            <div class="control">
                                                <input id="technology" class="input" name="technology" type="text" placeholder=""
                                                       value=""
                                                >
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="field is-horizontal">
                                    <div class="field-label is-normal">
                                        <label class="label" />
                                    </div>
                                    <div class="field-body">
                                        <div class="tags">
                                            <span class="tag is-primary is-light" name="JavaScript" onclick="tag(this)">JavaScript</span>
                                            <span class="tag is-primary is-light" name="JAVA"
                                                  onclick="tag(this)"
                                            >JAVA</span>
                                            <span class="tag is-primary is-light" name="HTML"
                                                  onclick="tag(this)"
                                            >HTML</span>
                                            <span class="tag is-primary is-light" name="CSS" onclick="tag(this)">CSS</span>
                                            <span class="tag is-primary is-light" name="J2EE"
                                                  onclick="tag(this)"
                                            >J2EE</span>
                                            <span class="tag is-primary is-light" name="Spring"
                                                  onclick="tag(this)"
                                            >Spring</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="field is-horizontal">
                                    <div class="field-label is-normal">
                                        <label class="label" />
                                    </div>

                                    <div id="TecRec" class="field-body" style="display: none;">
                                        为你推荐：
                                        <span id="mytag" class="tag is-primary is-light" name=""
                                              onclick="mytag(this)"
                                        />
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
                                                       value="0" required
                                                >
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
                                                       max="2026-12-12T00:00:00" min="2020-01-01T00:00:00" value=""
                                                >
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
                                                       min="2020-01-01T00:00:00" value="" max="2026-12-12T00:00:00"
                                                >
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
                                                       min="0" max="100" required
                                                >
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
                                                <input class="input" name="data" type="file" value="">
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="field is-horizontal">
                                    <div class="field-label is-normal" />
                                    <div class="field-body">
                                        <div class="field">
                                            <div class="control">
                                                <div class="content is-small" />
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
