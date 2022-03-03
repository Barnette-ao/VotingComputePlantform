<template>
	<div id="app">
		<el-container>
			<el-header>
				<div class="header">
					<div class="plateFormName">
						<el-button type="text" style="color:black">投票计算平台</el-button>
					</div>
					<div class="userProfile">
						<el-dropdown>
							<span class="el-dropdown-link">
								<i style="font-size:20px" class="el-icon-user"></i>
								<i class="el-icon-arrow-down el-icon--right"></i>
							</span>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item disabled>{{user.username}}</el-dropdown-item>
								<el-dropdown-item divided @click.native="information()">个人信息</el-dropdown-item>
								<el-dropdown-item divided @click.native="result()">投票结果</el-dropdown-item>
								<el-dropdown-item divided>退出</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</div>
				</div>
			</el-header>
			<el-container class="middle">
				<el-aside>
					<el-menu router :default-active="$route.path" class="el-menu-vertical-demo" >
						<el-menu-item index="/home">
							<i class="el-icon-location"></i>
							<span slot="title">Home</span>
						</el-menu-item>
						<el-menu-item index="/guide">
							<i class="el-icon-menu"></i>
							<span slot="title">用户指南</span>
						</el-menu-item>
					</el-menu>
				</el-aside>
				<el-main>
					<el-form ref="computeVoting" :model="computeVoting" style="width: auto">
						<el-row>
							<el-col :span="12">程序</el-col>
							<el-col :span="12">数据范例</el-col>
						</el-row>
						<el-row>
							<el-col style="margin-top:5px" :span="11">
								<el-form-item>
									<div align="left">
										<codemirror ref="mycode" v-model="computeVoting.votingRule"
											:options="cmOptions" />
									</div>
								</el-form-item>
							</el-col>
							<div class="line" :span="2" />
							<el-col style="margin-top:5px" :span="11">
								<el-form-item>
									<div align="left">
										<codemirror ref="mydata" v-model="computeVoting.dataExample"
											:options="cmOptions" />
									</div>
								</el-form-item>
							</el-col>
						</el-row>
						<el-form-item align="left">
							<el-button @click="execute()">运行</el-button>
						</el-form-item>
						<el-form-item label="运行结果" >
							<el-input v-model="computeVoting.computeResult" type="textarea" rows="5"
								style="margin-top:5px auto" />
						</el-form-item>
					</el-form>
					<el-dialog title="个人信息" :visible.sync="Showinformation" :close-on-click-modal="false" width="700px"
						direction="horizontal">
						<el-form ref="user" :model="user" style="width: auto" size="small">
							<el-form-item label="用户名">
								<el-input v-model="user.username" />
							</el-form-item>
							<el-form-item label="用户身份">
								<el-input v-model="user.roles" />
							</el-form-item>
							<el-form-item label="个人介绍">
								<el-input v-model="user.introduction" type="textarea" maxlength="256"
									show-word-limit rows="5" style="margin-top:5px auto" placeholder="在此填写" />
							</el-form-item>
							<el-form-item>
								<el-button @click="saveinformation()">保存修改</el-button>
								<el-button @click="Showinformation=false">取消修改</el-button>
							</el-form-item>
						</el-form>
					</el-dialog>
				</el-main>
				<el-aside>rightAside</el-aside>
			</el-container>
		</el-container>
		<router-view />
	</div>
</template>

<script>
	// @ is an alias to /src
	// import HelloWorld from '@/components/HelloWorld.vue'
	import {
		editUserInfo,
		getOnePlantformUser
	} from '@/api/user'
	
	import {
		computeVotingRule
	} from '@/api/votingRule'
	import {
		createVotingResult
	} from '@/api/votingResult'
	import {
		codemirror
	} from 'vue-codemirror'
	import "codemirror/theme/ambiance.css";
	require("codemirror/mode/javascript/javascript");

	export default {
		name: "Home",
		components: {
			codemirror
		},
		data() {
			return {
				user: {
					username: "",
					roles: "",
					introduction: ""
				},
				computeVoting: {
					votingRule: "",
					dataExample: "",
					computeResult:""
				},
				Showinformation: false,
				currentRow: null,
				cmOptions: {
					mode: "text/javascript",
					theme: "ambiance",
					indentUnit: 2,
					smartIndent: true,
					tabSize: 4,
					readOnly: false,
					showCurorWhereSelecting: true,
					lineNumbers: true,
					firstLineNumber: 1,
					cursorScrollMargin: 0
				},
				votingRule:{},
				votingResult:{
					ruleName:"",
					language:"",
					computeResult:"",
					isDelete:0,
					userId:""
				}
			};
		},
		mounted(){
			// console.log("路由参数",this.$route.params)
			this.votingRule = this.$route.params.votingRule
			console.log("votingRule:",this.votingRule)
			this.computeVoting.votingRule = this.$route.params.votingRuleProgram
			this.computeVoting.dataExample = this.$route.params.computeData
			this.user.username = sessionStorage.getItem('userName')
		},
		methods: {
			information() {
				var _userInfo = this.$store.state.user
				// console.log("当前的用户实例对象", _userInfo)
				getOnePlantformUser(_userInfo.id, {
					filter: {
						where: {
							state: 0
						}
					}
				}).then(response => {
					// console.log("这是选中编辑的用户", response)
					this.user = response
				})
				this.Showinformation = true;
			},
			result() {
				this.$router.push({
					path: "/result"
				});
			},
			saveinformation() {
				var _userInfo = this.$store.state.user
				editUserInfo(_userInfo.token, this.user).then(response => {
					// console.log("@@@编辑选中用户之后的表单", this.user)
					console.log("@@@编辑返回的表单", response),
					this.Showinformation = false
					this.$message({
						message: '编辑用户信息成功',
						type: 'success'
					});
				}).catch(error => {
					this.$message({
						message: '编辑用户信息失败',
						type: 'error'
					});
					console.log(error)
				})
			},
			setCurrent(row) {
				this.$refs.singleTable.setCurrentRow(row);
				this.$router.push({
					path: "/vote"
				});
			},
			execute(){
				// console.log("点击运行按钮之后传输的数据", this.votingRule)
				computeVotingRule({
					votingRule: this.votingRule
				}).then(response => {
					// console.log("点击运行按钮之后传输的数据", this.votingRule)
					// console.log("点击运行按钮之后的返回值", response),
					this.computeVoting.computeResult = response.computeResult
					// console.log("投票结果：",this.computeVoting.computeResult)
					this.votingResult.computeResult = this.computeVoting.computeResult
					// console.log("this.votingResult.computeResult：",this.votingResult.computeResult)
					this.createVotingResult()
					this.$message({
						message: '计算成功',
						type: 'success'
					});
				}).catch(error => {
					console.log(error)
					this.$message({
						message: '计算失败',
						type: 'error'
					});
				})
			},
			createVotingResult(){
				this.votingResult.ruleName = this.votingRule.ruleName
				this.votingResult.language = this.votingRule.language
				this.votingResult.userId = this.$store.state.user.id
				createVotingResult(this.votingResult).then(response => {
					console.log("保存的投票结果", response),
						this.$message({
							message: '保存投票结果成功',
							type: 'success'
						});
				}).catch(error => {
					console.log(error)
					this.$message({
						message: '保存投票结果失败',
						type: 'error'
					});
				});
			}
		}
	};
</script>

<style>
	* {
		margin: 0px;
	}

	#app {}

	.el-header,
	.el-footer {
		background-color: #b3c0d1;
		color: #333;
		height: 60px;
	}

	.el-header {
		padding: 0px 0px;
	}

	.header {
		width: 100%;
		background-color: #ddd;
		/* border: 2px solid black; */
	}

	.plateFormName {
		display: inline-block;
		float: left;
		line-height: 60px;
		width: 280px;
		color: #fff;
		text-align: center;
	}

	.searchBar {
		display: inline-block;
		margin-left: 30px;
		line-height: 60px;
		width: 500px;
		margin: 0 auto;
	}

	.middle {
		height: 880px;
	}

	.el-button {
		line-height: 60px;
		border-top-style: 1px solid black;
	}

	.el-aside {
		width: 100px;
		background-color: #d3dce6;
		color: #333;
		text-align: center;
		border-top-style: 2px solid black;
	}

	.el-main {
		background-color: #e9eef3;
		color: #333;
		text-align: center;
		border: 1px solid black;
	}

	.userProfile {
		display: inline-block;
		width: 200px;
		line-height: 60px;
		float: right;
	}

	.el-dropdown {
		height: 45px;
	}

	.el-dropdown-link {
		cursor: pointer;
		color: #409eff;
	}

	.el-icon-arrow-down {
		font-size: 12px;
	}

	.line {
		float: left;
		width: 0.1em;
		height: 20em;
		margin-right: 5px;
		margin-left: 5px;
		background: #0f0f0f;
	}
</style>
